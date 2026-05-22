import type { ApplicationFormData } from './application-form-schema'
import { redis } from './redis'

export type CachedApplication = Omit<ApplicationFormData, 'foto'> & {
    submittedAt: string
    pdfFilename: string
    fotoS3Url: string
}

export async function cacheSuccessfulApplication(
    data: ApplicationFormData,
    pdfFilename: string,
    fotoS3Url: string
) {
    const { foto, ...rest } = data
    void foto

    const record: CachedApplication = {
        submittedAt: new Date().toISOString(),
        pdfFilename,
        fotoS3Url,
        ...rest,
    }

    const id = crypto.randomUUID()
    await redis.set(`application:${process.env.NODE_ENV}:${id}`, record)
}
