import axios from 'axios'
import { baseApiUrl } from '../config'
import { MatchScore, MatchTemplate, StageClient, StageSQL } from '../types'
import { convertStageClientToSql } from '../utils'

const baseUrl = `${baseApiUrl}/matches`

const addMatchTemplate = async (body: MatchTemplate) => {
  const response = await axios.post(`${baseUrl}/add-templ`, body)
  return response.data
}

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

const getDrawForStage = async (competitionId: number, stage: StageSQL) => {
  const response = await axios.post(
    `${baseUrl}/${competitionId}/get-draw?stage=${stage}`
  )
  return response.data
}

const getStageStatus = async (
  competitionId: number,
  stage: StageSQL,
  seasonId: number
) => {
  const response = await axios.post(
    `${baseUrl}/${seasonId}/comp/${competitionId}/stage-status?stage=${stage}`
  )
  return response.data
}

const exports = {
  addMatchTemplate,
  setMatchScore,
  finishStage,
  getDrawForStage,
  getStageStatus
}

export default exports
