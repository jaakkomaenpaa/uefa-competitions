import express from 'express'

import {
  getAllAssociations,
  getAssociationByCode,
  getAssociationById,
  getAssociationIds,
} from '../controllers/nations'

const nationRouter = express.Router()

nationRouter.get('/', getAllAssociations)
nationRouter.get('/ids', getAssociationIds)
nationRouter.get('/code/:code', getAssociationByCode)
nationRouter.get('/:associationId', getAssociationById)

export default nationRouter
