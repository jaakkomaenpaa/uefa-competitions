import axios from 'axios'
import { baseApiUrl } from '../config'

const baseUrl = `${baseApiUrl}/rankings`

const getAssociationCoefficients = async (
  seasonId: string | number,
  seasons: number
) => {
  const response = await axios.get(
    `${baseUrl}/${seasonId}/associations/${seasons}`
  )
  return response.data
}

const getClubCoefficients = async (
  seasonId: string | number,
  seasons: number
) => {
  const response = await axios.get(
    `${baseUrl}/${seasonId}/clubs/${seasons}`
  )
  return response.data
}

const exports = {
  getAssociationCoefficients,
  getClubCoefficients,
}

export default exports
