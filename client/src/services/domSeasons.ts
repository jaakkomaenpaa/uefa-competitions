import axios from 'axios'
import { baseApiUrl } from '../config'
import { Team } from '../types'

const baseUrl = `${baseApiUrl}/seasons/domestic`

const getTeamsByDomSeason = async (seasonId: string, nationId: string) => {
  const response = await axios.get(`${baseUrl}/${seasonId}/${nationId}`)
  return response.data
}

const getDomSeasonStatuses = async (seasonId: string | number) => {
  const response = await axios.get(`${baseUrl}/${seasonId}/statuses`)
  return response.data
}

const postDomSeasonResults = async (
  seasonId: string | number,
  nationId: string | number,
  league: Team[],
  cupWinner: Team
) => {
  const body = {
    league,
    cupWinner,
  }
  const response = await axios.post(
    `${baseUrl}/${seasonId}/results/${nationId}`,
    body
  )
  return response.data
}

const initAllDomSeasons = async (seasonId: string | number) => {
  const body = {
    seasonId
  }
  const response = await axios.post(`${baseUrl}/set-all-teams`, body)
  return response.data
}

const exports = {
  getTeamsByDomSeason,
  getDomSeasonStatuses,
  postDomSeasonResults,
  initAllDomSeasons
}

export default exports
