import { DB } from '../utils/config'
import Association from './Association'
import Season from './Season'
import Team from './Team'

export default class DomSeason {
  constructor(private seasonId: number, private associationId: number) {}

  public static createFromRow(row: any): DomSeason {
    return new DomSeason(row.seasonId, row.associationId)
  }

  static fetchStatuses(seasonId: number): Association[] {
    const rows = DB.prepare(
      `
      SELECT c.id, c.name, c.flag, c.code,
        CASE 
          WHEN EXISTS (
            SELECT 1
            FROM team_seasons_domestic AS tsd
            WHERE tsd.confederation_id = c.id 
              AND tsd.season_id = ?
              AND tsd.league_position IS NULL
          ) THEN 0
          ELSE 1
        END AS seasonFinished
      FROM confederations AS c
      ORDER BY c.name ASC
    `
    ).all(seasonId) as Association[]
    if (!rows) {
      throw new Error('Statuses not found')
    }
    return rows.map(row => Association.createFromRow(row))
  }

  static fetchCurrent(): DomSeason {
    const row = DB.prepare(
      `
      SELECT season_id AS seasonId, confederation_id AS associationId
      FROM team_seasons_domestic AS tsd
      GROUP BY season_id 
      ORDER BY season_id DESC  
    `
    ).get() as DomSeason
    if (!row) {
      throw new Error('Season not found')
    }
    return this.createFromRow(row)
  }

  static setAll(seasonId: number): void {
    const associations = Association.fetchAll()

    associations.forEach((association: Association) => {
      const teams = Team.fetchByLeague(association.getId())

      teams.forEach((team: Team) => {
        const insert = DB.prepare(
          `
          INSERT INTO team_seasons_domestic (team_id, season_id, confederation_id, is_cup_winner)
          VALUES (?, ?, ?, ?)
        `
        ).run(team.getId(), seasonId, association.getId(), 0)

        if (insert.changes === 0) {
          throw new Error('Setting season failed')
        }
      })
    })
  }

  public fetchTeams(): Team[] {
    const rows = DB.prepare(
      `
      SELECT team_id AS id, t.name, t.logo, t.code, 
        league_position AS leaguePosition, is_cup_winner AS isCupWinner
      FROM team_seasons_domestic
      INNER JOIN teams AS t ON t.id = team_id
      WHERE t.confederation_id = ? AND season_id = ?
      ORDER BY league_position ASC
    `
    ).all(this.associationId, this.seasonId) as Team[]
    if (!rows) {
      throw new Error('Teams not found')
    }
    return rows.map(row => Team.createFromRow(row))
  }

  public postResults(league: Team[], cupWinner: Team): void {
    league.forEach((team: Team, index: number) => {
      const isCupWinner: number = team.getId() === cupWinner.getId() ? 1 : 0

      const insert = DB.prepare(
        `
        UPDATE team_seasons_domestic
        SET league_position = ?, is_cup_winner = ?
        WHERE team_id = ? AND season_id = ?
      `
      ).run(index + 1, isCupWinner, team.getId(), this.seasonId)

      if (insert.changes === 0) {
        throw new Error('Setting results failed')
      }
    })
  }

  public getSeasonId(): number {
    return this.seasonId
  }
}
