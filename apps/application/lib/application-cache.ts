import type { ApplicationFormData } from './application-form-schema'
import { redis } from './redis'

export async function cacheSuccessfulApplication(
    data: ApplicationFormData,
    fotoS3Url: string
) {
    const { foto, ...rest } = data
    void foto

    const record: Omit<ApplicationFormData, 'foto'> & {
        submittedAt: string
        fotoS3Url: string
    } = {
        submittedAt: new Date().toISOString(),
        fotoS3Url,
        ...rest,
    }

    const id = crypto.randomUUID()
    await redis.set(`application:${process.env.NODE_ENV}:${id}`, record)
}
