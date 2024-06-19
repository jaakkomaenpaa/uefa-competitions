import Association from '../classes/Association'
import Match from '../classes/Match'
import Ranking from '../classes/Ranking'
import Team from '../classes/Team'
import { CompetitionCode, StageSQL } from '../types'
import { shuffleTeams, sortTeamsByRanking } from './helpers'

interface MatchUp {
  homeId: number
  homeNationId?: number
  awayId: number
  awayNationId?: number
}

export const drawMatchupsForQualStage = (
  teams: Team[],
  seasonId: number,
  stage: StageSQL,
  competitionId: CompetitionCode
) => {
  if (teams.length % 2 !== 0) {
    throw new Error('Not an even number of teams')
  }

  const ranking = Ranking.fetchClubRanking(seasonId, 5)
  teams = sortTeamsByRanking(teams, ranking)

  const middleIndex = Math.ceil(teams.length / 2)
  
  let matchUps: MatchUp[] = []

  // TODO: Optimize this
  while (
    matchUps.length === 0 ||
    matchUps.some((match: MatchUp) => match.homeNationId === match.awayNationId)
  ) {
    matchUps.length = 0
    const seeded = shuffleTeams(teams.slice(0, middleIndex))
    const unSeeded = shuffleTeams(teams.slice(middleIndex))

    seeded.forEach((seed: Team, index: number) => {
      const unSeed = unSeeded[index]

      const randomNum = Math.random()
      const homeId = randomNum < 0.5 ? seed.getId() : unSeed.getId()
      const awayId = randomNum < 0.5 ? unSeed.getId() : seed.getId()

      const homeNationId = Association.fetchByTeamId(homeId).getId()
      const awayNationId = Association.fetchByTeamId(awayId).getId()

      const matchUp = {
        homeId,
        homeNationId,
        awayId,
        awayNationId,
      }

      matchUps.push(matchUp)
    })
  }

  matchUps.forEach((match: MatchUp) => {
    Match.addTemplate(
      match.homeId,
      match.awayId,
      competitionId,
      stage,
      1,
      seasonId
    )
    Match.addTemplate(
      match.awayId,
      match.homeId,
      competitionId,
      stage,
      2,
      seasonId
    )
  })
}

export const drawMatchupsForGroupStage = (
  teams: Team[],
  seasonId: number,
  competitionId: number
) => {
  if (teams.length % 2 !== 0) {
    throw new Error('Not an even number of teams')
  }
  const ranking = Ranking.fetchClubRanking(seasonId, 5)
  teams = sortTeamsByRanking(teams, ranking)

  const quarterSize = Math.ceil(teams.length / 4)
  const pot1 = shuffleTeams(teams.slice(0, quarterSize))
  const pot2 = shuffleTeams(teams.slice(quarterSize, quarterSize * 2))
  const pot3 = shuffleTeams(teams.slice(quarterSize * 2, quarterSize * 3))
  const pot4 = shuffleTeams(teams.slice(quarterSize * 3))

  const matchUps: MatchUp[] = []

  // TODO: set matchdays and further randomise matchups

  pot1.forEach((team: Team, index: number) => {
    if (index >= pot1.length - 1) index = -1
    matchUps.push({
      homeId: team.getId(),
      awayId: pot1[index + 1].getId(),
    })
    matchUps.push({
      homeId: team.getId(),
      awayId: pot2[index + 1].getId(),
    })
    matchUps.push({
      homeId: team.getId(),
      awayId: pot3[index + 1].getId(),
    })
    matchUps.push({
      homeId: team.getId(),
      awayId: pot4[index + 1].getId(),
    })
  })

  pot2.forEach((team: Team, index: number) => {
    if (index >= pot2.length - 1) index = -1
    matchUps.push({
      homeId: team.getId(),
      awayId: pot1[index + 1].getId(),
    })
    matchUps.push({
      homeId: team.getId(),
      awayId: pot2[index + 1].getId(),
    })
    matchUps.push({
      homeId: team.getId(),
      awayId: pot3[index + 1].getId(),
    })
    matchUps.push({
      homeId: team.getId(),
      awayId: pot4[index + 1].getId(),
    })
  })

  pot3.forEach((team: Team, index: number) => {
    if (index >= pot3.length - 1) index = -1
    matchUps.push({
      homeId: team.getId(),
      awayId: pot1[index + 1].getId(),
    })
    matchUps.push({
      homeId: team.getId(),
      awayId: pot2[index + 1].getId(),
    })
    matchUps.push({
      homeId: team.getId(),
      awayId: pot3[index + 1].getId(),
    })
    matchUps.push({
      homeId: team.getId(),
      awayId: pot4[index + 1].getId(),
    })
  })

  pot4.forEach((team: Team, index: number) => {
    if (index >= pot4.length - 1) index = -1
    matchUps.push({
      homeId: team.getId(),
      awayId: pot1[index + 1].getId(),
    })
    matchUps.push({
      homeId: team.getId(),
      awayId: pot2[index + 1].getId(),
    })
    matchUps.push({
      homeId: team.getId(),
      awayId: pot3[index + 1].getId(),
    })
    matchUps.push({
      homeId: team.getId(),
      awayId: pot4[index + 1].getId(),
    })
  })

  matchUps.forEach((match: MatchUp) => {
    Match.addTemplate(
      match.homeId,
      match.awayId,
      competitionId,
      StageSQL.LP,
      null,
      seasonId
    )
  })
}

export const drawMatchupsForKpoOrR16 = (
  teams: Team[],
  seasonId: number,
  stage: StageSQL,
  competitionId: number
) => {
  console.log('drawing matches');
  
  if (teams.length % 2 !== 0) {
    throw new Error('Not an even number of teams')
  }

  if (!teams[0].getGroupPosition(seasonId)) {
    throw new Error('Group positions not defined')
  }

  // TODO: fix
  const sortedTeams = teams.sort((a: Team, b: Team) => {
    const aPosition = a.getGroupPosition(seasonId)
    const bPosition = b.getGroupPosition(seasonId)

    if (aPosition === null) return 1
    if (bPosition === null) return -1

    return aPosition - bPosition
  })

  const middleIndex = Math.ceil(sortedTeams.length / 2)
 
  
  let matchUps: MatchUp[] = []

  // TODO: Optimize this
  while (
    matchUps.length === 0 ||
    matchUps.some((match: MatchUp) => match.homeNationId === match.awayNationId)
  ) {
    const seeded = shuffleTeams(sortedTeams.slice(0, middleIndex))
    const unSeeded = shuffleTeams(sortedTeams.slice(middleIndex))

    matchUps.length = 0
    seeded.forEach((seed: Team, index: number) => {
      const unSeed = unSeeded[index]

      const homeId = unSeed.getId()
      const awayId = seed.getId()

      const homeNationId = Association.fetchByTeamId(homeId).getId()
      const awayNationId = Association.fetchByTeamId(awayId).getId()

      const matchUp = {
        homeId,
        homeNationId,
        awayId,
        awayNationId,
      }
      matchUps.push(matchUp)
    })
  }

  matchUps.forEach((match: MatchUp) => {
    Match.addTemplate(
      match.homeId,
      match.awayId,
      competitionId,
      stage,
      1,
      seasonId
    )
    Match.addTemplate(
      match.awayId,
      match.homeId,
      competitionId,
      stage,
      2,
      seasonId
    )
  })
}

export const drawMatchupsForQfOrSf = (
  teams: Team[],
  seasonId: number,
  stage: StageSQL,
  competitionId: number
) => {
  if (teams.length % 2 !== 0) {
    throw new Error('Not an even number of teams')
  }

  const shuffledTeams = shuffleTeams(teams)
  let matchUps: MatchUp[] = []

  shuffledTeams.forEach((team: Team, index: number) => {
    // Don't loop the second half of the teams
    if (matchUps.length >= shuffledTeams.length / 2) {
      return
    }

    const homeId = team.getId()
    const awayId = shuffledTeams[shuffledTeams.length - 1 - index].getId()

    const matchUp = {
      homeId,
      awayId,
    }
    matchUps.push(matchUp)
  })

  matchUps.forEach((match: MatchUp) => {
    Match.addTemplate(
      match.homeId,
      match.awayId,
      competitionId,
      stage,
      1,
      seasonId
    )
    Match.addTemplate(
      match.awayId,
      match.homeId,
      competitionId,
      stage,
      2,
      seasonId
    )
  })
}

export const setFinal = (
  teams: Team[],
  seasonId: number,
  competitionId: number
) => {
  if (teams.length % 2 !== 0) {
    throw new Error('Not an even number of teams')
  }
  Match.addTemplate(
    teams[0].getId(),
    teams[1].getId(),
    competitionId,
    StageSQL.F,
    null,
    seasonId
  )
}
