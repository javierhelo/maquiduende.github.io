import { validateKeyword, validatePartialKeyword } from '../schemas/keywords.js'

export class KeywordController {
  constructor ({ keywordModel }) {
    this.keywordModel = keywordModel
  }

  getAll = async (req, res) => {
    const keywords = await this.keywordModel.getAll()
    res.json(keywords)
  }

  getById = async (req, res) => {
    const { id } = req.params

    const keyword = await this.keywordModel.getById({ id })

    if (keyword) return res.json(keyword)
    res.status(404).json('No se encontró la palabra clave')
  }

  create = async (req, res) => {
    const result = validateKeyword(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newKeyword = await this.keywordModel.create({ input: result.data })

    if (newKeyword) return res.status(201).json(newKeyword)
    res.status(500).json('Error creando la palabra clave')
  }

  update = async (req, res) => {
    const { id } = req.params

    const result = validatePartialKeyword(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const updatedKeyword = await this.keywordModel.update({ id, input: result.data })

    if (updatedKeyword) return res.json(updatedKeyword)
    res.status(404).json('No se encontro la palabra clave')
  }

  delete = async (req, res) => {
    const { id } = req.params

    const result = await this.keywordModel.delete({ id })

    if (result) return res.json('Se elimino la palabra clave')
    res.status(404).json('No se encontro la palabra clave')
  }
}
