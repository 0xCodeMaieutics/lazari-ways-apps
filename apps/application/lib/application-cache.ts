import type { ApplicationFormData } from './application-form-schema'
import { redis } from './redis'

export type CachedApplication = Omit<ApplicationFormData, 'foto'> & {
    submittedAt: string
    pdfFilename: string
}

export async function cacheSuccessfulApplication(
    data: ApplicationFormData,
    pdfFilename: string
) {
    const { foto, ...rest } = data
    void foto

    const record: CachedApplication = {
        submittedAt: new Date().toISOString(),
        pdfFilename,
        ...rest,
    }

    const id = crypto.randomUUID()
    await redis.set(`application:${process.env.NODE_ENV}:${id}`, record)
}
