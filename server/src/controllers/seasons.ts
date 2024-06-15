import { Request, Response } from 'express'
import Season from '../classes/Season'

export const getAllSeasons = (req: Request, res: Response) => {
  const seasons = Season.fetchAll()
  res.json(seasons)
}

export const getSeasonById = (req: Request, res: Response) => {
  const seasonId = parseInt(req.params.seasonId)
  const season = Season.fetchById(seasonId)
  res.json(season)
}

export const getCurrentSeason = (req: Request, res: Response) => {  
  const currentSeason = Season.fetchCurrent()
  res.json(currentSeason)
}

export const setNextSeason = (req: Request, res: Response) => {
  try {
    const nextSeason = Season.setNext()
    res.status(201).json(nextSeason)
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' })
  }
}