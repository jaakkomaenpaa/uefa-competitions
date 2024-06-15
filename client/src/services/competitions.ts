import axios from 'axios'
import { baseApiUrl } from '../config'

const baseUrl = `${baseApiUrl}/competitions`

const getAllComps = async () => {
  const response = await axios.get(`${baseUrl}`)
  return response.data
}

const getCompById = async (compId: string | number) => { 
  const response = await axios.get(`${baseUrl}/${compId}`)
  return response.data
}

const exports = {
  getAllComps,
  getCompById
}

export default exports