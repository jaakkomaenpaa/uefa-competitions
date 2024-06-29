import express from 'express'

import {
  setupNationCoeffs,
  setupClubCoeffs,
  setupSeasons,
  setupStages,
  setupDomestic,
  setupFinals,
  addPoints,
} from '../controllers/setup'

const setupRouter = express.Router()

setupRouter.get('/nation-coeff', setupNationCoeffs)
setupRouter.get('/club-coeff', setupClubCoeffs)
setupRouter.get('/seasons', setupSeasons)
setupRouter.get('/stages', setupStages)
setupRouter.get('/domestic', setupDomestic)
setupRouter.get('/finals', setupFinals)
setupRouter.get('/points', addPoints)

export default setupRouter
