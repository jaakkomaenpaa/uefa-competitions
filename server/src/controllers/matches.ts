import { Request, Response } from 'express'
import Match from '../classes/Match'
import Stage from '../classes/Stage'
import { CompetitionCode, StageSQL } from '../types'

export const getAllMatches = (req: Request, res: Response) => {
  const matches = Match.fetchAll()
  res.json(matches)
}

export const getMatchById = (req: Request, res: Response) => {
  const matchId = parseInt(req.params.matchId)
  const match = Match.fetchById(matchId)
  res.json(match)
}

export const getMatchAggregate = (req: Request, res: Response) => {
  const matchId = parseInt(req.params.matchId)
  const match = Match.fetchById(matchId)
  const aggregate = match.getAggregate()
  res.json(aggregate)
}

export const setMatchScore = (req: Request, res: Response) => {
  const matchId = parseInt(req.params.matchId)
  const { homeScore, awayScore, isOvertime, pensHome, pensAway } = req.body

  const match = Match.fetchById(matchId)
  try {
    match.setScore(homeScore, awayScore, isOvertime)
    match.setCoeffPoints()
    res.status(201).json({ message: 'Success' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}

export const finishStage = (req: Request, res: Response) => {
  const { stage, competitionId } = req.body

  console.log('stage', stage, competitionId)
  const stageObj = new Stage(stage, competitionId)
  try {
    stageObj.finish()
    res.status(201).json({ message: 'Success' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}

export const makeDrawForStage = (req: Request, res: Response) => {
  const competitionId = parseInt(req.params.competitionId) as CompetitionCode
  const stage: StageSQL = req.query.stage as StageSQL

  const stageObj = new Stage(stage, competitionId)

  try {
    stageObj.makeDraw()
    res.status(201).json({ message: 'Success' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}

export const getStageStatus = (req: Request, res: Response) => {
  const seasonId = parseInt(req.params.seasonId)
  const competitionId = parseInt(req.params.competitionId) as CompetitionCode
  const stage: StageSQL = req.query.stage as StageSQL

  const stageObj = new Stage(stage, competitionId)
  const status = stageObj.isFinished(seasonId)
  
  res.json({ finished: status })
}
