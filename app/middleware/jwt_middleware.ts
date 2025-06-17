import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { Exception } from '@adonisjs/core/exceptions'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class JwtMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  async handle(
    ctx: HttpContext,
    next: NextFn,
  ) {
    const user = await ctx.auth.authenticate();

    if (!user.is_verified) {
      throw new Exception("Your account has not been verified", {
        status: 403,
        code: 'E_UNAUTHORIZED'
      });
    }
    
    return next()
  }
}