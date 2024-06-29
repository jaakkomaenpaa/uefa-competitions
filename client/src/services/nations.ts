import axios from 'axios'
import { baseApiUrl } from '../config'

const baseUrl = `${baseApiUrl}/nations`

const getAllNations = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getNationById = async (nationId: string | number) => {
  const response = await axios.get(`${baseUrl}/${nationId}`)
  return response.data
}

const getNationByCode = async (code: string) => {
  const response = await axios.get(`${baseUrl}/code/${code}`)
  return response.data
}

const exports = {
  getAllNations,
  getNationById,
  getNationByCode,
}

export default exports
