import { validateImage } from '../schemas/images.js'
import { uploadBlob } from '../utils/blobstorage.js'

export class ImageController {
  create = async (req, res) => {
    // const validatedImage = validateImage(req.file)
    // if (!validatedImage.success) {
    //   return res.status(400).json({ error: JSON.parse(validatedImage.error.message) })
    // }

    const imageUrl = await uploadBlob({ file: req.file })

    if (imageUrl) return res.json({ imageUrl })
    res.status(500).json({ message: 'Error uploading the image' })
  }
}
