import { Router } from 'express'
import multer from 'multer'

import { ImageController } from '../controllers/images.js'

export const createImageRouter = () => {
  const imagesRouter = Router()

  const imageController = new ImageController()

  const inMemoryStorage = multer.memoryStorage()
  const uploadStrategy = multer({ storage: inMemoryStorage }).single('image')

  imagesRouter.post('/', uploadStrategy, imageController.create)

  return imagesRouter
}
