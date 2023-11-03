import { Router } from 'express'
import { MakeupCategoryController } from '../controllers/makeup-categories.js'

export const createMakeupCategoryRouter = ({ makeupCategoryModel }) => {
  const makeupCategoriesRouter = Router()

  const makeupCategoryController = new MakeupCategoryController({ makeupCategoryModel })

  makeupCategoriesRouter.get('/', makeupCategoryController.getAll)
  makeupCategoriesRouter.get('/:id', makeupCategoryController.getById)

  makeupCategoriesRouter.post('/', makeupCategoryController.create)

  makeupCategoriesRouter.patch('/:id', makeupCategoryController.update)

  makeupCategoriesRouter.delete('/:id', makeupCategoryController.delete)

  return makeupCategoriesRouter
}
