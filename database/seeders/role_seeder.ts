import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'

export default class extends BaseSeeder {
  async run() {
    await Role.createMany([
      {
        name: 'Admin',
        code: 'admin',
      },
      {
        name: 'General',
        code: 'general',
      },
    ])
  }
}