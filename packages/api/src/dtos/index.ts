// DTO placeholders to be replaced with zod schemas in later steps
export interface ApiErrorResponse {
  error: {
    message: string
    code?: string
    details?: unknown
  }
}

