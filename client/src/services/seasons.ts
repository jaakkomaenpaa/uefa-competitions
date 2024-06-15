import axios from 'axios'
import { baseApiUrl } from '../config'

const baseUrl = `${baseApiUrl}/seasons`

const getAllSeasons = async () => {
  const response = await axios.get(`${baseUrl}`)
  return response.data
}

const getSeasonById = async (seasonId: string | number) => {
  const response = await axios.get(`${baseUrl}/${seasonId}`)
  return response.data
}

const getCurrentSeason = async () => {
  const response = await axios.get(`${baseUrl}/current`)
  return response.data
}

const setNextSeason = async () => {
  const response = await axios.post(`${baseUrl}/set-next`)
  return response.data
}

const exports = {
  getAllSeasons,
  getSeasonById,
  getCurrentSeason,
  setNextSeason
}

export default exports