import type { HttpContext } from '@adonisjs/core/http'
import { registerValidator, loginValidator } from '#validators/auth'
import string from '@adonisjs/core/helpers/string'
import User from '#models/user'
import { Exception } from '@adonisjs/core/exceptions'
import { DateTime } from 'luxon'
import mail from '@adonisjs/mail/services/main'

export default class AuthController {
    async register({ request, response }: HttpContext) {
        const data = request.all()
        const payload = await registerValidator.validate(data)
        const verification_token = string.generateRandom(64)
        const userData = { ...payload, verification_token };
        const user = await User.create(userData)

        return response.json({
            message: "success",
            data: user
        });
    }

    async login({ request, response, auth }: HttpContext) {
        const data = request.all()
        const payload = await loginValidator.validate(data)
        const user = await User.verifyCredentials(payload.email, payload.password)

        if (!user.is_verified) {
            throw new Exception("Your account has not been verified", {
                status: 403,
                code: 'E_UNAUTHORIZED'
            });
        }

        const token = await auth.use('jwt').generate(user)

        return response.json({
            message: "success",
            data: {
                token: token,
            }
        });
    }

    async forgotPassword({ request, response }: HttpContext) {
        const email = request.input('email');
        const user = await User.findByOrFail('email', email);
        const reset_password_token = string.generateRandom(64);
        const reset_token_expires_at = DateTime.now().plus({ days: 1 })

        user.merge({
            reset_password_token,
            reset_token_expires_at
        })

        await user.save()

        try {
            await mail.send((message) => {
                message
                    .to(user.email)
                    .subject('Forgot password')
                    .htmlView('emails/forgot_password', { user })
            })
        } catch (error) {
            console.error(error)
        }

        return response.json({
            message: "success",
        });
    }

    async verifyForgotPassword({ request, response }: HttpContext) {
        const token = request.input('token');
        const user = await User.findByOrFail('reset_password_token', token);
        const dateNow = new Date()
        const reset_token_expires_at = new Date(user.reset_token_expires_at)

        if (dateNow.getTime() > reset_token_expires_at.getTime()) {
            throw new Exception("Password token has been expired", {
                status: 400,
                code: 'E_UNAUTHORIZED'
            });
        }

        const password = request.input('password');
        user.merge({
            password
        })

        await user.save();

        return response.json({
            message: "success",
        });
    }
}