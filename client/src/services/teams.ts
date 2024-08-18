import axios from 'axios'
import { baseApiUrl } from '../config'

const baseUrl = `${baseApiUrl}/teams`

const getTeamsByAssociation = async (associationId: number) => {
  const response = await axios.get(`${baseUrl}/league/${associationId}`)
  return response.data
}

const getTeamById = async (teamId: string | number) => {
  const response = await axios.get(`${baseUrl}/${teamId}`)
  return response.data
}

const getTeamsBySearchTerm = async (input: string) => {
  const response  = await axios.get(`${baseUrl}/search/${input}`)
  return response.data
}

const exports = {
  getTeamsByAssociation,
  getTeamById,
  getTeamsBySearchTerm
}

export default exports