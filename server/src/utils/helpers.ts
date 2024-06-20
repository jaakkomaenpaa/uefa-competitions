import Match from '../classes/Match'
import Team from '../classes/Team'
import { CLUB_RANKING_DELAY, STAGE_VALUES } from '../rules/general'
import { COEFFICIENT_FACTOR } from '../rules/points'
import { StageSQL, TournamentPhase } from '../types'
import { DB } from './config'

export const convertStageToPhase = (stage: StageSQL): TournamentPhase => {
  const qualifying = [StageSQL.QR1, StageSQL.QR2, StageSQL.QR3, StageSQL.QPO]
  const knockout = [StageSQL.KPO, StageSQL.R16, StageSQL.QF, StageSQL.SF, StageSQL.F]
  if (qualifying.includes(stage)) {
    return TournamentPhase.Qualifying
  } else if (knockout.includes(stage)) {
    return TournamentPhase.Knockout
  } else {
    return TournamentPhase.League
  }
}

export const moveArrayItem = (
  array: any[],
  fromIndex: number,
  toIndex: number
): any[] => {
  if (
    fromIndex < 0 ||
    fromIndex >= array.length ||
    toIndex < 0 ||
    toIndex >= array.length
  ) {
    throw new Error('Index out of bounds')
  }

  const item = array.splice(fromIndex, 1)[0]
  array.splice(toIndex, 0, item)

  return array
}

export const shuffleTeams = (teams: Team[]): Team[] => {
  const shuffledArray = teams.slice()

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    ;[shuffledArray[i], shuffledArray[randomIndex]] = [
      shuffledArray[randomIndex],
      shuffledArray[i],
    ]
  }
  return shuffledArray
}

export const sortTeamsByCoeff = (teams: Team[], seasonId: number) => {
  return teams.sort((a: Team, b: Team) => {
    const aClubPoints = a.fetchCoeffPoints(seasonId - CLUB_RANKING_DELAY, 5)
    const aNationPoints =
      a.getAssociation().getCoeffPoints(seasonId - CLUB_RANKING_DELAY, 5) *
      COEFFICIENT_FACTOR

    const bClubPoints = b.fetchCoeffPoints(seasonId - CLUB_RANKING_DELAY, 5)
    const bNationPoints =
      b.getAssociation().getCoeffPoints(seasonId - CLUB_RANKING_DELAY, 5) *
      COEFFICIENT_FACTOR

    const aPoints = Math.max(aClubPoints, aNationPoints)
    const bPoints = Math.max(bClubPoints, bNationPoints)

    return bPoints - aPoints
  })
}

export const sortTeamsByRanking = (teams: Team[], ranking: Team[]) => {
  return teams.sort((a: Team, b: Team) => {
    const indexA = ranking.findIndex(r => r.getId() === a.getId())
    const indexB = ranking.findIndex(r => r.getId() === b.getId())

    const validIndexA = indexA === -1 ? Infinity : indexA
    const validIndexB = indexB === -1 ? Infinity : indexB

    return validIndexA - validIndexB
  })
}

export const get2LegMatchWinner = (
  teamId1: number,
  teamId2: number,
  seasonId: number,
  competitionId: number,
  stage: StageSQL
): Team | null => {
  const leg1 = Match.fetchByData(teamId1, teamId2, seasonId, competitionId, stage)
  const leg2 = Match.fetchByData(teamId2, teamId1, seasonId, competitionId, stage)

  const leg1HomeScore = leg1.getHomeScore()
  const leg1AwayScore = leg1.getAwayScore()
  const leg2HomeScore = leg2.getHomeScore()
  const leg2AwayScore = leg2.getAwayScore()

  if (
    leg1HomeScore === null ||
    leg1AwayScore === null ||
    leg2HomeScore === null ||
    leg2AwayScore === null
  ) {
    throw new Error('Match scores not yet set')
  }

  const team1Score = leg1HomeScore + leg2AwayScore
  const team2Score = leg1AwayScore + leg2HomeScore

  if (team1Score > team2Score) {
    return Team.fetchById(teamId1)
  } else if (team2Score > team1Score) {
    return Team.fetchById(teamId2)
  }

  // If draw
  const team1Pens =
    leg1.getPensHome() !== null ? leg1.getPensHome() : leg2.getPensAway()
  const team2Pens =
    leg1.getPensAway() !== null ? leg1.getPensAway() : leg2.getPensHome()

  if (team1Pens === null || team2Pens === null) {
    return null
  }
  if (team2Pens > team1Pens) {
    return Team.fetchById(teamId2)
  } else {
    return Team.fetchById(teamId1)
  }
}

export const sortUefaTeams = (
  uefaTeams: Team[],
  nationId: number,
  seasonId: number,
  prioritiseCup: boolean
) => {
  const rows = DB.prepare(
    `
    SELECT t.id, t.name, t.logo, t.code, t.confederation_id AS associationId,
      league_position AS leaguePosition, is_cup_winner AS isCupWinner, competition_id AS competitionId, stage
    FROM team_seasons_uefa AS tsu
    INNER JOIN team_seasons_domestic AS tsd ON tsu.team_id = tsd.team_id AND tsu.season_id = tsd.season_id + 1 
    INNER JOIN teams AS t ON tsu.team_id = t.id
    WHERE tsd.confederation_id = ?
      AND tsu.season_id = ?
  `
  ).all(nationId, seasonId) as Team[]

  const domTeams = rows.map(row => Team.createFromRow(row))

  return uefaTeams.sort((a: Team, b: Team) => {
    const aCompId = a.getCompetitionId()!
    const bCompId = b.getCompetitionId()!

    const aStage = a.getStage()!
    const bStage = b.getStage()!

    if (aCompId !== bCompId) {
      return aCompId - bCompId
    } else if (STAGE_VALUES[aStage] !== STAGE_VALUES[bStage]) {
      return STAGE_VALUES[aStage] - STAGE_VALUES[bStage]
    }

    const aDomTeam = domTeams.find((team: Team) => team.getId() === a.getId())
    const bDomTeam = domTeams.find((team: Team) => team.getId() === b.getId())

    if (prioritiseCup) {
      const aIsCupWinner = aDomTeam ? aDomTeam.getIsCupWinner() : false
      const bIsCupWinner = bDomTeam ? bDomTeam.getIsCupWinner() : false
      if (bIsCupWinner !== aIsCupWinner) {
        return bIsCupWinner ? 1 : -1
      }
    }
    const aPos = aDomTeam ? aDomTeam.getLeaguePosition()! : Number.MAX_SAFE_INTEGER
    const bPos = bDomTeam ? bDomTeam.getLeaguePosition()! : Number.MAX_SAFE_INTEGER

    return aPos - bPos
  })
}

export const moveTeamsUp = (low: Team, teams: Team[]): void => {
  let currentTop: Team = teams[teams.length - 1]
  let currentLow: Team = low
  let counter = teams.length - 1

  while (currentLow.getId() !== teams[0].getId()) {
    currentLow.setUefaStage(currentTop.getStage()!, currentTop.getCompetitionId()!)

    counter--
    currentLow = currentTop

    if (counter >= 0) {
      currentTop = teams[counter]
    }
  }
}
