import dotenv from 'dotenv'
import Database from 'better-sqlite3'
import Ranking from '../classes/Ranking'

dotenv.config()

const PORT = process.env.PORT || 3001
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN

export const DB = new Database('../database/uefa.db', {
  fileMustExist: true,
})

const config = {
  PORT,
  CLIENT_ORIGIN
}

export default config
