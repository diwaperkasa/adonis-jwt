import emitter from '@adonisjs/core/services/emitter'
import mail from '@adonisjs/mail/services/main'

emitter.on('Product:before:save:model', async function (model) {
	console.log(model)
})

emitter.on('User:after:create:model', async function (user) {
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
})