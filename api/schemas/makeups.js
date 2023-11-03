import z from 'zod'

const makeupSchema = z.object({
  description: z.string({
    invalid_type_error: 'Makeup description must be a string',
    required_error: 'Makeup description is required'
  }),
  imageUrl: z.string(),
  makeupCategoryId: z.number().int().positive().optional(),
  makeupSubcategoryId: z.number().int().positive().optional(),
  keywordsIds: z.array(z.number().int().positive()).optional()
})

export function validateMakeup (input) {
  return makeupSchema.safeParse(input)
}

export function validatePartialMakeup (input) {
  return makeupSchema.partial().safeParse(input)
}
