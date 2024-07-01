import axios from 'axios'
import { baseApiUrl } from '../config'
import { MatchScore, StageClient, StageSQL } from '../types'
import { convertStageClientToSql } from '../utils/stages'

const baseUrl = `${baseApiUrl}/matches`

const setMatchScore = async (body: MatchScore) => {
  const response = await axios.post(`${baseUrl}/set-score/${body.id}`, body)
  return response.data
}

const finishStage = async (
  seasonId: number | string,
  stage: StageClient,
  competitionId: number | string
) => {
  const body = {
    stage: convertStageClientToSql(stage),
    competitionId,
  }
  const response = await axios.post(`${baseUrl}/${seasonId}/finish-stage`, body)
  return response.data
}

const getDrawForStage = async (competitionId: number | string, stage: StageSQL) => {
  const response = await axios.get(
    `${baseUrl}/${competitionId}/get-draw?stage=${stage}`
  )
  return response.data
}

const getAggregate = async (matchId: number) => {
  const response = await axios.get(`${baseUrl}/${matchId}/aggregate`)
  return response.data
}

const getStageStatus = async (
  competitionId: number | string,
  stage: StageSQL,
  seasonId: number | string
) => {
  const response = await axios.get(
    `${baseUrl}/${seasonId}/comp/${competitionId}/stage-status?stage=${stage}`
  )
  return response.data
}

const exports = {
  setMatchScore,
  finishStage,
  getDrawForStage,
  getAggregate,
  getStageStatus,
}

export default exports
