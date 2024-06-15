import { Request, Response } from 'express'
import UefaCompetition from '../classes/UefaCompetition'
import { CompetitionCode } from '../types'

export const getAllCompetitions = (req: Request, res: Response) => {
  const competitions = UefaCompetition.fetchAll()
  res.json(competitions)
}

export const getCompetitionById = (req: Request, res: Response) => {
  const competitionId = parseInt(req.params.competitionId) as CompetitionCode

  if (!(competitionId in CompetitionCode)) {
    res.status(400).json({ message: 'Invalid competition id' })
  }
  const competition = UefaCompetition.fetchById(competitionId)
  res.json(competition)
}
