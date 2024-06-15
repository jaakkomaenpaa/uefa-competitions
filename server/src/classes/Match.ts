import { ASSOCIATION_POINTS, TEAM_POINTS } from '../rules/points'
import { CompetitionCode, StageSQL, TournamentPhase } from '../types'
import { DB } from '../utils/config'
import { convertStageToPhase } from '../utils/helpers'
import Association from './Association'
import Team from './Team'

export default class Match {
  constructor(
    private id: number,
    private homeId: number,
    private awayId: number,
    private competitionId: CompetitionCode,
    private stage: StageSQL,
    private seasonId: number,
    private homeScore: number | null = null,
    private awayScore: number | null = null,
    private pensHome: number | null = null,
    private pensAway: number | null = null,
    private leg: number | null = null,
    private isOvertime: boolean = false
  ) {}

  public static createFromRow(row: any): Match {
    return new Match(
      row.id,
      row.homeId,
      row.awayId,
      row.competitionId,
      row.stage,
      row.seasonId,
      row.homeScore ?? null,
      row.awayScore ?? null,
      row.pensHome ?? null,
      row.pensAway ?? null,
      row.leg ?? null,
      row.isOvertime ?? false
    )
  }

  static fetchAll(): Match[] {
    const rows = DB.prepare(
      `
      SELECT id, home_id AS homeId, away_id AS awayId, competition_id AS competitionId,
        home_score AS homeScore, away_score AS awayScore, stage, season_id AS seasonId, leg,
        penalties_home AS pensHome, penalties_away AS pensAway, is_overtime AS isOvertime
      FROM matches  
    `
    ).all() as Match[]
    if (!rows) {
      throw new Error('Matches not found')
    }
    return rows.map(row => this.createFromRow(row))
  }

  static fetchById(id: number): Match {
    const row = DB.prepare(
      `
      SELECT id, home_id AS homeId, away_id AS awayId, competition_id AS competitionId,
             home_score AS homeScore, away_score AS awayScore, penalties_home AS pensHome,
             penalties_away AS pensAway, is_overtime AS isOvertime, stage, leg, 
             season_id AS seasonId
      FROM matches
      WHERE id = ?
    `
    ).get(id) as Match
    if (!row) {
      throw new Error('Match not found')
    }
    return this.createFromRow(row)
  }

  static fetchByData(
    homeId: number,
    awayId: number,
    seasonId: number,
    competitionId: number,
    stage: StageSQL
  ): Match {
    const row = DB.prepare(
      `
      SELECT id, home_id AS homeId, away_id AS awayId, competition_id AS competitionId,
              home_score AS homeScore, away_score AS awayScore, penalties_home AS pensHome,
              penalties_away AS pensAway, is_overtime AS isOvertime, stage, leg, 
              season_id AS seasonId  
      FROM matches
      WHERE season_id = ?
        AND competition_id = ?
        AND home_id = ?
        AND away_id = ?
        AND stage = ?
    `
    ).get(seasonId, competitionId, homeId, awayId, stage) as Match
    if (!row) {
      throw new Error('Match not found')
    }
    return this.createFromRow(row)
  }

  static addTemplate(
    homeId: number,
    awayId: number,
    competitionId: CompetitionCode,
    stage: StageSQL,
    leg: number | null,
    seasonId: number
  ): void {
    const insert = DB.prepare(
      `
      INSERT INTO matches (home_id, away_id, competition_id, stage, leg, season_id, is_overtime)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    ).run(homeId, awayId, competitionId, stage, leg, seasonId, 0)
    if (insert.changes === 0) {
      throw new Error('Adding match template failed')
    }
  }

  public getId(): number {
    return this.id
  }

  public getHomeId(): number {
    return this.homeId
  }

  public getAwayId(): number {
    return this.awayId
  }

  public getSeasonId(): number {
    return this.seasonId
  }

  public getStage(): StageSQL {
    return this.stage
  }

  public getCompetitionId(): CompetitionCode {
    return this.competitionId
  }

  public getHomeScore(): number | null {
    return this.homeScore
  }

  public getAwayScore(): number | null {
    return this.awayScore
  }

  public getPensHome(): number | null {
    return this.pensHome
  }

  public getPensAway(): number | null {
    return this.pensAway
  }

  public getLeg(): number | null {
    return this.leg
  }

  public getIsOvertime(): boolean {
    return this.isOvertime
  }

  public getWinnerId(): number | null {
    if (!this.homeScore || !this.awayScore) {
      return null
    } else if (this.homeScore > this.awayScore) {
      return this.homeId
    } else if (this.awayScore > this.homeScore) {
      return this.awayId
    } else if (this.pensHome && this.pensAway) {
      if (this.pensHome > this.pensAway) {
        return this.homeId
      } else if (this.pensAway > this.pensHome) {
        return this.awayId
      }
    }
    return null
  }

  public setScore(
    homeScore: number,
    awayScore: number,
    isOvertime: boolean,
    pensHome: number | null,
    pensAway: number | null
  ): void {
    const update = DB.prepare(
      `
      UPDATE matches
      SET home_score = ?, away_score = ?, is_overtime = ?, penalties_home = ?, penalties_away = ?
      WHERE id = ?
    `
    ).run(
      homeScore,
      awayScore,
      isOvertime ? 1 : 0,
      pensHome,
      pensAway,
      this.id
    )
    if (update.changes === 0) {
      throw new Error('Setting match score failed')
    }

    this.homeScore = homeScore
    this.awayScore = awayScore
  }

  public setCoeffPoints(): void {
    const homeNation = Association.fetchByTeamId(this.homeId)
    const awayNation = Association.fetchByTeamId(this.awayId)
    const homeTeam = Team.fetchById(this.homeId)
    const awayTeam = Team.fetchById(this.awayId)

    if (this.homeScore === null || this.awayScore === null) {
      throw new Error('Home and away score not defined')
    }

    const phase: TournamentPhase = convertStageToPhase(this.stage)

    let homeNationPoints = 0
    let awayNationPoints = 0
    let homeTeamPoints = 0
    let awayTeamPoints = 0

    const winnerId = this.getWinnerId()

    if (this.homeId === winnerId) {
      homeNationPoints = ASSOCIATION_POINTS.matchWin[this.competitionId][phase]
      homeTeamPoints = TEAM_POINTS.matchWin[this.competitionId][this.stage]
    } else if (this.awayId === winnerId) {
      awayNationPoints = ASSOCIATION_POINTS.matchWin[this.competitionId][phase]
      awayTeamPoints = TEAM_POINTS.matchWin[this.competitionId][this.stage]
    } else {
      homeNationPoints = ASSOCIATION_POINTS.matchDraw[this.competitionId][phase]
      homeTeamPoints = TEAM_POINTS.matchDraw[this.competitionId][this.stage]
      awayNationPoints = ASSOCIATION_POINTS.matchDraw[this.competitionId][phase]
      awayTeamPoints = TEAM_POINTS.matchDraw[this.competitionId][this.stage]
    }

    homeNation.increasePoints(homeNationPoints)
    awayNation.increasePoints(awayNationPoints)
    homeTeam.increasePoints(homeTeamPoints)
    awayTeam.increasePoints(awayTeamPoints)
  }
}
