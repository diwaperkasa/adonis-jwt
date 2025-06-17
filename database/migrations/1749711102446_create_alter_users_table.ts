import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_verified').defaultTo(0)
      table.string('verification_token')
      table.string('reset_password_token').nullable()
      table.timestamp('reset_token_expires_at').nullable()
      table.integer('role_id').unsigned().references('id').inTable('roles')
    })
  }

  async down() {
    // this.schema.dropTable(this.tableName)
  }
}