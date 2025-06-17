import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { Exception } from '@adonisjs/core/exceptions'

export default class OnlyAdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user;
    await user?.load('role')

    if (user?.role.code !== 'admin') {
      throw new Exception("Your not an admin", {
        status: 403,
        code: 'E_UNAUTHORIZED'
      });
    }

    return next()
  }
}