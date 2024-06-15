import express from 'express'

import {
  getUefaCompStatus,
  getLeagueTeamsByUefaSeason,
  initNationUefaSeasons,
  getMatchesByCompStage,
  initUefaSpots,
  setFirstQualStages
} from '../controllers/uefaSeasons'

const uefaSeasonRouter = express.Router()

uefaSeasonRouter.get('/:seasonId/status/:competitionId', getUefaCompStatus)
uefaSeasonRouter.get('/:seasonId/league/:competitionId', getLeagueTeamsByUefaSeason)
uefaSeasonRouter.get('/:seasonId/matches/comp/:competitionId', getMatchesByCompStage)

//uefaSeasonRouter.get('/:seasonId/group-matches/team/:teamId', getGroupMatchesByTeam)
//uefaSeasonRouter.get('/:seasonId/teams/comp/:competitionId', getTeamsByUefaSeason)
//uefaSeasonRouter.get('/:seasonId/nations', getNationByUefaSeason)

uefaSeasonRouter.get('/:seasonId/set-nations', initNationUefaSeasons)
uefaSeasonRouter.get('/:seasonId/set-uefa-spots', initUefaSpots)
uefaSeasonRouter.get('/:seasonId/draw-qr1', setFirstQualStages)

export default uefaSeasonRouter
