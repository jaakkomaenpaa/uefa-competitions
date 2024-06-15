import express from 'express'

import {
  getAllSeasons,
  getSeasonById,
  getCurrentSeason,
  setNextSeason
} from '../controllers/seasons'

const seasonRouter = express.Router()

seasonRouter.get('/', getAllSeasons)
seasonRouter.get('/current', getCurrentSeason)
seasonRouter.get('/:seasonId', getSeasonById)

seasonRouter.post('/set-next', setNextSeason)

export default seasonRouter
