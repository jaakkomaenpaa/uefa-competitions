import Association from '../classes/Association'
import Stage from '../classes/Stage'
import Team from '../classes/Team'
import { HAS_STAGE_TWO_PATHS } from '../rules/general'
import { PARTICIPATION_BONUS } from '../rules/points'
import { CompetitionCode, StageSQL } from '../types'
import { shuffleArray } from './helpers'
import {
  drawMatchupsForGroupStage,
  drawMatchupsForKpoOrR16,
  drawMatchupsForQfOrSf,
  drawMatchupsForQualStage,
  setFinal,
} from './matchGenerators'

export const initDrawForQualStage = (
  competitionId: CompetitionCode,
  stage: StageSQL,
  seasonId: number
) => {
  const stageObj = new Stage(stage, competitionId)
  const stageHasTwoPaths = HAS_STAGE_TWO_PATHS[competitionId][stage]

  if (stage === StageSQL.QR2 && Number(competitionId) === CompetitionCode.UECL) {

    const chPathTeams = stageObj.getTeams(true, false)
    const lgPathTeams = stageObj.getTeams(false, true)

    const r2Places = 2 * chPathTeams.length - 16
    const r3Places = chPathTeams.length - r2Places

    const shuffledTeams = shuffleArray(chPathTeams)
    const r3Teams = shuffledTeams.slice(0, r3Places)
    const r2Teams = shuffledTeams.slice(r3Places)

    // Teams receiving a bye
    r3Teams.forEach((team: Team) => {
      team.moveToNextStage()
    })

    drawMatchupsForQualStage(r2Teams, seasonId, StageSQL.QR2, competitionId)
    drawMatchupsForQualStage(lgPathTeams, seasonId, StageSQL.QR2, competitionId)
  } else if (stageHasTwoPaths) {
    const chPathTeams = stageObj.getTeams(true, false)
    const lgPathTeams = stageObj.getTeams(false, true)

    drawMatchupsForQualStage(chPathTeams, seasonId, stage, competitionId)
    drawMatchupsForQualStage(lgPathTeams, seasonId, stage, competitionId)
  } else {
    const teams = stageObj.getTeams(false, false)
    drawMatchupsForQualStage(teams, seasonId, stage, competitionId)
  }
}

export const initDrawForLeaguePhase = (
  competitionId: CompetitionCode,
  seasonId: number
) => {
  const stageObj = new Stage(StageSQL.LP, competitionId)

  const teams = stageObj.getTeams(false, false)

  teams.forEach((team: Team) => {
    const points = PARTICIPATION_BONUS[competitionId][StageSQL.LP]
    team.increasePoints(points)
    const association = Association.fetchByTeamId(team.getId())
    association.increasePoints(points)
  })

  drawMatchupsForGroupStage(teams, seasonId, competitionId)
}

export const initDrawForKoPhase = (
  competitionId: CompetitionCode,
  stage: StageSQL,
  seasonId: number
) => {
  
  const stageObj = new Stage(stage, competitionId)
  const teams = stageObj.getTeams(false, false)

  if (stage === StageSQL.KPO || stage === StageSQL.R16) {
    drawMatchupsForKpoOrR16(teams, seasonId, stage, competitionId)
  }

  if (stage === StageSQL.QF || stage === StageSQL.SF) {
    drawMatchupsForQfOrSf(teams, seasonId, stage, competitionId)
  }

  if (stage === StageSQL.F) {
    setFinal(teams, seasonId, competitionId)
  }
}
