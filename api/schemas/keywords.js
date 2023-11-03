import z from 'zod'

const keywordsSchema = z.object({
  name: z.string({
    invalid_type_error: 'El nombre de la palabra clave debe ser un string',
    required_error: 'El nombre de la palabra clave es requerida'
  })
})

export function validateKeyword (input) {
  return keywordsSchema.safeParse(input)
}

export function validatePartialKeyword (input) {
  return keywordsSchema.partial().safeParse(input)
}
