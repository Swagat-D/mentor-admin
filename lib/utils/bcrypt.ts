import bcrypt from 'bcryptjs'

export class BcryptUtil {
  static async hash(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12')
    return bcrypt.hash(password, saltRounds)
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}

