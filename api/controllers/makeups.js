import { validateMakeup, validatePartialMakeup } from '../schemas/makeups.js'

export class MakeupController {
  constructor ({ makeupModel }) {
    this.makeupModel = makeupModel
  }

  getAll = async (req, res) => {
    const { category, subcategory, keywords } = req.query
    const makeups = await this.makeupModel.getAll({ category, subcategory, keywords })
    res.json(makeups)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const makeup = await this.makeupModel.getById({ id })

    if (makeup) return res.json(makeup)
    res.status(404).json({ message: 'Makeup not found' })
  }

  create = async (req, res) => {
    const result = validateMakeup(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMakeup = await this.makeupModel.create({ input: result.data })

    if (newMakeup) return res.status(201).json(newMakeup)
    res.status(500).json({ message: 'Error creating the makeup' })
  }

  update = async (req, res) => {
    const result = validatePartialMakeup(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const updatedMakeup = await this.makeupModel.update({ id, input: result.data })

    if (updatedMakeup) return res.json(updatedMakeup)
    res.status(500).json({ message: 'Error updating the makeup' })
  }

  delete = async (req, res) => {
    const { id } = req.params

    const result = await this.makeupModel.delete({ id })

    if (result) return res.json({ message: 'Makeup deleted' })
    res.status(404).json({ message: 'Makeup not found' })
  }
}
