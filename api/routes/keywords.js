import { Router } from 'express'
import { KeywordController } from '../controllers/keywords.js'

export const createKeywordRouter = ({ keywordModel }) => {
  const keywordRouter = Router()

  const keywordController = new KeywordController({ keywordModel })

  keywordRouter.get('/', keywordController.getAll)
  keywordRouter.get('/:id', keywordController.getById)

  keywordRouter.post('/', keywordController.create)

  keywordRouter.patch('/:id', keywordController.update)

  keywordRouter.delete('/:id', keywordController.delete)

  return keywordRouter
}
