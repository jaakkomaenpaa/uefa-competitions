import { baseRanking } from '../data/baseNationRank'
import {
  BaseRankNation,
  CompetitionCode,
  StageSQL,
  TeamWithStats,
} from '../types'
import { DB } from '../utils/config'
import { moveTeamsUp, sortUefaTeams } from '../utils/helpers'
import { drawMatchupsForQualStage } from '../utils/matchGenerators'
import {
  handleUeclVacation,
  promoteUclChampPath,
  promoteUclLeaguePath,
  promoteUclUelReplacements,
  promoteUelQual,
} from '../utils/promotionHandlers'
import { setAssociationSpots } from '../utils/uefaSpotSetters'
import Association from './Association'
import Match from './Match'
import Ranking from './Ranking'
import Stage from './Stage'
import Team from './Team'
import UefaCompetition from './UefaCompetition'

export default class UefaSeason {
  constructor(
    private seasonId: number,
    private competitionId: CompetitionCode | null = null
  ) {}

  public static createFromRow(row: any): UefaSeason {
    return new UefaSeason(row.seasonId, row.competitionId)
  }

  static initAssociations(seasonId: number): void {
    const associations = Association.fetchAll()

    associations.forEach((association: Association) => {
      const insert = DB.prepare(
        `
        INSERT INTO confederation_seasons (confederation_id, season_id, coeff_points)
        VALUES (?, ?, ?)
      `
      ).run(association.getId(), seasonId, 0)

      if (insert.changes === 0) {
        throw new Error('Setting season failed')
      }
    })
  }

  static fetchCurrent(): UefaSeason {
    const row = DB.prepare(
      `
      SELECT season_id AS seasonId
      FROM confederation_seasons
      GROUP BY season_id 
      ORDER BY season_id DESC  
    `
    ).get() as UefaSeason
    if (!row) {
      throw new Error('Season not found')
    }
    return this.createFromRow(row)
  }

  public getLeaguePhase(): TeamWithStats[] {
    const rows = DB.prepare(
      `
      SELECT t.id AS id, t.name, t.logo, t.code
      FROM matches AS m
      INNER JOIN teams AS t ON t.id = m.home_id
      WHERE season_id = ?
        AND competition_id = ?
        AND stage = 'LP'
    `
    ).all(this.seasonId, this.competitionId) as Team[]

    if (!rows) {
      throw new Error('Teams for league phase not found')
    }

    const teams = rows.map(row => Team.createFromRow(row))

    const teamsWithStats = teams.map((team: Team) => {
      const stats = team.getGroupStats(this.seasonId)
      return { ...team, ...stats } as TeamWithStats
    })
    return teamsWithStats
  }

  public getMatchesByStage(stage: StageSQL): Match[] {
    const rows = DB.prepare(
      `
      SELECT id, home_id AS homeId, away_id AS awayId, competition_id AS competitionId,
        home_score AS homeScore, away_score AS awayScore, stage, season_id AS seasonId, leg,
        penalties_home AS pensHome, penalties_away AS pensAway, is_overtime AS isOvertime
      FROM matches 
      WHERE season_id = ? 
        AND stage = ?
        AND competition_id = ? 
    `
    ).all(this.seasonId, stage, this.competitionId) as Match[]

    if (!rows) {
      throw new Error(`Matches for stage ${stage} not found`)
    }

    return rows.map(row => Match.createFromRow(row))
  }

  public getCompStatus(): { finished: boolean } {
    const row = DB.prepare(
      `
      SELECT home_score AS homeScore, away_score AS awayScore
      FROM matches
      WHERE competition_id = ?
        AND season_id = ?
        AND stage = 'F'
    `
    ).get(this.competitionId, this.seasonId) as {
      homeScore: number
      awayScore: number
    }

    let finished = false
    if (row && row.homeScore !== null && row.awayScore !== null) {
      finished = true
    }

    return { finished }
  }

  public getSeasonId(): number {
    return this.seasonId
  }

  public setFirstQualStages(): void {
    const competitions = UefaCompetition.fetchAll()

    competitions.forEach((comp: UefaCompetition) => {
      const stage = new Stage(StageSQL.QR1, comp.getId())
      stage.makeDraw()
    })
  }

  // TODO: change ranking type
  public setTemplSpots(ranking: BaseRankNation[]): void {
    const associations = Association.fetchAll()
    associations.forEach((association: Association) => {
      const rank =
        ranking.findIndex((r: BaseRankNation) => r.id === association.getId()) +
        1
      setAssociationSpots(rank, association, this.seasonId)
    })
  }

  public setEpsSpots(): void {
    const topAssociations = Ranking.fetchAssociationRanking(
      this.seasonId - 1,
      1
    ).slice(0, 2)

    topAssociations.forEach((association: Association) => {
      const row = DB.prepare(
        `
        SELECT t.id, t.name, t.logo, t.code, t.confederation_id AS associationId,
          tsu.stage
        FROM teams AS t
        INNER JOIN team_seasons_domestic AS tsd ON tsd.team_id = t.id
        LEFT OUTER JOIN team_seasons_uefa AS tsu ON tsu.team_id = t.id AND tsu.season_id = tsd.season_id + 1
        WHERE t.confederation_id = ?
          AND tsd.season_id = ?
          AND tsu.stage IS NULL
        ORDER BY tsd.league_position ASC
      `
      ).get(association.getId(), this.seasonId - 1) as Team

      if (!row) {
        throw new Error('Setting eps spots failed')
      }

      const nextBestClub = Team.createFromRow(row)

      const rows = DB.prepare(
        `
        SELECT t.id, t.name, t.logo, t.code, t.confederation_id AS associationId,
          stage, competition_id AS competitionId
        FROM team_seasons_uefa AS tsu
        INNER JOIN teams AS t ON t.id = tsu.team_id
        WHERE confederation_id = ?
          AND season_id = ?
        ORDER BY competition_id ASC
      `
      ).all(association.getId(), this.seasonId) as Team[]

      let uefaTeams = rows.map(row => Team.createFromRow(row))

      if (!rows) {
        throw new Error('Setting eps spots failed')
      }

      uefaTeams = sortUefaTeams(
        uefaTeams,
        association.getId(),
        this.seasonId,
        false
      )

      // Moving all the association's teams up in order for the eps spot
      moveTeamsUp(nextBestClub, uefaTeams)

      // If top team was not on UCL league phase
      const topTeam = uefaTeams[0]
      if (
        topTeam.getStage() !== StageSQL.LP &&
        topTeam.getCompetitionId() !== 1
      ) {
        topTeam.setUefaStage(StageSQL.LP, CompetitionCode.UCL)
      }
    })
  }

  public setTitleHolderSpots(): void {
    const uclWinner = UefaCompetition.fetchById(CompetitionCode.UCL).getWinner(
      this.seasonId - 1
    )
    const uelWinner = UefaCompetition.fetchById(CompetitionCode.UEL).getWinner(
      this.seasonId - 1
    )
    const ueclWinner = UefaCompetition.fetchById(
      CompetitionCode.UECL
    ).getWinner(this.seasonId - 1)

    if (uclWinner.hasQualifiedForLP(CompetitionCode.UCL)) {
      const topQualTeam = this.getTopTeamsFromQual(
        CompetitionCode.UCL,
        1,
        true,
        false
      )[0]

      topQualTeam.setCurrentStage()
      const stage = topQualTeam.getStage()!

      topQualTeam.setUefaStage(StageSQL.LP, CompetitionCode.UCL)
      promoteUclChampPath(stage)
    } else {
      uclWinner.setCurrentStage()
      const winnerStage = uclWinner.getStage()

      // If winner is in lower stages
      if (winnerStage !== null) {
        promoteUclUelReplacements(uclWinner, winnerStage, CompetitionCode.UCL)
      }
      uclWinner.setUefaStage(StageSQL.LP, CompetitionCode.UCL)
    }

    if (uelWinner.hasQualifiedForLP(CompetitionCode.UCL)) {
      const topQualTeam = this.getTopTeamsFromQual(
        CompetitionCode.UCL,
        1,
        false,
        false
      )[0]

      topQualTeam.setCurrentStage()
      const stage = topQualTeam.getStage()!

      topQualTeam.setUefaStage(StageSQL.LP, CompetitionCode.UCL)

      if (topQualTeam.isInChampPath()) {
        promoteUclChampPath(stage)
      } else {
        promoteUclLeaguePath(stage)
      }
    } else {
      uelWinner.setCurrentStage()
      const winnerStage = uelWinner.getStage()

      // If winner is in lower stages
      if (winnerStage !== null) {
        promoteUclUelReplacements(uelWinner, winnerStage, CompetitionCode.UEL)
      }
      uelWinner.setUefaStage(StageSQL.LP, CompetitionCode.UCL)
    }

    ueclWinner.setCurrentStage()
    const stage = ueclWinner.getStage()!
    const comp = ueclWinner.getCompetitionId()
    if (
      ueclWinner.hasQualifiedForLP(CompetitionCode.UCL) ||
      ueclWinner.hasQualifiedForLP(CompetitionCode.UEL) ||
      (comp === CompetitionCode.UCL &&
        (stage === StageSQL.QPO || stage === StageSQL.QR3))
    ) {
      promoteUelQual(stage)
    } else {
      handleUeclVacation(ueclWinner)
      ueclWinner.setUefaStage(StageSQL.LP, CompetitionCode.UEL)
    }
  }

  // TODO: combine with below
  public getTopTeamsFromQual(
    competitionId: CompetitionCode,
    amount: number,
    isChampPath: boolean,
    isLeaguePath: boolean
  ): Team[] {
    const rows = DB.prepare(
      `
      SELECT t.id, t.name, t.logo, t.code, t.confederation_id AS associationId,
        stage
      FROM team_seasons_uefa AS tsu
      INNER JOIN teams AS t ON t.id = tsu.team_id
      WHERE season_id = ?
        AND competition_id = ?
        AND stage IN ('QPO', 'QR3', 'QR2', 'QR1')
    `
    ).all(this.seasonId, competitionId) as Team[]

    if (!rows) {
      throw new Error('Could not get top qual teams')
    }

    let qualTeams = rows.map(row => Team.createFromRow(row))
    const ranking = Ranking.fetchClubRanking(this.seasonId, 5)

    qualTeams = qualTeams.sort((a: Team, b: Team) => {
      //const indexA = ranking.findIndex(r => r.getId() === a.getId())
      //const indexB = ranking.findIndex(r => r.getId() === b.getId())

      // TODO: fix to real ranking
      const indexA = a.getAssociation().getId()
      const indexB = b.getAssociation().getId()

      return indexA - indexB
    })

    if (isChampPath) {
      qualTeams = qualTeams.filter((team: Team) => team.isInChampPath())
    }

    if (isLeaguePath) {
      qualTeams = qualTeams.filter((team: Team) => !team.isInChampPath())
    }

    return qualTeams.slice(0, amount)
  }

  // TODO: combine with above
  public getTopTeamsFromStage(
    competitionId: CompetitionCode,
    stage: StageSQL,
    amount: number,
    isChampPath: boolean,
    isLeaguePath: boolean
  ): Team[] {
    const rows = DB.prepare(
      `
      SELECT t.id, t.name, t.logo, t.code, t.confederation_id AS associationId,
        stage
      FROM team_seasons_uefa AS tsu
      INNER JOIN teams AS t ON t.id = tsu.team_id
      WHERE season_id = ?
        AND competition_id = ?
        AND stage = ?
    `
    ).all(this.seasonId, competitionId, stage) as Team[]

    if (!rows) {
      throw new Error(`Could not get top teams from stage ${stage}`)
    }

    let qualTeams = rows.map(row => Team.createFromRow(row))
    const ranking = Ranking.fetchClubRanking(this.seasonId, 5)

    qualTeams = qualTeams.sort((a: Team, b: Team) => {
      //const indexA = ranking.findIndex(r => r.getId() === a.getId())
      //const indexB = ranking.findIndex(r => r.getId() === b.getId())

      // TODO: fix to real ranking
      const indexA = a.getAssociation().getId()
      const indexB = b.getAssociation().getId()
      return indexA - indexB
    })

    if (isChampPath) {
      qualTeams = qualTeams.filter((team: Team) => team.isInChampPath())
    }

    if (isLeaguePath) {
      qualTeams = qualTeams.filter((team: Team) => !team.isInChampPath())
    }

    return qualTeams.slice(0, amount)
  }

  public getNationsToPromote(
    stage: StageSQL,
    competitionId: CompetitionCode,
    amount: number
  ): Association[] {
    const rows = DB.prepare(
      `
      SELECT confederation_id AS id, COUNT(t.id) AS teams
      FROM team_seasons_uefa AS tsu
      INNER JOIN teams AS t ON tsu.team_id = t.id
      WHERE season_id = ?
        AND competition_id = ?
        AND stage = ?
      GROUP BY confederation_id
      ORDER BY teams DESC
    `
    ).all(this.seasonId, competitionId, stage) as Association[]

    let nations = rows.map(row => Association.createFromRow(row))

    // TODO: change to actual ranking
    const rankingList = baseRanking

    nations = nations.sort((a: Association, b: Association) => {
      const rankA = rankingList.findIndex(
        (nation: BaseRankNation) => nation.id === a.getId()
      )
      const rankB = rankingList.findIndex(
        (nation: BaseRankNation) => nation.id === b.getId()
      )
      return rankA - rankB
    })
    return nations.slice(0, amount)
  }
}
