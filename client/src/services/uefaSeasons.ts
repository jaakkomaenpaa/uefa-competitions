import axios from 'axios'
import { baseApiUrl } from '../config'
import { StageClient } from '../types'
import { convertStageClientToSql } from '../utils'

const baseUrl = `${baseApiUrl}/seasons/uefa`

const getLeagueTeamsByUefaSeason = async (
  seasonId: string | number,
  compId: string | number
) => {
  const response = await axios.get(`${baseUrl}/${seasonId}/league/${compId}`)
  return response.data
}

const getMatchesByCompStage = async (
  seasonId: number | string,
  compId: number | string,
  stage: StageClient
) => {
  const stageSql = convertStageClientToSql(stage)
  const response = await axios.get(
    `${baseUrl}/${seasonId}/matches/comp/${compId}?stage=${stageSql}`
  )
  return response.data
}

const getUefaCompStatus = async (
  seasonId: string | number,
  competitionId: string | number
) => {
  const response = await axios.get(
    `${baseUrl}/${seasonId}/status/${competitionId}`
  )
  return response.data
}

const initNationUefaSeasons = async (seasonId: string | number) => {
  const response = await axios.get(`${baseUrl}/${seasonId}/set-nations`)
  return response.data
}

const initUefaSpots = async (seasonId: string | number) => {
  const response = await axios.get(`${baseUrl}/${seasonId}/set-uefa-spots`)
  return response.data
}

const setFirstQualStages = async (seasonId: string | number) => {
  const response = await axios.get(`${baseUrl}/${seasonId}/draw-qr1`)
  return response.data
}

const exports = {
  getMatchesByCompStage,
  getLeagueTeamsByUefaSeason,
  getUefaCompStatus,
  initNationUefaSeasons,
  initUefaSpots,
  setFirstQualStages,
}

export default exports
