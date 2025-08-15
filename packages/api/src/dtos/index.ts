// DTO placeholders to be replaced with zod schemas in later steps
export interface ApiErrorResponse {
  error: {
    message: string
    code?: string
    details?: unknown
  }
}
import { z } from 'zod'

export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
export type LoginRequest = z.infer<typeof LoginRequestSchema>

export const AccessTokenResponseSchema = z.object({
  accessToken: z.string(),
})
export type AccessTokenResponse = z.infer<typeof AccessTokenResponseSchema>

export const LogoutResponseSchema = z.object({ success: z.literal(true) })
export type LogoutResponse = z.infer<typeof LogoutResponseSchema>

export const ErrorResponseSchema = z.object({
  error: z.object({
    message: z.string(),
  }),
})
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>

