import { STAGE_DEMOTIONS } from '../rules/general'
import {
  StageSQL,
  CompetitionCode,
  TeamGroupStats,
  TeamWithAssociation,
} from '../types'
import { DB } from '../utils/config'
import Association from './Association'
import Season from './Season'
import Stage from './Stage'

export default class Team {
  constructor(
    private id: number,
    private name: string,
    private logo: string,
    private code: string,
    private associationId: number,
    private currentStage: StageSQL | null = null,
    private competitionId: CompetitionCode | null = null,
    private leaguePosition: number | null = null,
    private isCupWinner: boolean | null = null,
    private coeffPoints: number = 0,
    private groupPosition: number | null = null,

    public won: number | null = null,
    public drawn: number | null = null,
    public lost: number | null = null,
    public goalsFor: number | null = null,
    public goalsAgainst: number | null = null
  ) {}

  public static createFromRow(row: any): Team {
    return new Team(
      row.id,
      row.name,
      row.logo,
      row.code,
      row.associationId,
      row.stage ?? null,
      row.competitionId ?? null,
      row.leaguePosition ?? null,
      row.isCupWinner ?? null,
      row.coeffPoints ?? 0,
      row.groupPosition ?? null,
      row.won ?? null,
      row.drawn ?? null,
      row.lost ?? null,
      row.goalsFor ?? null,
      row.goalsAgainst ?? null
    )
  }

  static fetchAll(): Team[] {
    const rows = DB.prepare(
      `
      SELECT id, name, logo, code, confederation_id AS associationId
      FROM teams
    `
    ).all() as Team[]
    if (!rows) {
      throw new Error('Teams not found')
    }
    return rows.map(row => this.createFromRow(row))
  }

  static fetchById(id: number): Team {
    const row = DB.prepare(
      `
      SELECT id, name, logo, code, confederation_id AS associationId
      FROM teams 
      WHERE id = ?  
    `
    ).get(id) as Team
    if (!row) {
      throw new Error('Team not found')
    }
    return this.createFromRow(row)
  }

  static fetchByLeague(id: number): Team[] {
    const rows = DB.prepare(
      `
    SELECT id, name, logo, code, confederation_id AS associationId
    FROM teams 
    WHERE associationId = ?
      `
    ).all(id) as Team[]
    if (!rows) {
      throw new Error('League not found')
    }
    return rows.map(row => this.createFromRow(row))
  }

  public getId(): number {
    return this.id
  }

  public getName(): string {
    return this.name
  }

  public getLogo(): string {
    return this.logo
  }

  public getCode(): string {
    return this.code
  }

  public getAssociation(): Association {
    return Association.fetchById(this.associationId)
  }

  public getGroupPosition(seasonId: number): number | null {
    const row = DB.prepare(
      `
      SELECT group_position as groupPosition
      FROM team_seasons_uefa
      WHERE team_id = ?
        AND season_id = ?  
    `
    ).get(this.id, seasonId) as { groupPosition: number | null }

    return row.groupPosition
  }

  public getCompetitionId(): CompetitionCode | null {
    return this.competitionId
  }

  public getStage(): StageSQL | null {
    return this.currentStage
  }

  public getIsCupWinner(): boolean | null {
    return this.isCupWinner
  }

  public getLeaguePosition(): number | null {
    return this.leaguePosition
  }

  public getCoeffPoints(): number {
    return this.coeffPoints
  }

  public getWithAssociation(): TeamWithAssociation {
    const association = this.getAssociation()
    return {
      ...this,
      associationFlag: association.getFlag(),
      associationCode: association.getCode(),
      associationName: association.getName(),
    }
  }

  public setCoeffPoints(points: number): void {
    this.coeffPoints = points
  }

  public fetchCoeffPoints(seasonId: number, seasons: number): number {
    let firstSeasonId = seasonId - seasons + 1
    if (firstSeasonId < 1) {
      firstSeasonId = 1
    }

    const row = DB.prepare(
      `
        SELECT SUM(coeff_points) AS coeffPoints
        FROM team_seasons_uefa
        WHERE team_id = ?
          AND season_id >= ? 
          AND season_id <= ?
      `
    ).get(this.id, firstSeasonId, seasonId) as { coeffPoints: number }

    if (!row) {
      return 0
    }

    return row.coeffPoints
  }

  public getSeasonCoeffPoints(seasonId: number): number {
    const row = DB.prepare(
      `
      SELECT coeff_points AS coeffPoints
      FROM confederation_seasons
      WHERE confederation_id = ?
        AND season_id = ? 
    `
    ).get(this.id, seasonId) as { coeffPoints: number }

    if (!row) {
      return 0
    }

    return row.coeffPoints
  }

  public getGroupStats(seasonId: number): TeamGroupStats {
    interface TeamMatch {
      teamId: number
      oppId: number
      teamScore: number
      oppScore: number
    }

    const rows = DB.prepare(
      `
      SELECT home_id AS teamId, home_score AS teamScore, away_score AS oppScore, away_id AS oppId
      FROM matches
      WHERE home_id = ? 
        AND season_id = ?
        AND stage = 'LP'
      UNION 
      SELECT away_id AS teamId, away_score AS teamScore, home_score AS oppScore, home_id AS oppId
      FROM matches
      WHERE away_id = ? 
        AND season_id = ? 
        AND stage = 'LP'
    `
    ).all(this.id, seasonId, this.id, seasonId) as TeamMatch[]

    this.won = 0
    this.drawn = 0
    this.lost = 0
    this.goalsFor = 0
    this.goalsAgainst = 0

    rows.forEach((match: TeamMatch) => {
      this.goalsFor! += match.teamScore
      this.goalsAgainst! += match.oppScore
      if (match.teamScore > match.oppScore) {
        this.won! += 1
      } else if (
        match.teamScore !== null &&
        match.oppScore !== null &&
        match.teamScore === match.oppScore
      ) {
        this.drawn! += 1
      } else if (match.oppScore > match.teamScore) {
        this.lost! += 1
      }
    })

    return {
      won: this.won!,
      drawn: this.drawn!,
      lost: this.lost!,
      goalsFor: this.goalsFor!,
      goalsAgainst: this.goalsAgainst!,
    }
  }

  public increasePoints(points: number): void {
    const seasonId = Season.fetchCurrent().getId()
    const update = DB.prepare(
      `
      UPDATE team_seasons_uefa
      SET coeff_points = coeff_points + ?
      WHERE season_id = ? 
        AND team_id = ?  
    `
    ).run(points, seasonId, this.id)
    if (update.changes === 0) {
      throw new Error('Point update failed')
    }
  }

  public setGroupPosition(rank: number, seasonId: number): void {
    const update = DB.prepare(
      `
      UPDATE team_seasons_uefa
      SET group_position = ?
      WHERE team_id = ?
        AND season_id = ?
    `
    ).run(rank, this.id, seasonId)

    if (update.changes === 0) {
      throw new Error('Setting group position failed')
    }
  }

  public setCurrentStage(): void {
    const seasonId = Season.fetchCurrent().getId()
    const row = DB.prepare(
      `
      SELECT stage, competition_id AS competitionId
      FROM team_seasons_uefa
      WHERE team_id = ?
        AND season_id = ?  
    `
    ).get(this.id, seasonId) as {
      stage: StageSQL
      competitionId: CompetitionCode
    }

    if (!row) {
      throw new Error('Stage not found')
    }

    this.competitionId = row.competitionId
    this.currentStage = row.stage
  }

  public moveToNextStage(): void {
    this.setCurrentStage()

    const stage = new Stage(this.currentStage!)
    const nextStage = stage.getNext()
    if (!nextStage) {
      return
    }

    this.setUefaStage(nextStage, this.competitionId!)
  }

  public dropToLowerComp(): void {
    this.setCurrentStage()

    const demotionConfig = STAGE_DEMOTIONS[this.competitionId!]?.[this.currentStage!]

    if (!demotionConfig) {
      throw new Error(
        `No demotion config found for competition ${this.competitionId} 
        and stage ${this.currentStage}`
      )
    }

    let newCompetitionId: CompetitionCode
    let newStage: StageSQL

    if (typeof demotionConfig === 'function') {
      const result = demotionConfig(this)
      newCompetitionId = result.competitionId
      newStage = result.stage
    } else {
      newCompetitionId = demotionConfig.competitionId
      newStage = demotionConfig.stage
    }

    this.setUefaStage(newStage, newCompetitionId)
  }

  public isInChampPath(): boolean {
    const seasonId = Season.fetchCurrent().getId()

    const row = DB.prepare(
      `
      SELECT league_position AS leaguePosition
      FROM team_seasons_domestic
      WHERE team_id = ?
        AND season_id = ?  
    `
    ).get(this.id, seasonId - 1) as { leaguePosition: number }

    if (!row) {
      throw new Error('League position not found')
    }

    if (this.associationId === 1) {
      return false
    }

    return row.leaguePosition === 1
  }

  public setUefaStage(stage: StageSQL, competitionId: CompetitionCode): void {
    const seasonId = Season.fetchCurrent().getId()

    const rows = DB.prepare(
      `
      SELECT team_id
      FROM team_seasons_uefa
      WHERE team_id = ?
        AND season_id = ?
    `
    ).all(this.id, seasonId)

    // If team already is in competition
    if (rows.length !== 0) {
      const update = DB.prepare(
        `
        UPDATE team_seasons_uefa
        SET stage = ?, competition_id = ?
        WHERE team_id = ?
          AND season_id = ?  
      `
      ).run(stage, competitionId, this.id, seasonId)

      if (update.changes === 0) {
        throw new Error('Updating team stage failed')
      }
    } else {
      const insert = DB.prepare(
        `
        INSERT INTO team_seasons_uefa (team_id, season_id, competition_id, stage)
        VALUES (?, ?, ?, ?)
      `
      ).run(this.id, seasonId, competitionId, stage)

      if (insert.changes === 0) {
        throw new Error('Setting team stage failed')
      }
    }
    this.setCurrentStage()
  }

  public hasQualifiedForLP(competitionId: CompetitionCode): boolean {
    this.setCurrentStage()
    return this.competitionId === competitionId && this.currentStage === StageSQL.LP
  }
}
