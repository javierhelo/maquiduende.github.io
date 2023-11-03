import { Router } from 'express'

import { MakeupController } from '../controllers/makeups.js'

export const createMakeupRouter = ({ makeupModel }) => {
  const makeupsRouter = Router()

  const makeupController = new MakeupController({ makeupModel })

  makeupsRouter.get('/', makeupController.getAll)
  makeupsRouter.get('/:id', makeupController.getById)

  makeupsRouter.post('/', makeupController.create)

  makeupsRouter.patch('/:id', makeupController.update)

  makeupsRouter.delete('/:id', makeupController.delete)

  return makeupsRouter
}
