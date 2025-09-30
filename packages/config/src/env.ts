import 'dotenv/config'
import { z } from 'zod'

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL: z.string().default('7d'),
  COOKIE_NAME_REFRESH: z.string().default('refreshToken'),
  COOKIE_PATH_REFRESH: z.string().default('/auth/refresh'),
  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SECURE: z.string().optional(),
  COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none']).optional(),
  CORS_ORIGINS: z.string().optional(),
  DISABLE_CORS: z.string().optional(),
})

export type AppEnv = z.infer<typeof EnvSchema>

export const loadEnv = (): AppEnv => {
  const parsed = EnvSchema.safeParse(process.env)
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
    throw new Error(`Env validation error: ${issues}`)
  }
  return parsed.data
}

