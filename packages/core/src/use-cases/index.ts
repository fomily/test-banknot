import type { PasswordHasherPort, TokenServicePort, UserRepositoryPort, WalletRepositoryPort, UserEntity } from '../ports'

export interface AuthResult {
  accessToken: string
  refreshToken: string
  user: UserEntity
}

export const TOKENS = {
  UserRepository: 'UserRepository',
  WalletRepository: 'WalletRepository',
  PasswordHasher: 'PasswordHasher',
  TokenService: 'TokenService',
} as const

export class RegisterUserUseCase {
  constructor(
    private readonly users: UserRepositoryPort,
    private readonly wallets: WalletRepositoryPort,
    private readonly hasher: PasswordHasherPort,
    private readonly tokens: TokenServicePort
  ) {}

  async execute(input: { email: string; password: string; firstName?: string; lastName?: string; middleName?: string | null }): Promise<AuthResult> {
    const emailTaken = await this.users.isEmailTaken(input.email)
    if (emailTaken) throw new Error('Email already in use')
    const passwordHash = await this.hasher.hash(input.password)
    const user = await this.users.create({
      email: input.email,
      passwordHash,
      firstName: input.firstName ?? 'User',
      lastName: input.lastName ?? 'Test',
      middleName: input.middleName ?? null,
    })
    await this.wallets.createForUser(user.id)
    const accessToken = this.tokens.issueAccessToken({ sub: user.id, isAdmin: user.isAdmin, ratingLevel: user.ratingLevel })
    const refreshToken = this.tokens.issueRefreshToken({ sub: user.id })
    return { accessToken, refreshToken, user }
  }
}

export class LoginUserUseCase {
  constructor(
    private readonly users: UserRepositoryPort,
    private readonly hasher: PasswordHasherPort,
    private readonly tokens: TokenServicePort
  ) {}

  async execute(input: { email: string; password: string }): Promise<AuthResult> {
    const user = await this.users.findByEmail(input.email)
    if (!user) throw new Error('Invalid credentials')
    const ok = await this.hasher.verify(user.passwordHash, input.password)
    if (!ok) throw new Error('Invalid credentials')
    const accessToken = this.tokens.issueAccessToken({ sub: user.id, isAdmin: user.isAdmin, ratingLevel: user.ratingLevel })
    const refreshToken = this.tokens.issueRefreshToken({ sub: user.id })
    return { accessToken, refreshToken, user }
  }
}

export class RefreshTokenUseCase {
  constructor(private readonly tokens: TokenServicePort, private readonly users: UserRepositoryPort) {}

  async execute(input: { refreshToken: string }): Promise<{ accessToken: string; refreshToken: string; userId: string }> {
    const payload = this.tokens.verifyRefreshToken(input.refreshToken)
    const user = await this.users.findById(payload.sub)
    if (!user) throw new Error('User not found')
    const accessToken = this.tokens.issueAccessToken({ sub: user.id, isAdmin: user.isAdmin, ratingLevel: user.ratingLevel })
    const newRefresh = this.tokens.issueRefreshToken({ sub: user.id })
    return { accessToken, refreshToken: newRefresh, userId: user.id }
  }
}

export class LogoutUserUseCase {
  async execute(): Promise<{ success: true }> {
    return { success: true }
  }
}


