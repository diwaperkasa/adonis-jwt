import type { HttpContext } from '@adonisjs/core/http'
import Role from '#models/role'
import User from '#models/user'

export default class AuthController {
    async login({ view }: HttpContext) {
        return view.render('pages/auth/login')
    }

    async register({ view }: HttpContext) {
        const roles = await Role.all();
        const data = {
            roles: roles
        }
        
        return view.render('pages/auth/register', data)
    }

    async verified({ view, request }: HttpContext) {
        const verifiedToken = request.input('token')
        const user = await User.findByOrFail("verification_token", verifiedToken)
        // update
        user.merge({
            is_verified: true
        });

        await user.save()

        return view.render('pages/auth/verified')
    }

    async forgotPassword({ view }: HttpContext) {
        return view.render('pages/auth/forgot-password')
    }

    async verifyForgotPassword({ view }: HttpContext) {
        return view.render('pages/auth/verify-forgot-password')
    }
}