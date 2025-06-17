import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    full_name: vine.string().trim(),
    role_id: vine.number(),
    email: vine.string().email().trim(),
    password: vine.string().trim().minLength(6),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim(),
    password: vine.string().trim().minLength(6),
  })
)