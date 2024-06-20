import { Request, Response } from 'express'
import DomSeason from '../classes/DomSeason'
import Team from '../classes/Team'

export const getTeamsByDomSeason = (req: Request, res: Response) => {
  const seasonId = parseInt(req.params.seasonId)
  const associationId = parseInt(req.params.associationId)
  const season = new DomSeason(seasonId, associationId)
  const teams = season.fetchTeams()
  res.json(teams)
}

export const getDomSeasonStatuses = (req: Request, res: Response) => {
  const seasonId = parseInt(req.params.seasonId)
  const associations = DomSeason.fetchStatuses(seasonId)
  res.json(associations)
}

export const initAllDomSeasons = (req: Request, res: Response) => {
  const { seasonId } = req.body
  const currentSeason = DomSeason.fetchCurrent()
  if (currentSeason.getSeasonId() >= seasonId) {
    return res
      .status(400)
      .json({ message: 'Cannot initialize an already existing season' })
  }
  try {
    DomSeason.setAll(seasonId)
    res.status(201).json({ message: 'Success' })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' })
  }
}

export const postDomSeasonResults = (req: Request, res: Response) => {
  const seasonId = parseInt(req.params.seasonId)
  const associationId = parseInt(req.params.associationId)
  let { league, cupWinner } = req.body

  league = league.map((team: { id: number }) => Team.fetchById(team.id))
  cupWinner = Team.fetchById(cupWinner.id)

  const season = new DomSeason(seasonId, associationId)
  try {
    season.postResults(league, cupWinner)
    res.status(201).json({ message: 'Success' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}
