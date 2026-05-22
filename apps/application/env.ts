import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
    server: {
        UPSTASH_REDIS_REST_URL: z.string().url(),
        UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

        S3_REGION: z.string(),
        S3_ENDPOINT: z.string().url(),
        S3_ACCESS_KEY: z.string(),
        S3_SECRET_KEY: z.string(),
        S3_BUCKET_NAME: z.string(),
    },
    client: {},
    runtimeEnv: {
        UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
        UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,

        S3_REGION: process.env.S3_REGION,
        S3_ENDPOINT: process.env.S3_ENDPOINT,
        S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
        S3_SECRET_KEY: process.env.S3_SECRET_KEY,
        S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    },
    emptyStringAsUndefined: true,
    skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
})
