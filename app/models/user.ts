import Role from '#models/role'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasOne, afterCreate } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import mail from '@adonisjs/mail/services/main'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @hasOne(() => Role, {
    foreignKey: 'id',
    localKey: 'role_id'
  })
  declare role: HasOne<typeof Role>

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column()
  declare is_verified: boolean

  @column()
  declare verification_token: string

  @column()
  declare reset_password_token: string

  @column()
  declare reset_token_expires_at: DateTime

  @column()
  declare role_id: number

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @afterCreate()
  static async sendMail(user: User) {
    try {
      await mail.send((message) => {
        message
          .to(user.email)
          .subject('Verify your email address')
          .htmlView('emails/verify_email', { user })
      })
    } catch (error) {
      console.error(error)
    }
  }
}