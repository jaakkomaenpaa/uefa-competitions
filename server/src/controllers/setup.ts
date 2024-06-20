import { Request, Response } from 'express'
import { DB } from '../utils/config'

import { nations as nations0 } from '../data/nationCoeffs/2018-19'
import { nations as nations1 } from '../data/nationCoeffs/2019-20'
import { nations as nations2 } from '../data/nationCoeffs/2020-21'
import { nations as nations3 } from '../data/nationCoeffs/2021-22'
import { nations as nations4 } from '../data/nationCoeffs/2022-23'
import { nations as nations5 } from '../data/nationCoeffs/2023-24'

import { teams as teams0 } from '../data/clubCoeffs/1-8'
import { teams as teams1 } from '../data/clubCoeffs/9-16'
import { teams as teams2 } from '../data/clubCoeffs/17-24'
import { teams as teams3 } from '../data/clubCoeffs/25-32'
import { teams as teams4 } from '../data/clubCoeffs/33-40'
import { teams as teams5 } from '../data/clubCoeffs/41-48'
import { teams as teams6 } from '../data/clubCoeffs/49-55'
import Stage from '../classes/Stage'
import DomSeason from '../classes/DomSeason'

export const setupNationCoeffs = (req: Request, res: Response) => {
  const allSeasons = [nations0, nations1, nations2, nations3, nations4, nations5]

  allSeasons.forEach((season, index) => {
    season.forEach(nation => {
      const id = DB.prepare('SELECT id FROM confederations WHERE name = ?').get(
        nation.name
      ) as { id: number }

      // Start from season 1
      const insert = DB.prepare(
        `
        INSERT INTO confederation_seasons (confederation_id, season_id, coeff_points)
        VALUES (?, ?, ?)
      `
      ).run(id.id, index + 1, nation.coeffPoints)

      if (insert.changes === 0) {
        throw new Error('Insert nation failed')
      }
    })
  })
  res.status(201).json({ message: 'Success' })
}

export const setupClubCoeffs = (req: Request, res: Response) => {
  const allTeamLists = [teams0, teams1, teams2, teams3, teams4, teams5, teams6]

  allTeamLists.forEach(teamList => {
    teamList.forEach(nation => {
      nation.clubs.forEach(club => {
        const id = DB.prepare('SELECT id FROM teams WHERE name = ?').get(
          club.name
        ) as { id: number }

        const allSeasons = [
          club['2019-20'],
          club['2020-21'],
          club['2021-22'],
          club['2022-23'],
          club['2023-24'],
        ]

        // Start from season 2
        allSeasons.forEach((season, index) => {
          const insert = DB.prepare(
            `
            INSERT INTO team_seasons_uefa (team_id, season_id, points)
            VALUES (?, ?, ?)  
          `
          ).run(id.id, index + 2, season)

          if (insert.changes === 0) {
            throw new Error('Insert nation failed')
          }
        })
      })
    })
  })
  res.status(201).json({ message: 'Success' })
}

export const setupSeasons = (req: Request, res: Response) => {
  const seasons = [1, 2, 3, 4, 5, 6]
  seasons.forEach((season, index) => {
    const startYear = index + 2018
    const endYear = index + 2019

    const insert = DB.prepare(
      `
      INSERT INTO seasons (id, start_year, end_year)
      VALUES (?, ?, ?)
    `
    ).run(season, startYear, endYear)

    if (insert.changes === 0) {
      throw new Error('Insert nation failed')
    }
  })
  res.status(201).json({ message: 'Success' })
}

export const setupStages = (req: Request, res: Response) => {
  const seasons = [1, 2, 3, 4, 5, 6]
  seasons.forEach(season => {
    Stage.initAll(season)

    const update = DB.prepare(
      `
      UPDATE stages
      SET is_finished = 1
    `
    ).run()

    if (update.changes === 0) {
      throw new Error('Insert nation failed')
    }
  })
  res.status(201).json({ message: 'Success' })
}

export const setupDomestic = (req: Request, res: Response) => {
  DomSeason.setAll(6)
  res.status(201).json({ message: 'Success' })
}

// Finals for season 2023/24
export const setupFinals = (req: Request, res: Response) => {
  const insert = DB.prepare(
    `
    INSERT INTO matches (home_id, away_id, competition_id, home_score, away_score, is_overtime, stage, season_id)
    VALUES
    (281, 705, 1, 0, 2, 0, 'F', 6),
    (365, 283, 2, 3, 0, 0, 'F', 6),
    (304, 364, 3, 1, 0, 1, 'F', 6);  
  `
  ).run()

  if (insert.changes === 0) {
    throw new Error('Insert nation failed')
  }
  res.status(201).json({ message: 'Success' })
}
