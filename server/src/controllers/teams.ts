import { Request, Response } from 'express'
import Team from '../classes/Team'

export const getAllTeams = (req: Request, res: Response) => {
  const teams = Team.fetchAll()
  res.json(teams)
}

export const getTeamById = async (req: Request, res: Response) => {
  const teamId: number = parseInt(req.params.teamId)
  const team = Team.fetchById(teamId)
  res.json(team)
}

export const getTeamsByConfederationId = (req: Request, res: Response) => {
  const associationId: number = parseInt(req.params.associationId)
  const teams = Team.fetchByLeague(associationId)
  res.json(teams)
}
