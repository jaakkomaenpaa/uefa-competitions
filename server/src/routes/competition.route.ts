import express from 'express'

import {
  getAllCompetitions,
  getCompetitionById,
} from '../controllers/competitions'

const competitionRouter = express.Router()

competitionRouter.get('/', getAllCompetitions)
competitionRouter.get('/:competitionId', getCompetitionById)

export default competitionRouter
