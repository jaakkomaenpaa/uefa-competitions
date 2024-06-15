import { Request, Response } from 'express'
import Ranking from '../classes/Ranking'

export const getAssociationCoefficients = (req: Request, res: Response) => {
  const seasonId = parseInt(req.params.seasonId)
  const seasons = parseInt(req.params.seasons)
  const ranking = Ranking.fetchAssociationRanking(seasonId, seasons)
  res.json(ranking)
}

export const getClubCoefficients = (req: Request, res: Response) => {
  const seasonId = parseInt(req.params.seasonId)
  const seasons = parseInt(req.params.seasons)
  const ranking = Ranking.fetchClubRanking(seasonId, seasons)
  res.json(ranking)
}
