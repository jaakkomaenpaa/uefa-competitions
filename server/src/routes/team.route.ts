import express from 'express'

import {
  getAllTeams,
  getTeamById,
  getTeamsByConfederationId,
} from '../controllers/teams'

const teamRouter = express.Router()

teamRouter.get('/', getAllTeams)
teamRouter.get('/:teamId', getTeamById)
teamRouter.get('/league/:associationId', getTeamsByConfederationId)

export default teamRouter
