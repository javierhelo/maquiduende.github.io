import z from 'zod'

const ACCEPTED_MIMETYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const imageSchema = z.object({
  image: z.any().refine(
    (file) => ACCEPTED_MIMETYPES.includes(file?.type),
    'Only .jpeg, .jpg, .png and .webp formats are supported'
  )
})

export function validateImage (input) {
  return imageSchema.safeParse(input)
}
