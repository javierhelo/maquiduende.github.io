import z from 'zod'

const makeupCategorySchema = z.object({
  name: z.string({
    invalid_type_error: 'El nombre de la categoria debe ser un string',
    required_error: 'El nombre de la categoria es requerido'
  })
})

export function validateMakeupCategory (input) {
  return makeupCategorySchema.safeParse(input)
}

export function validatePartialMakeupCategory (input) {
  return makeupCategorySchema.partial().safeParse(input)
}
