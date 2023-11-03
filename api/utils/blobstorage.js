import { BlockBlobClient } from '@azure/storage-blob'
import intoStream from 'into-stream'
import sanitize from 'sanitize-filename'

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING

function getBlobName ({ filename }) {
  const secureFilename = sanitize(filename)
  return Date.now() + '-' + secureFilename
}

export async function uploadBlob ({ file }) {
  const newName = getBlobName({ filename: file.originalname })
  console.log(newName)

  const blobService = new BlockBlobClient(AZURE_STORAGE_CONNECTION_STRING, 'images', getBlobName({ filename: file.originalname }))

  const stream = await intoStream(file.buffer)
  const streamLength = file.buffer.length

  try {
    await blobService.uploadStream(stream, streamLength)
  } catch (e) {
    console.log('Error uploading the image')
    console.log(e)
  }

  return blobService.url
}
