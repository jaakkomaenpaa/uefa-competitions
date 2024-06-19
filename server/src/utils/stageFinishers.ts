import Association from '../classes/Association'
import Match from '../classes/Match'
import Stage from '../classes/Stage'
import Team from '../classes/Team'
import { SEEDED_R16_TEAMS } from '../rules/general'
import {
  LEAGUE_RANK_BONUS,
  PARTICIPATION_BONUS,
  TEAM_POINTS,
} from '../rules/points'
import { CompetitionCode, StageSQL } from '../types'

export const finishQualStage = (
  matches: Match[],
  competitionId: CompetitionCode,
  stage: StageSQL
): void => {
  const stageObj = new Stage(stage, competitionId, matches)

  const winners = stageObj.getWinningTeams()

  const losers = stageObj.getLosingTeams()

  winners.forEach((winner: Team) => {
    winner.moveToNextStage()
    if (Number(competitionId) === CompetitionCode.UCL && stage === StageSQL.QPO) {
      const points = PARTICIPATION_BONUS[CompetitionCode.UCL][StageSQL.LP]
      winner.increasePoints(points)
      const association = Association.fetchByTeamId(winner.getId())
      association.increasePoints(points)
    }
  })

  if (Number(competitionId) === CompetitionCode.UECL) {
    losers.forEach((loser: Team) => {
      const points = TEAM_POINTS.elimination[CompetitionCode.UECL][stage]
      loser.increasePoints(points)
    })
  } else {
    losers.forEach((loser: Team) => {
      loser.dropToLowerComp()
    })
  }
}

export const finishLeagueStage = (
  seasonId: number,
  competitionId: CompetitionCode
): void => {
  const stageObj = new Stage(StageSQL.LP, competitionId)

  const teams = stageObj.getTeams(false, false)

  // TODO: check matches between the teams that have even points
  // Check official uefa regulations regarding ranking
  const sortedTeams = teams.sort((a: Team, b: Team) => {
    const {
      won: aWon,
      drawn: aDrawn,
      goalsFor: aGF,
      goalsAgainst: aGA,
    } = a.getGroupStats(seasonId)
    const {
      won: bWon,
      drawn: bDrawn,
      goalsFor: bGF,
      goalsAgainst: bGA,
    } = b.getGroupStats(seasonId)

    const aGD = aGF - aGA
    const aPoints = aWon * 3 + aDrawn
    const bGD = bGF - bGA
    const bPoints = bWon * 3 + bDrawn

    if (bPoints - aPoints !== 0) {
      return bPoints - aPoints
    } else if (bGD - aGD !== 0) {
      return bGD - aGD
    } else {
      return bGF - aGF
    }
  })

  // Award bonus points from league stage
  sortedTeams.forEach((team: Team, index: number) => {
    const rank = index + 1
    team.setGroupPosition(rank, seasonId)

    if (rank <= 24) {
      const bonus = LEAGUE_RANK_BONUS[competitionId][rank]
      team.increasePoints(bonus)
    }

    const minParticipationBonus =
      PARTICIPATION_BONUS[competitionId][StageSQL.LP] || 0

    const coeffPoints = team.getCoeffPoints(seasonId)

    if (coeffPoints < minParticipationBonus) {
      team.increasePoints(minParticipationBonus - coeffPoints)
    }
  })

  // Set teams for stages
  const r16Teams = sortedTeams.slice(0, SEEDED_R16_TEAMS)
  const koPlayOffTeams = sortedTeams.slice(SEEDED_R16_TEAMS, 24)

  r16Teams.forEach((team: Team) => {
    const bonus = PARTICIPATION_BONUS[competitionId][StageSQL.R16]
    team.increasePoints(bonus)
    const association = Association.fetchByTeamId(team.getId())
    association.increasePoints(bonus)
    team.setUefaStage(StageSQL.R16, competitionId)
  })

  koPlayOffTeams.forEach((team: Team) => {
    team.moveToNextStage()
  })
}

export const finishKoStage = (
  matches: Match[],
  competitionId: CompetitionCode,
  stage: StageSQL
): void => {
  const stageObj = new Stage(stage, competitionId, matches)
  const nextStage = stageObj.getNext()

  if (!nextStage) {
    return
  }

  const winners = stageObj.getWinningTeams()

  winners.forEach((winner: Team) => {
    const bonus = PARTICIPATION_BONUS[competitionId][nextStage]
    winner.increasePoints(bonus)

    const association = Association.fetchByTeamId(winner.getId())
    association.increasePoints(bonus)

    winner.moveToNextStage()
  })
}
