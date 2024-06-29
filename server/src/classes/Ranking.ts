import { COEFFICIENT_FACTOR } from '../rules/points'
import { DB } from '../utils/config'
import Association from './Association'
import Team from './Team'

export default class Ranking {
  constructor() {}

  static fetchAssociationRanking(seasonId: number, seasons: number): Association[] {
    let firstSeasonId = seasonId - seasons + 1
    if (firstSeasonId < 1) {
      firstSeasonId = 1
    }

    let rows = DB.prepare(
      `
      SELECT c.id, c.name, c.flag, c.code, SUM(coeff_points) AS coeffPoints
      FROM confederation_seasons AS cs
      INNER JOIN confederations AS c ON  c.id = confederation_id
      WHERE season_id >= ? AND season_id <= ?
      GROUP BY confederation_id
      ORDER BY coeffPoints DESC
    `
    ).all(firstSeasonId, seasonId) as Association[]

    if (!rows) {
      throw new Error('Ranking not found')
    }

    return rows.map(row => Association.createFromRow(row))
  }

  static fetchClubRanking(seasonId: number, seasons: number): Team[] {
    let firstSeasonId = seasonId - seasons + 1
    if (firstSeasonId < 1) {
      firstSeasonId = 1
    }

    const rows = DB.prepare(
      `
      SELECT t.id, t.name, t.logo, t.code, t.confederation_id AS associationId,
         SUM(coeff_points) AS coeffPoints
      FROM team_seasons_uefa AS tsu
      INNER JOIN teams AS t ON t.id = team_id
      WHERE season_id >= ? AND season_id <= ?
      GROUP BY team_id
      ORDER BY coeffPoints DESC
    `
    ).all(firstSeasonId, seasonId) as Team[]

    if (!rows) {
      throw new Error('Ranking not found')
    }

    let teams = rows.map(row => Team.createFromRow(row))

    teams = teams.map((team: Team) => {
      const association = team.getAssociation()
      const associationPoints =
        association.getCoeffPoints(seasonId, seasons) * COEFFICIENT_FACTOR

      if (associationPoints > team.getCoeffPoints()) {
        team.setCoeffPoints(associationPoints)
      }
      return team
    })

    teams = teams.sort((a: Team, b: Team) => {
      return b.getCoeffPoints() - a.getCoeffPoints()
    })

    return teams
  }
}
