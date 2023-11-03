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

export class KeywordModel {
  static async getAll () {
    const [keywords] = await connection.query(
      'SELECT id, name FROM keyword;'
    )

    return keywords
  }

  static async getById ({ id }) {
    const [keywords] = await connection.query(
      'SELECT id, name FROM keyword WHERE id = ?;',
      [id]
    )

    return keywords[0]
  }

  static async create ({ input }) {
    const { name } = input

    try {
      await connection.query(
              `INSERT INTO keyword (name) 
               VALUES(?);`,
              [name]
      )
    } catch (e) {
      console.log('Error creating the keyword')
      console.log(e)
    }

    const [result] = await connection.query('SELECT LAST_INSERT_ID() id;')
    const [{ id }] = result

    const [keywords] = await connection.query(
      'SELECT id, name FROM keyword WHERE id = ?;',
      [id]
    )

    return keywords[0]
  }

  static async update ({ id, input }) {
    const { name } = input

    try {
      await connection.query(
        'UPDATE keyword SET name = IFNULL(?, name) WHERE id = ?;',
        [name, id]
      )
    } catch (e) {
      console.log('Error updating the keyword')
      console.log(e)
    }

    const [keywords] = await connection.query(
      'SELECT id, name FROM keyword WHERE id = ?;',
      [id])

    return keywords[0]
  }

  static async delete ({ id }) {
    try {
      await connection.query(
        'DELETE FROM keyword WHERE id = ?;', [id]
      )
    } catch (e) {
      console.log('Error deleting the keyword')
      console.log(e)
    }

    const [result] = await connection.query('SELECT ROW_COUNT() rowCount;')
    const [{ rowCount }] = result
    if (rowCount === 0) return false
    return true
  }
}
