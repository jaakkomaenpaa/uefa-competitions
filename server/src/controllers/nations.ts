import { Request, Response } from 'express'
import { DB } from '../utils/config'
import Association from '../classes/Association'

export const getAllAssociations = (req: Request, res: Response) => {
  const associations = Association.fetchAll()
  res.json(associations)
}

export const getAssociationIds = (req: Request, res: Response) => {
  const query = DB.prepare('SELECT id FROM confederations')
  const data = query.all()
  res.json(data)
}

export const getAssociationById = (req: Request, res: Response) => {
  const associationId: number = parseInt(req.params.associationId)
  const association = Association.fetchById(associationId)
  res.json(association)
}
