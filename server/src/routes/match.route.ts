import express from 'express'

import {
  getAllMatches,
  getMatchById,
  setMatchScore,
  finishStage,
  makeDrawForStage,
  getStageStatus,
  getMatchAggregate,
} from '../controllers/matches'

const matchRouter = express.Router()

matchRouter.get('/', getAllMatches)
matchRouter.get('/:matchId', getMatchById)
matchRouter.get('/:matchId/aggregate', getMatchAggregate)
matchRouter.get('/:competitionId/get-draw', makeDrawForStage)
matchRouter.get('/:seasonId/comp/:competitionId/stage-status', getStageStatus)

matchRouter.post('/set-score/:matchId', setMatchScore)
matchRouter.post('/:seasonId/finish-stage', finishStage)

export default matchRouter
