import express from 'express'

import {
  getAllMatches,
  getMatchById,
  addMatchTemplateFromClient,
  setMatchScore,
  finishStage,
  makeDrawForStage,
  getStageStatus,
} from '../controllers/matches'

const matchRouter = express.Router()

matchRouter.get('/', getAllMatches)
matchRouter.get('/:matchId', getMatchById)
matchRouter.get('/:competitionId/get-draw', makeDrawForStage)
matchRouter.get('/:seasonId/comp/:competitionId/stage-status', getStageStatus)

matchRouter.post('/add-templ', addMatchTemplateFromClient)
matchRouter.post('/set-score/:matchId', setMatchScore)
matchRouter.post('/:seasonId/finish-stage', finishStage)

export default matchRouter
