import { cacheSuccessfulApplication } from '@/lib/application-cache'
import { applicationFormSchema } from '@/lib/application-form-schema'
import { generateRemoteApplicationPdf } from '@/lib/pdf'
import { env } from '@/env'
import { tryCatchAsync } from '@workspace/shared/error-handling/result'
import { NextRequest } from 'next/server'
import { uploadFileToStorage } from '@workspace/file-upload/s3-client'
import crypto from 'crypto'

export const POST = async (request: NextRequest) => {
    const formData = await request.formData()
    const input = applicationFormDataFromFormData(formData)
    const parsed = applicationFormSchema.safeParse(input)

    if (!parsed.success) {
        console.error('ZOD_VALIDATION_FAILED', parsed.error)
        return Response.json({ error: 'Bad request' }, { status: 400 })
    }

    const firstName = sanitizeFilenamePart(parsed.data.firstName)
    const lastName = sanitizeFilenamePart(parsed.data.lastName)

    const base = `${lastName}-${firstName}-${crypto.randomUUID()}`.replace(
        /^-+|-+$/g,
        ''
    )
    const filename = sanitizeFilenamePart(parsed.data.foto.name) || 'foto.jpg'
    const fotoKey = `applications/${base}/foto/${Date.now()}-${filename}`

    const fotoUploadResult = await uploadFileToStorage({
        file: parsed.data.foto,
        bucket: env.S3_BUCKET_NAME,
        fileKey: fotoKey,
    })
    if (fotoUploadResult.isErr()) {
        console.error('FOTO_UPLOAD_FAILED', fotoUploadResult.error)
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }

    const pdfBytesResult = await tryCatchAsync(() =>
        generateRemoteApplicationPdf(parsed.data)
    )
    if (pdfBytesResult.isErr()) {
        console.log('GENERATE_APPLICATION_PDF_ERROR', pdfBytesResult.error)
        return Response.json(
            {
                error: 'Internal server error',
            },
            {
                status: 500,
            }
        )
    }
    const telegramResult = await tryCatchAsync(() =>
        sendPdfToTelegram(
            pdfBytesResult.value,
            `${firstName} ${lastName}.pdf`,
            `${process.env.NODE_ENV === 'development' ? 'TEST - ' : ''}${parsed.data.firstName} ${parsed.data.lastName}`.trim()
        )
    )

    if (telegramResult.isErr()) {
        console.error('TELEGRAM_REQUEST_FAILED')
        return Response.json(
            { error: 'Internal server error' },
            { status: 502 }
        )
    }

    const fotoS3Url = buildApplicationFotoUrl(fotoKey)
    if (process.env.NODE_ENV === 'production') {
        const cacheResult = await tryCatchAsync(() =>
            cacheSuccessfulApplication(parsed.data, fotoS3Url)
        )
        if (cacheResult.isErr()) {
            console.error('REDIS_CACHE_FAILED', cacheResult.error)
        }
    }

    return Response.json({ success: true }, { status: 200 })
}

function formString(formData: FormData, key: string): string {
    const v = formData.get(key)
    return typeof v === 'string' ? v : ''
}

function formStringArray(formData: FormData, key: string): string[] {
    return formData
        .getAll(key)
        .filter((v): v is string => typeof v === 'string')
        .map((v) => v.trim())
        .filter((v) => v !== '')
}

function formOptionalBool(
    formData: FormData,
    key: string
): boolean | undefined {
    const v = formData.get(key)
    if (v === null) return undefined
    if (v === 'true') return true
    if (v === 'false') return false
    return undefined
}

function sanitizeFilenamePart(value: string): string {
    return value.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 60)
}

function buildApplicationFotoUrl(fileKey: string): string {
    const prefix =
        process.env.NODE_ENV === 'development' ? `${env.S3_BUCKET_NAME}/` : ''
    return `${env.S3_ENDPOINT}/${prefix}${fileKey}`
}

async function sendPdfToTelegram(
    pdfBytes: Uint8Array,
    pdfFilename: string,
    caption: string
) {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!token?.trim() || !chatId?.trim()) {
        console.warn(
            'TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set; skipping Telegram send'
        )
        return
    }

    const body = new FormData()
    body.append('chat_id', chatId)
    const pdfCopy = Uint8Array.from(pdfBytes)
    body.append(
        'document',
        new Blob([pdfCopy], { type: 'application/pdf' }),
        pdfFilename
    )
    body.append('caption', caption)

    const res = await fetch(
        `https://api.telegram.org/bot${token}/sendDocument`,
        {
            method: 'POST',
            body,
        }
    )

    const json = (await res.json()) as { ok?: boolean; description?: string }

    if (!res.ok || !json.ok) {
        console.error('Telegram sendDocument failed:', json)
        throw new Error(json.description ?? 'Telegram API error')
    }
}

function applicationFormDataFromFormData(formData: FormData) {
    const emailRaw = formString(formData, 'email')
    const germanLevelRaw = formString(formData, 'germanLevel')
    return {
        firstName: formString(formData, 'firstName'),
        lastName: formString(formData, 'lastName'),
        gender: formString(formData, 'gender'),
        birthDate: formString(formData, 'birthDate'),
        birthPlace: formString(formData, 'birthPlace'),
        birthCountry: formString(formData, 'birthCountry'),
        street: formString(formData, 'street'),
        postalCode: formString(formData, 'postalCode'),
        city: formString(formData, 'city'),
        country: formString(formData, 'country'),
        nationality: formString(formData, 'nationality') || 'Georgisch',
        email: emailRaw.trim() === '' ? undefined : emailRaw,
        phone: formString(formData, 'phone'),
        instagram: formString(formData, 'instagram'),
        taxId: formString(formData, 'taxId'),
        foto: formData.get('foto'),
        university: formString(formData, 'university'),
        studySubject: formString(formData, 'studySubject'),
        semesterBreakFrom: formString(formData, 'semesterBreakFrom'),
        semesterBreakTo: formString(formData, 'semesterBreakTo'),
        germanLevel: germanLevelRaw.trim() === '' ? undefined : germanLevelRaw,
        otherLanguages: formString(formData, 'otherLanguages'),
        driverLicense: formOptionalBool(formData, 'driverLicense'),
        canRideBike: formOptionalBool(formData, 'canRideBike'),
        shiftWork: formOptionalBool(formData, 'shiftWork'),
        healthRestrictions: formString(formData, 'healthRestrictions'),
        allergies: formString(formData, 'allergies'),
        clothingSize: formString(formData, 'clothingSize'),
        shoeSize: formStringArray(formData, 'shoeSize'),
        hasBeenInGermanyBefore: formOptionalBool(
            formData,
            'hasBeenInGermanyBefore'
        ),
        previousStayPlace: formString(formData, 'previousStayPlace'),
        previousStayPeriodFrom: formString(formData, 'previousStayPeriodFrom'),
        previousStayPeriodTo: formString(formData, 'previousStayPeriodTo'),
        emergencyContactName: formString(formData, 'emergencyContactName'),
        emergencyPhone: formString(formData, 'emergencyPhone'),
        workSector: formStringArray(formData, 'workSector'),
    }
}
