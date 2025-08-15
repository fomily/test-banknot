export interface UserEntity {
  id: string
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  middleName?: string | null
  ratingLevel: number
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
}

export interface WalletEntity {
  id: string
  userId: string
  balance: number
}

export interface UserRepositoryPort {
  findByEmail(email: string): Promise<UserEntity | null>
  findById(id: string): Promise<UserEntity | null>
  isEmailTaken(email: string): Promise<boolean>
  create(params: {
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    middleName?: string | null
  }): Promise<UserEntity>
}

export interface WalletRepositoryPort {
  createForUser(userId: string): Promise<WalletEntity>
}

export interface PasswordHasherPort {
  hash(plain: string): Promise<string>
  verify(hash: string, plain: string): Promise<boolean>
}

export interface TokenServicePort {
  issueAccessToken(payload: { sub: string; isAdmin: boolean; ratingLevel: number }): string
  issueRefreshToken(payload: { sub: string }): string
  verifyAccessToken(token: string): { sub: string; isAdmin: boolean; ratingLevel: number }
  verifyRefreshToken(token: string): { sub: string }
}


