import { CompetitionCode, StageSQL, TournamentPhase } from '../types'
import { DB } from '../utils/config'
import {
  initDrawForKoPhase,
  initDrawForLeaguePhase,
  initDrawForQualStage,
} from '../utils/drawInitialisers'
import { convertStageToPhase, get2LegMatchWinner } from '../utils/helpers'
import {
  finishKoStage,
  finishLeagueStage,
  finishQualStage,
} from '../utils/stageFinishers'
import Match from './Match'
import Season from './Season'
import Team from './Team'

export default class Stage {
  constructor(
    private stage: StageSQL,
    private competitionId: CompetitionCode | null = null,
    private matches: Match[] = []
  ) {}

  static initAll(seasonId: number): void {
    const competitions = Object.values(CompetitionCode).filter(
      (value): value is CompetitionCode => typeof value === 'number'
    )

    // Iterate through allocations and place teams according to them
    competitions.forEach((comp: CompetitionCode) => {
      const stages = Object.values(StageSQL) as StageSQL[]

      stages.forEach((stage: StageSQL) => {
        const insert = DB.prepare(
          `
            INSERT INTO stages (stage, season_id, competition_id, is_finished)
            VALUES (?, ?, ?, ?)
        `
        ).run(stage, seasonId, comp, 0)

        if (insert.changes === 0) {
          throw new Error('Inserting stage failed')
        }
      })
    })
  }

  public finish(): void {
    if (!this.competitionId) {
      throw new Error('Competition id missing')
    }

    const seasonId = Season.fetchCurrent().getId()

    const rows = DB.prepare(
      `
      SELECT id, home_id AS homeId, home_score AS homeScore, away_id AS awayId, 
        away_score AS awayScore, is_overtime AS isOvertime, stage, 
        competition_id AS competitionId, season_id AS seasonId
      FROM matches
      WHERE season_id = ?
        AND competition_id = ?
        AND stage = ? 
    `
    ).all(seasonId, this.competitionId, this.stage) as Match[]

    if (!rows) {
      throw new Error(`Matches for stage ${this.stage} not found`)
    }

    this.matches = rows.map(row => Match.createFromRow(row))
    const phase = convertStageToPhase(this.stage)

    if (phase === TournamentPhase.Qualifying) {
      finishQualStage(this.matches, this.competitionId, this.stage)
    } else if (phase === TournamentPhase.League) {
      finishLeagueStage(seasonId, this.competitionId)
    } else {
      finishKoStage(this.matches, this.competitionId, this.stage)
    }

    const update = DB.prepare(
      `
      UPDATE stages
      SET is_finished = 1
      WHERE season_id = ?
        AND stage = ?
        AND competition_id = ?  
    `
    ).run(seasonId, this.stage, this.competitionId)

    if (update.changes === 0) {
      throw new Error('Finishing stage failed')
    }
  }

  public makeDraw(): void {   
    const seasonId = Season.fetchCurrent().getId()

    if (!this.competitionId) {
      throw new Error('Competition id not set')
    }

    const prevStage = this.getPrevious()
    
    if (prevStage) {
      const prevStageObj = new Stage(prevStage, this.competitionId)

      if (!prevStageObj.isFinished(seasonId)) {
        throw new Error('Previous stage is not finished yet')
      }
    }

    const phase = convertStageToPhase(this.stage)

    if (phase === TournamentPhase.Qualifying) {
      initDrawForQualStage(this.competitionId, this.stage, seasonId)
    } else if (phase === TournamentPhase.League) {
      initDrawForLeaguePhase(this.competitionId, seasonId)
    } else if (phase === TournamentPhase.Knockout) {
      console.log('phase ko');

      initDrawForKoPhase(this.competitionId, this.stage, seasonId)
    }
  }

  public isFinished(seasonId: number): boolean {
    const row = DB.prepare(
      `
      SELECT is_finished AS isFinished
      FROM stages
      WHERE season_id = ?
        AND competition_id = ?
        AND stage = ?
      `
    ).get(seasonId, this.competitionId, this.stage) as {
      isFinished: boolean
    }

    if (!row) {
      throw new Error('Could not find stage')
    }

    return row.isFinished
  }

  public getTeams(isChampPath: boolean, isLeaguePath: boolean): Team[] {
    const seasonId = Season.fetchCurrent().getId()

    if (!this.stage || !this.competitionId) {
      throw new Error('Stage and competition id needed')
    }

    const rows = DB.prepare(
      `
      SELECT t.id, t.name, t.logo, t.code, t.confederation_id AS associationId
      FROM team_seasons_uefa AS tsd
      INNER JOIN teams AS t ON t.id = tsd.team_id
      WHERE season_id = ?
        AND competition_id = ?
        AND stage = ?  
    `
    ).all(seasonId, this.competitionId, this.stage) as Team[]

    if (!rows) {
      throw new Error(`Teams for stage ${this.stage} not found`)
    }

    let teams = rows.map(row => Team.createFromRow(row))

    if (isChampPath) {
      teams = teams.filter((team: Team) => team.isInChampPath())
    }

    if (isLeaguePath) {
      teams = teams.filter((team: Team) => !team.isInChampPath())
    }
    return teams
  }

  public getWinningTeams(): Team[] {
    if (this.matches.length === 0) {
      throw new Error('Stage does not include any matches')
    }

    const winners: Team[] = []
    this.matches.forEach((match: Match) => {
      const winner: Team = get2LegMatchWinner(
        match.getHomeId(),
        match.getAwayId(),
        match.getSeasonId(),
        match.getCompetitionId(),
        match.getStage()
      )!

      if (!winner) {
        throw new Error('Match winner not found')
      }

      if (!winners.some((team: Team) => team.getId() === winner.getId())) {
        winners.push(winner)
      }
    })
    return winners
  }

  public getLosingTeams(): Team[] {
    if (this.matches.length === 0) {
      throw new Error('Stage does not include any matches')
    }

    const losers: Team[] = []
    this.matches.forEach((match: Match) => {
      const winner: Team = get2LegMatchWinner(
        match.getHomeId(),
        match.getAwayId(),
        match.getSeasonId(),
        match.getCompetitionId(),
        match.getStage()
      )!

      if (!winner) {
        throw new Error('Match winner not found')
      }

      const loserId =
        winner.getId() === match.getHomeId() ? match.getAwayId() : match.getHomeId()

      const loser = Team.fetchById(loserId)

      if (!losers.some((team: Team) => team.getId() === loser.getId())) {
        losers.push(loser)
      }
    })
    return losers
  }

  public getNext(): StageSQL | null {
    const stages = Object.values(StageSQL)
    const nextStageIndex = stages.indexOf(this.stage) + 1

    if (nextStageIndex >= stages.length) {
      return null
    }
    return stages[nextStageIndex]
  }

  public getPrevious(): StageSQL | null {
    const stages = Object.values(StageSQL)
    const prevStageIndex = stages.indexOf(this.stage) - 1

    if (prevStageIndex < 0) {
      return null
    }
    return stages[prevStageIndex]
  }
}
