import { applicationFormSchema } from '@/lib/application-form-schema'
import { generateApplicationPdf } from '@/lib/pdf'
import { tryCatchAsync } from '@workspace/shared/error-handling/result'
import { NextRequest } from 'next/server'

export const POST = async (request: NextRequest) => {
    const formData = await request.formData()
    const input = applicationFormDataFromFormData(formData)
    const parsed = applicationFormSchema.safeParse(input)

    if (!parsed.success) {
        console.error('ZOD_VALIDATION_FAILED')
        return Response.json({ error: 'Bad request' }, { status: 400 })
    }

    const first = sanitizeFilenamePart(parsed.data.firstName)
    const last = sanitizeFilenamePart(parsed.data.lastName)
    const base =
        first || last
            ? `${last}-${first}`.replace(/^-+|-+$/g, '')
            : 'application'
    const pdfFilename = `bewerbung-${base || 'application'}.pdf`

    const logoUrl = new URL('/ir-germany-logo.png', request.nextUrl.origin)
    const logoResponseResult = await tryCatchAsync(() => fetch(logoUrl))
    if (logoResponseResult.isErr()) {
        console.error('FETCH_LOGO_REQUEST_FAILED')
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }

    const logoResponse = logoResponseResult.value
    if (!logoResponse.ok) {
        console.error('FETCH_LOGO_REQUEST_NOT_OKAY')
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
    const logoContent = new Uint8Array(await logoResponse.arrayBuffer())

    const pdfBytesResult = await tryCatchAsync(() =>
        generateApplicationPdf({
            logo: new File([logoContent], 'logo.png', {
                type: 'image/png',
            }),
            ...parsed.data,
        })
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
        sendPdfToTelegram(pdfBytesResult.value, pdfFilename)
    )

    if (telegramResult.isErr()) {
        console.error('TELEGRAM_REQUEST_FAILED')
        return Response.json(
            { error: 'Internal server error' },
            { status: 502 }
        )
    }

    return Response.json({ success: true }, { status: 200 })
}

function formString(formData: FormData, key: string): string {
    const v = formData.get(key)
    return typeof v === 'string' ? v : ''
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

async function sendPdfToTelegram(pdfBytes: Uint8Array, pdfFilename: string) {
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
    const rawWorkSector = formString(formData, 'workSector')
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
        driverLicense: formString(formData, 'driverLicense'),
        canRideBike: formOptionalBool(formData, 'canRideBike'),
        shiftWork: formOptionalBool(formData, 'shiftWork'),
        healthRestrictions: formString(formData, 'healthRestrictions'),
        allergies: formString(formData, 'allergies'),
        clothingSize: formString(formData, 'clothingSize'),
        shoeSize: formString(formData, 'shoeSize'),
        hasBeenInGermanyBefore: formOptionalBool(
            formData,
            'hasBeenInGermanyBefore'
        ),
        previousStayPlace: formString(formData, 'previousStayPlace'),
        previousStayPeriodFrom: formString(formData, 'previousStayPeriodFrom'),
        previousStayPeriodTo: formString(formData, 'previousStayPeriodTo'),
        emergencyContactName: formString(formData, 'emergencyContactName'),
        emergencyPhone: formString(formData, 'emergencyPhone'),
        workSector: rawWorkSector.trim() === '' ? undefined : rawWorkSector,
    }
}
