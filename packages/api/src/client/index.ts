export interface HttpClientConfig {
  baseUrl?: string
  credentials?: RequestCredentials
  defaultHeaders?: Record<string, string>
  refreshEndpoint?: string
  getInitialAccessToken?: () => string | null
  onAuthFailure?: () => void
}

export class HttpClient {
  private readonly baseUrl: string
  private readonly credentials: RequestCredentials
  private readonly defaultHeaders: Record<string, string>
  private readonly refreshEndpoint: string
  private readonly onAuthFailure?: () => void

  private accessToken: string | null
  private refreshInFlight: Promise<void> | null

  constructor(config: HttpClientConfig = {}) {
    // Do not access process.env in browser runtime; rely on explicit config only.
    this.baseUrl = config.baseUrl ?? ''
    this.credentials = config.credentials ?? 'include'
    this.defaultHeaders = config.defaultHeaders ?? { 'Content-Type': 'application/json' }
    this.refreshEndpoint = config.refreshEndpoint ?? '/auth/refresh'
    this.onAuthFailure = config.onAuthFailure
    this.accessToken = config.getInitialAccessToken?.() ?? null
    this.refreshInFlight = null
  }

  setAccessToken(token: string | null): void {
    this.accessToken = token
  }

  clearAccessToken(): void {
    this.accessToken = null
  }

  private async performFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
    const headers: Record<string, string> = { ...this.defaultHeaders, ...(init.headers as Record<string, string> | undefined) }
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`
    }
    return fetch(input, {
      ...init,
      credentials: this.credentials,
      headers,
    })
  }

  private async refreshIfNeeded(): Promise<void> {
    if (this.refreshInFlight) {
      await this.refreshInFlight
      return
    }
    this.refreshInFlight = (async () => {
      // Call refresh endpoint without Authorization header
      const response = await fetch(this.baseUrl + this.refreshEndpoint, {
        method: 'POST',
        credentials: this.credentials,
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) {
        this.clearAccessToken()
        this.refreshInFlight = null
        if (this.onAuthFailure) this.onAuthFailure()
        const text = await response.text()
        throw new Error(text || `HTTP ${response.status}`)
      }
      const data = (await response.json()) as { accessToken: string }
      this.setAccessToken(data.accessToken)
      this.refreshInFlight = null
    })()
    await this.refreshInFlight
  }

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    // If a refresh is in progress, wait before issuing a new request to avoid stampede
    if (this.refreshInFlight) {
      await this.refreshInFlight
    }

    let response = await this.performFetch(this.baseUrl + path, init)
    if (response.status === 401 && !path.startsWith(this.refreshEndpoint)) {
      try {
        await this.refreshIfNeeded()
      } catch {
        // refresh failed, propagate 401
        const text = await response.text()
        throw new Error(text || 'Unauthorized')
      }
      // retry once
      response = await this.performFetch(this.baseUrl + path, init)
    }

    if (!response.ok) {
      const text = await response.text()
      throw new Error(text || `HTTP ${response.status}`)
    }
    return (await response.json()) as T
  }
}

export const apiClient = new HttpClient()

export default apiClient

