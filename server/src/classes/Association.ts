import { baseRanking } from '../data/baseNationRank'
import { DB } from '../utils/config'
import Ranking from './Ranking'
import Season from './Season'
import Team from './Team'

export default class Association {
  constructor(
    private id: number,
    private name: string,
    private flag: string,
    private code: string,
    private cupName: string | null = null,
    private leagueName: string | null = null,
    private seasonFinished: boolean = false,
    private coeffPoints: number = 0
  ) {}

  public static createFromRow(row: any): Association {
    return new Association(
      row.id,
      row.name,
      row.flag,
      row.code,
      row.cupName ?? null,
      row.leagueName ?? null,
      row.seasonFinished ?? false,
      row.coeffPoints ?? 0
    )
  }

  static fetchAll(): Association[] {
    const rows = DB.prepare(
      `
      SELECT id, name, code, flag, league_name AS leagueName, cup_name AS cupName
      FROM confederations
      ORDER BY name ASC
    `
    ).all() as Association[]
    if (!rows) {
      throw new Error('Associations not found')
    }
    return rows.map(row => this.createFromRow(row))
  }

  static fetchById(id: number): Association {
    const row = DB.prepare(
      `
      SELECT id, name, flag, code, cup_name AS cupName, league_name AS leagueName
      FROM confederations 
      WHERE id = ?
    `
    ).get(id) as Association
    if (!row) {
      throw new Error('Association not found')
    }
    return this.createFromRow(row)
  }

  static fetchByCode(code: string): Association {
    const row = DB.prepare(
      `
      SELECT id, name, flag, code, cup_name AS cupName, league_name AS leagueName
      FROM confederations
      WHERE code = ?`
    ).get(code) as Association
    if (!row) {
      throw new Error('Association not found')
    }
    return this.createFromRow(row)
  }

  static fetchByTeamId(teamId: number): Association {
    const row = DB.prepare(
      `
      SELECT c.id, c.name, c.flag, c.code
      FROM teams AS t
      INNER JOIN confederations AS c ON c.id = t.confederation_id
      WHERE t.id = ?  
    `
    ).get(teamId) as Association

    if (!row) {
      throw new Error('Association not found')
    }
    return this.createFromRow(row)
  }

  static fetchByRank(rank: number, seasonId: number): Association {
    const rankList = Ranking.fetchAssociationRanking(seasonId, 5)
    const ranking = rankList.filter(
      nation => nation.getId() !== 1 && nation.getId() !== 235
    )
    const id = ranking[rank - 1].id
    return this.fetchById(id)
  }

  public getId(): number {
    return this.id
  }

  public getName(): string {
    return this.name
  }

  public getFlag(): string {
    return this.flag
  }

  public getCode(): string {
    return this.code
  }

  public getCupName(): string | null {
    return this.cupName
  }

  public getLeagueName(): string | null {
    return this.leagueName
  }

  public getCoeffPoints(seasonId: number, seasons: number): number {
    let firstSeasonId = seasonId - seasons + 1
    if (firstSeasonId < 1) {
      firstSeasonId = 1
    }

    const row = DB.prepare(
      `
      SELECT SUM(coeff_points) AS coeffPoints
      FROM confederation_seasons
      WHERE confederation_id = ?
        AND season_id >= ? 
        AND season_id <= ?
    `
    ).get(this.id, firstSeasonId, seasonId) as { coeffPoints: number }

    if (!row) {
      return 0
    }

    return row.coeffPoints
  }

  public increasePoints(points: number): void {
    const seasonId = Season.fetchCurrent().getId()
    const teamCount = this.getUefaTeams(seasonId).length
    const coeffPoints = points / teamCount

    console.log('data', this.name, seasonId, teamCount, coeffPoints)

    const update = DB.prepare(
      `
      UPDATE confederation_seasons
      SET coeff_points = coeff_points + ?
      WHERE season_id = ? 
        AND confederation_id = ?  
    `
    ).run(coeffPoints, seasonId, this.id)
    if (update.changes === 0) {
      throw new Error('Point update failed')
    }
  }

  public getCupWinner(seasonId: number): Team {
    const row = DB.prepare(
      `
      SELECT t.id, t.name, t.logo, t.code, t.confederation_id AS associationId,
          league_position AS leaguePosition, is_cup_winner AS isCupWinner
      FROM team_seasons_domestic AS tsd
      INNER JOIN teams AS t ON t.id = tsd.team_id
      WHERE season_id = ?
        AND tsd.confederation_id = ?
        AND is_cup_winner = 1
    `
    ).get(seasonId, this.id) as Team

    if (!row) {
      throw new Error(`Cannot find cup winner from association ${this.id}`)
    }

    return Team.createFromRow(row)
  }

  public getTopLeagueTeams(seasonId: number, amount: number): Team[] {
    const rows = DB.prepare(
      `
      SELECT t.id, t.name, t.logo, t.code, t.confederation_id AS associationId,
          league_position AS leaguePosition, is_cup_winner AS isCupWinner
      FROM team_seasons_domestic AS tsd
      INNER JOIN teams AS t ON t.id = tsd.team_id
      WHERE season_id = ?
        AND tsd.confederation_id = ?
        AND league_position <= ?
      ORDER BY league_position ASC
    `
    ).all(seasonId, this.id, amount) as Team[]

    if (!rows) {
      throw new Error(`Could not find top league teams from association ${this.id}`)
    }

    return rows.map(row => Team.createFromRow(row))
  }

  public getUefaTeams(seasonId: number): Team[] {
    const rows = DB.prepare(
      `
      SELECT t.id, t.name, t.logo, t.code, confederation_id AS association_id, 
        stage, competition_id AS competitionId
      FROM team_seasons_uefa AS tsu
      INNER JOIN teams AS t ON t.id = tsu.team_id
      WHERE confederation_id = ?
        AND season_id = ?
      ORDER BY competition_id ASC
    `
    ).all(this.id, seasonId) as Team[]

    const teams = rows.map(row => Team.createFromRow(row))
    return teams
  }
}
