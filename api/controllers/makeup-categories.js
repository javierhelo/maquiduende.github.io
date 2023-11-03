import { validateMakeupCategory, validatePartialMakeupCategory } from '../schemas/makeup-categories.js'

export class MakeupCategoryController {
  constructor ({ makeupCategoryModel }) {
    this.makeupCategoryModel = makeupCategoryModel
  }

  getAll = async (req, res) => {
    const makeupCategories = await this.makeupCategoryModel.getAll()
    res.json(makeupCategories)
  }

  getById = async (req, res) => {
    const { id } = req.params

    const makeupCategory = await this.makeupCategoryModel.getById({ id })

    if (makeupCategory) return res.json(makeupCategory)
    res.status(404).json('No se encontró la categoria de maquillaje')
  }

  create = async (req, res) => {
    const result = validateMakeupCategory(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMakeupCategory = await this.makeupCategoryModel.create({ input: result.data })

    if (newMakeupCategory) return res.status(201).json(newMakeupCategory)
    res.status(500).json('Error creando la categoria de maquillaje')
  }

  update = async (req, res) => {
    const { id } = req.params

    const result = validatePartialMakeupCategory(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const updatedMakeupCategory = await this.makeupCategoryModel.update({ id, input: result.data })

    if (updatedMakeupCategory) return res.json(updatedMakeupCategory)
    res.status(404).json('No se encontro la categoria de maquillaje')
  }

  delete = async (req, res) => {
    const { id } = req.params

    const result = await this.makeupCategoryModel.delete({ id })

    if (result) return res.json('Se elimino la categoria de maquillaje')
    res.status(404).json('No se encontro la categoria de maquillaje')
  }
}
