import { CompetitionCode, StageSQL } from '../types'
import { TEAMS_BY_STAGE } from '../rules/general'
import { DB } from '../utils/config'
import Team from './Team'

export default class UefaCompetition {
  constructor(
    private id: CompetitionCode,
    private name: string,
    private code: string
  ) {}

  public static createFromRow(row: any): UefaCompetition {
    return new UefaCompetition(row.id, row.name, row.code)
  }

  static fetchAll(): UefaCompetition[] {
    const rows = DB.prepare(
      `
      SELECT id, name, code
      FROM uefa_competitions  
    `
    ).all() as UefaCompetition[]
    if (!rows) {
      throw new Error('Competitions not found')
    }
    return rows.map(row => this.createFromRow(row))
  }

  static fetchById(id: CompetitionCode): UefaCompetition {
    const row = DB.prepare(
      `
      SELECT id, name, code 
      FROM uefa_competitions 
      WHERE id = ?  
    `
    ).get(id) as UefaCompetition
    if (!row) {
      throw new Error('Competition not found')
    }
    return this.createFromRow(row)
  }

  public getId(): CompetitionCode {
    return this.id
  }

  public getName(): string {
    return this.name
  }

  public getCode(): string {
    return this.code
  }

  public getTeamAmount(stage: StageSQL): number {
    return TEAMS_BY_STAGE[this.id][stage]
  }

  public getWinner(seasonId: number): Team {
    const row = DB.prepare(
      `
      SELECT 
        CASE 
          WHEN home_score > away_score THEN home_id
          WHEN away_score > home_score THEN away_id
          ELSE CASE
            WHEN penalties_home > penalties_away THEN home_id
            WHEN penalties_away > penalties_home THEN away_id
            ELSE NULL
          END
        END AS id
      FROM matches
      WHERE stage = 'F'
        AND competition_id = ?
        AND season_id = ?
        AND (home_score IS NOT NULL AND away_score IS NOT NULL)
    `
    ).get(this.id, seasonId) as { id: number }
    return Team.fetchById(row.id)
  }
}
