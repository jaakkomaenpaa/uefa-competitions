import express from 'express'

import {
  getTeamsByDomSeason,
  getDomSeasonStatuses,
  initAllDomSeasons,
  postDomSeasonResults
} from '../controllers/domSeasons'

const domSeasonRouter = express.Router() 

domSeasonRouter.get('/:seasonId/statuses', getDomSeasonStatuses)
domSeasonRouter.get('/:seasonId/:associationId', getTeamsByDomSeason)

domSeasonRouter.post('/:seasonId/results/:associationId', postDomSeasonResults)
domSeasonRouter.post('/set-all-teams', initAllDomSeasons)

export default domSeasonRouter
