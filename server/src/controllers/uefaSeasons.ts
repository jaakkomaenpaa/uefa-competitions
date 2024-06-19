import { Request, Response } from 'express'

import { BaseRankNation, StageSQL, TeamWithStats } from '../types'
import { baseRanking } from '../data/baseNationRank'
import UefaSeason from '../classes/UefaSeason'
import Ranking from '../classes/Ranking'
import Team from '../classes/Team'

export const getLeagueTeamsByUefaSeason = (req: Request, res: Response) => {
  const seasonId = parseInt(req.params.seasonId)
  const competitionId = parseInt(req.params.competitionId)

  const season = new UefaSeason(seasonId, competitionId)
  const teams = season.getLeaguePhase()

  const teamsWithStats = teams.map((team: TeamWithStats) => {
    const stats = {
      played: team.won + team.drawn + team.lost,
      goalDifference: team.goalsFor - team.goalsAgainst,
      points: 3 * team.won + team.drawn,
    }
    return { ...team, ...stats }
  })

  res.json(teamsWithStats)
}

export const getMatchesByCompStage = (req: Request, res: Response) => {
  const seasonId = parseInt(req.params.seasonId)
  const competitionId = parseInt(req.params.competitionId)
  const stage: StageSQL = req.query.stage as StageSQL

  const season = new UefaSeason(seasonId, competitionId)
  const matches = season.getMatchesByStage(stage)

  const updatedMatches = matches.map((match) => {
    const homeTeam = Team.fetchById(match.getHomeId())
    const awayTeam = Team.fetchById(match.getAwayId())

    return {
      id: match.getId(),
      homeId: match.getHomeId(),
      homeTeam: homeTeam.getName(),
      homeScore: match.getHomeScore(),
      pensHome: match.getPensHome(),
      homeLogo: homeTeam.getLogo(),
      awayId: match.getAwayId(),
      awayTeam: awayTeam.getName(),
      awayScore: match.getAwayScore(),
      pensAway: match.getPensAway(),
      awayLogo: awayTeam.getLogo(),
      seasonId: match.getSeasonId(),
      stage: match.getStage(),
      competitionId: match.getCompetitionId(),
      isOverTime: match.getIsOvertime(),
      leg: match.getLeg()
    }
  })

  res.json(updatedMatches)
}

export const getUefaCompStatus = (req: Request, res: Response) => {
  const seasonId = parseInt(req.params.seasonId)
  const competitionId = parseInt(req.params.competitionId)

  const season = new UefaSeason(seasonId, competitionId)
  const status = season.getCompStatus()

  res.json(status)
}

export const initNationUefaSeasons = (req: Request, res: Response) => {
  const seasonId = parseInt(req.params.seasonId)

  const currentSeason = UefaSeason.fetchCurrent()
  if (currentSeason.getSeasonId() >= seasonId) {
    return res
      .status(400)
      .json({ message: 'Cannot initialize an already existing season' })
  }

  try {
    UefaSeason.initAssociations(seasonId)
    res.status(201).json({ message: 'Success' })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' })
  }
}

export const initUefaSpots = (req: Request, res: Response) => {
  const seasonId = parseInt(req.params.seasonId)

  const associationRanking = Ranking.fetchAssociationRanking(seasonId, 5)
  // TODO: Replace with actual ranking
  const tempRank = baseRanking.filter(e => e.id !== 1 && e.id !== 235) as BaseRankNation[]

  const season = new UefaSeason(seasonId)

  try {
    season.setTemplSpots(tempRank)
    season.setEpsSpots()
    season.setTitleHolderSpots()
    res.status(201).json({ message: 'Success' })
  } catch (error) {
    console.log(error) 
    res.status(500).json({ message: 'An error occurred' })
  }
}

export const setFirstQualStages = (req: Request, res: Response) => {
  const seasonId = parseInt(req.params.seasonId)
  const season = new UefaSeason(seasonId)

  try {
    season.setFirstQualStages()
    res.status(201).json({ message: 'Success' })
  } catch (error) {
    console.log(error) 
    res.status(500).json({ message: 'An error occurred' })
  }
}
