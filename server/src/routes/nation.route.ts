import express from 'express'

import {
  getAllAssociations, getAssociationById, getAssociationIds
} from '../controllers/nations'

const nationRouter = express.Router()

nationRouter.get('/', getAllAssociations)
nationRouter.get('/ids', getAssociationIds)
nationRouter.get('/:associationId', getAssociationById)

export default nationRouter
