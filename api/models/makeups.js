import mysql from 'mysql2/promise'
import { readFile } from 'node:fs/promises'

const HOST = process.env.HOST
const USER = process.env.USER
const PASSWORD = process.env.PASSWORD
const DATABASE = process.env.DATABASE
const DATABASE_PORT = process.env.DATABASE_PORT

const connection = await mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  port: DATABASE_PORT,
  ssl: { ca: await readFile('./models/DigiCertGlobalRootCA.crt.pem') }
})

export class MakeupModel {
  static async getAll ({ category, subcategory, keywords }) {
    const [makeups] = await connection.query(
      'SELECT BIN_TO_UUID(id) id, image_url imageUrl FROM makeup;'
    )

    return makeups
  }

  static async getById ({ id }) {
    const [makeups] = await connection.query(
        `SELECT BIN_TO_UUID(makeup.id) id, description, image_url imageUrl, upload_timestamp uploadTimestamp, c.name category, sc.name subcategory
        FROM makeup
          LEFT JOIN makeup_category c ON makeup.makeup_category_id = c.id
          LEFT JOIN makeup_category sc ON makeup.makeup_subcategory_id = sc.id
        WHERE makeup.id = UUID_TO_BIN(?);`,
        [id]
    )

    const [keywords] = await connection.query(
      `SELECT keyword.name
        FROM makeup_keyword
        INNER JOIN keyword ON makeup_keyword.keyword_id = keyword.id
        WHERE makeup_keyword.makeup_id = UUID_TO_BIN(?)`,
      [id]
    )
    makeups[0].keywords = keywords.map(keyword => keyword.name)
    console.log(makeups)
    return makeups[0]
  }

  static async create ({ input }) {
    const {
      description,
      imageUrl,
      makeupCategoryId,
      makeupSubcategoryId,
      keywordsIds
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        `INSERT INTO makeup (id, description, image_url imageUrl, makeup_category_id makeupCategoryId, makeup_subcategory_id makeupSubcategoryId)
          VALUES (UUID_TO_BIN("${uuid}"),?,?,?,?);`,
        [description, imageUrl, makeupCategoryId, makeupSubcategoryId]
      )
    } catch (e) {
      console.log('Error creating makeup')
      console.log(e)
    }

    if (keywordsIds) {
      try {
        for (const id of keywordsIds) {
          await connection.query(
            `INSERT INTO makeup_keyword (makeup_id, keyword_id)
              VALUES(UUID_TO_BIN(?), ?);`,
            [uuid, id]
          )
        }
      } catch (e) {
        await connection.query(
          'DELETE FROM makeup WHERE id = UUID_TO_BIN(?);',
          [uuid]
        )
        console.log('Error creating the makeup keyword')
        console.log(e)
      }
    }

    const [makeups] = await connection.query(
        `SELECT BIN_TO_UUID(id) AS id, description, image_url imageUrl, upload_timestamp uploadTimestamp, makeup_category_id makeupCategoryId, makeup_subcategory_id makeupSubcategoryId
            FROM makeup
            WHERE id = UUID_TO_BIN(?);`,
        [uuid]
    )

    return [makeups][0]
  }

  static async update ({ id, input }) {
    const {
      description,
      makeupCategoryId,
      makeupSubcategoryId
    } = input

    try {
      await connection.query(
            `UPDATE makeup
                SET description = IFNULL(?, description),
                    image_url = IFNULL(?, image_url),
                    makeup_category_id = IFNULL(?, makeup_category_id),
                    makeup_subcategory_id = IFNULL(?, makeup_subcategory_id)
                WHERE id = UUID_TO_BIN(?);`,
            [description, null, makeupCategoryId, makeupSubcategoryId, id]
      )
    } catch (e) {
      console.log('Error updating the makeup')
      console.log(e)
    }

    const [makeups] = await connection.query(
      `SELECT description, image_url imageUrl, upload_timestamp uploadTimestamp, makeup_category_id mkaeupCategoryId, makeup_subcategory_id makeupSubcategoryId
        FROM makeup
        WHERE id = UUID_TO_BIN(?);`,
      [id]
    )

    return makeups[0]
  }

  static async delete ({ id }) {
    await connection.query(
      'DELETE FROM makeup WHERE id = UUID_TO_BIN(?);', [id]
    )

    const [result] = await connection.query('SELECT ROW_COUNT() rowCount;')
    const [{ rowCount }] = result
    if (rowCount === 0) return false
    return true
  }
}
