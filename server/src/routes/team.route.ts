import express from 'express'

import {
  getAllTeams,
  getTeamById,
  getTeamsByConfederationId,
  getTeamsBySearchTerm,
} from '../controllers/teams'

const teamRouter = express.Router()

teamRouter.get('/', getAllTeams)
teamRouter.get('/league/:associationId', getTeamsByConfederationId)
teamRouter.get('/search/:input', getTeamsBySearchTerm)
teamRouter.get('/:teamId', getTeamById)

export default teamRouter
