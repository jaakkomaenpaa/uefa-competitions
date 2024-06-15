import express from 'express'
import { getAssociationCoefficients, getClubCoefficients } from '../controllers/rankings'

const rankingRouter = express.Router()

rankingRouter.get('/:seasonId/associations/:seasons', getAssociationCoefficients)
rankingRouter.get('/:seasonId/clubs/:seasons', getClubCoefficients)

export default rankingRouter