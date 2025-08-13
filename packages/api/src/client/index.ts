export interface HttpClientConfig {
  baseUrl?: string
  credentials?: RequestCredentials
  defaultHeaders?: Record<string, string>
}

export class HttpClient {
  private readonly baseUrl: string
  private readonly credentials: RequestCredentials
  private readonly defaultHeaders: Record<string, string>

  constructor(config: HttpClientConfig = {}) {
    this.baseUrl = config.baseUrl ?? process.env.API_BASE_URL ?? 'http://localhost:4000'
    this.credentials = config.credentials ?? 'include'
    this.defaultHeaders = config.defaultHeaders ?? { 'Content-Type': 'application/json' }
  }

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(this.baseUrl + path, {
      ...init,
      credentials: this.credentials,
      headers: { ...this.defaultHeaders, ...(init.headers as Record<string, string> | undefined) },
    })
    if (!response.ok) {
      const text = await response.text()
      throw new Error(text || `HTTP ${response.status}`)
    }
    return (await response.json()) as T
  }
}

export const apiClient = new HttpClient()

