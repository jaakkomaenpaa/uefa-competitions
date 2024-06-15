import axios from 'axios'
import { baseApiUrl } from '../config'

const baseUrl = `${baseApiUrl}/teams`

const getTeamById = async (teamId: string | number) => {
  const response = await axios.get(`${baseUrl}/${teamId}`)
  return response.data
}

const exports = {
  getTeamById
}

export default exports