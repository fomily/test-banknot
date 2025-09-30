import bcrypt from 'bcryptjs'

export interface PasswordHasher {
  hash(plain: string): Promise<string>
  verify(hash: string, plain: string): Promise<boolean>
}

export class BcryptPasswordHasher implements PasswordHasher {
  async hash(plain: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(plain, salt)
  }
  async verify(hash: string, plain: string): Promise<boolean> {
    return bcrypt.compare(plain, hash)
  }
}

