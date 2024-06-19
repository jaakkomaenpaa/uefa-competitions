import Association from '../classes/Association'
import Team from '../classes/Team'
import UefaSeason from '../classes/UefaSeason'
import { STAGE_VALUES } from '../rules/general'
import { CompetitionCode, StageSQL } from '../types'
import { DB } from './config'
import { moveTeamsUp, sortUefaTeams } from './helpers'

export const promoteUclChampPath = (stage: StageSQL): void => {
  const season = UefaSeason.fetchCurrent()

  if (STAGE_VALUES[stage] <= STAGE_VALUES[StageSQL.QPO]) {
    const topR2team = season.getTopTeamsFromStage(
      CompetitionCode.UCL,
      StageSQL.QR2,
      1,
      true,
      false
    )[0]
    topR2team.setUefaStage(StageSQL.QPO, CompetitionCode.UCL)
  }

  if (STAGE_VALUES[stage] <= STAGE_VALUES[StageSQL.QR2]) {
    const topR1teams = season.getTopTeamsFromStage(
      CompetitionCode.UCL,
      StageSQL.QR1,
      2,
      true,
      false
    )
    topR1teams[0].setUefaStage(StageSQL.QR2, CompetitionCode.UCL)
    topR1teams[1].setUefaStage(StageSQL.QR2, CompetitionCode.UCL)
  }

  if (stage === StageSQL.QR1) {
    const topR1team = season.getTopTeamsFromStage(
      CompetitionCode.UCL,
      StageSQL.QR1,
      1,
      true,
      false
    )[0]
    topR1team.setUefaStage(StageSQL.QR2, CompetitionCode.UCL)
  }
}

export const promoteUclLeaguePath = (stage: StageSQL): void => {
  const season = UefaSeason.fetchCurrent()

  if (stage === StageSQL.QR3) {
    const topR2teams = season.getTopTeamsFromStage(
      CompetitionCode.UCL,
      StageSQL.QR2,
      2,
      false,
      true
    )
    topR2teams[0].setUefaStage(StageSQL.QR3, CompetitionCode.UCL)
    topR2teams[1].setUefaStage(StageSQL.QR3, CompetitionCode.UCL)
  } else if (stage === StageSQL.QR2) {
    const topR2team = season.getTopTeamsFromStage(
      CompetitionCode.UCL,
      StageSQL.QR2,
      1,
      false,
      true
    )[0]
    topR2team.setUefaStage(StageSQL.QR3, CompetitionCode.UCL)
  }

  promoteUelR1()
}

const promoteUelR1 = (): void => {
  const season = UefaSeason.fetchCurrent()

  const query = DB.prepare(`
    SELECT team_id AS id
    FROM team_seasons_uefa AS tsu
    INNER JOIN teams AS t ON  tsu.team_id = t.id
    WHERE confederation_id = ?
      AND competition_id = ?  
      AND stage = ?
  `)

  const nationsToPromote = season.getNationsToPromote(
    StageSQL.QR1,
    CompetitionCode.UEL,
    4
  )
  nationsToPromote.forEach((nation: Association) => {
    const row = query.get(nation.getId(), CompetitionCode.UEL, StageSQL.QR1)
    const teamToPromote = Team.createFromRow(row)
    teamToPromote.setUefaStage(StageSQL.QR2, CompetitionCode.UEL)
  })
}

export const promoteUelQual = (stage: StageSQL): void => {
  const season = UefaSeason.fetchCurrent()

  const query = DB.prepare(`
    SELECT tsu.team_id AS id
    FROM team_seasons_uefa AS tsu
    INNER JOIN team_seasons_domestic AS tsd ON tsu.team_id = tsd.team_id AND tsu.season_id = tsd.season_id + 1
    WHERE confederation_id = ?
      AND competition_id = ?  
      AND stage = ?
    ORDER BY is_cup_winner DESC, league_position ASC
  `)

  if (STAGE_VALUES[stage] <= STAGE_VALUES[StageSQL.LP]) {
    const nationToPromote = season.getNationsToPromote(
      StageSQL.QPO,
      CompetitionCode.UEL,
      1
    )[0]
    const row = query.get(
      nationToPromote.getId(),
      CompetitionCode.UEL,
      StageSQL.QPO
    )
    const teamToPromote = Team.createFromRow(row)
    teamToPromote.setUefaStage(StageSQL.LP, CompetitionCode.UEL)

    if (STAGE_VALUES[stage] <= STAGE_VALUES[StageSQL.QPO]) {
      const nationToPromote = season.getNationsToPromote(
        StageSQL.QR3,
        CompetitionCode.UEL,
        1
      )[0]

      const row = query.get(
        nationToPromote.getId(),
        CompetitionCode.UEL,
        StageSQL.QR3
      )
      const teamToPromote = Team.createFromRow(row)
      teamToPromote.setUefaStage(StageSQL.QPO, CompetitionCode.UEL)
    }

    if (STAGE_VALUES[stage] <= STAGE_VALUES[StageSQL.QR3]) {
      const originalNation = Association.fetchByRank(16, season.getSeasonId())
      const row = query.get(
        originalNation.getId(),
        CompetitionCode.UEL,
        StageSQL.QR2
      )

      if (row) {
        const originalTeam = Team.createFromRow(row)
        originalTeam.setUefaStage(StageSQL.QR3, CompetitionCode.UEL)
      } else {
        const nationToPromote = season.getNationsToPromote(
          StageSQL.QR2,
          CompetitionCode.UEL,
          1
        )[0]

        const row = query.get(
          nationToPromote.getId(),
          CompetitionCode.UEL,
          StageSQL.QR2
        )
        const teamToPromote = Team.createFromRow(row)
        teamToPromote.setUefaStage(StageSQL.QR3, CompetitionCode.UEL)
      }
    }

    if (STAGE_VALUES[stage] <= STAGE_VALUES[StageSQL.QR2]) {
      const R1nations = season.getNationsToPromote(
        StageSQL.QR1,
        CompetitionCode.UEL,
        2
      )
      R1nations.forEach((nation: Association) => {
        const row = query.get(nation.getId(), CompetitionCode.UEL, StageSQL.QR1)
        const teamToPromote = Team.createFromRow(row)
        teamToPromote.setUefaStage(StageSQL.QR2, CompetitionCode.UEL)
      })
    }
  }

  if (stage === StageSQL.QR1) {
    const nationToPromote = season.getNationsToPromote(
      StageSQL.QR1,
      CompetitionCode.UEL,
      1
    )[0]

    const row = query.get(
      nationToPromote.getId(),
      CompetitionCode.UEL,
      StageSQL.QR1
    )
    const teamToPromote = Team.createFromRow(row)
    teamToPromote.setUefaStage(StageSQL.QR2, CompetitionCode.UEL)
  }

  const ueclNationsToPromote = season.getNationsToPromote(
    StageSQL.QR1,
    CompetitionCode.UECL,
    2
  )

  ueclNationsToPromote.forEach((nation: Association) => {
    const row = query.get(nation.getId(), CompetitionCode.UECL, StageSQL.QR1)
    const teamToPromote = Team.createFromRow(row)
    teamToPromote.setUefaStage(StageSQL.QR2, CompetitionCode.UECL)
  })
}

export const handleUeclVacation = (ueclWinner: Team) => {
  const season = UefaSeason.fetchCurrent()
  const ueclWinnerNation = ueclWinner.getAssociation()
  ueclWinner.setCurrentStage()

  if (
    ueclWinner.getCompetitionId() === CompetitionCode.UCL ||
    ueclWinner.getCompetitionId() === CompetitionCode.UEL
  ) {
    let uefaTeams = ueclWinnerNation.getUefaTeams(season.getSeasonId())
    // Might be unnecessary here
    uefaTeams = sortUefaTeams(
      uefaTeams,
      ueclWinnerNation.getId(),
      season.getSeasonId(),
      true
    )

    const index = uefaTeams.findIndex(
      (team: Team) => team.getId() === ueclWinner.getId()
    )
    uefaTeams = uefaTeams.slice(index)

    if (uefaTeams.length < 2) {
      return
    }

    const lastTeam = uefaTeams[uefaTeams.length - 1]
    lastTeam.setCurrentStage()
    const stageToPromote = lastTeam.getStage()!

    moveTeamsUp(lastTeam, uefaTeams)

    promoteUeclQual(stageToPromote)
  } else if (ueclWinner.getCompetitionId() === CompetitionCode.UECL) {
    promoteUeclQual(ueclWinner.getStage()!)
  } else if (ueclWinner.getCompetitionId() === null) {
    const row = DB.prepare(
      `
      SELECT t.id, t.name, t.logo, t.code, t.confederation_id AS associationId, tsu.stage
      FROM team_seasons_uefa AS tsu
      INNER JOIN teams AS t ON tsu.team_id = t.id
      INNER JOIN team_seasons_domestic AS tsd ON tsu.team_id = tsd.team_id AND tsu.season_id = tsd.season_id + 1
      WHERE t.confederation_id = ?
        AND tsu.season_id = ?
        AND tsu.competition_id = 3
        AND tsu.stage IN ('QPO', 'QR3', 'QR2', 'QR1')
      ORDER BY is_cup_winner DESC league_position DESC
    `
    ).get(ueclWinnerNation.getId(), season.getSeasonId())

    const teamToVacate = Team.createFromRow(row)
    const stage = teamToVacate.getStage()

    if (stage === null) {
      return
    }

    const vacate = DB.prepare(`
      DELETE FROM team_seasons_uefa
      WHERE team_id = ?
    `)
    vacate.run(teamToVacate.getId())
    promoteUeclQual(stage)
  }
}

export const promoteUeclQual = (stage: StageSQL) => {
  const season = UefaSeason.fetchCurrent()

  const query = DB.prepare(`
    SELECT t.id, t.name, t.logo, t.code, t.confederation_id AS associationId
    FROM team_seasons_uefa AS tsu
    INNER JOIN team_seasons_domestic AS tsd ON tsu.team_id = tsd.team_id AND tsu.season_id = tsd.season_id + 1
    INNER JOIN teams AS t ON t.id = tsu.team_id
    WHERE tsd.confederation_id = ?
      AND competition_id = ?  
      AND stage = ?
    ORDER BY is_cup_winner DESC, league_position ASC
  `)

  const nationsToPromote = season.getNationsToPromote(
    StageSQL.QR1,
    CompetitionCode.UECL,
    2
  )

  if (STAGE_VALUES[stage] <= STAGE_VALUES[StageSQL.QPO]) {
    // TODO: Investigate if it is actually the team with highest coefficient or what
    const topR2team = season.getTopTeamsFromStage(
      CompetitionCode.UECL,
      StageSQL.QR2,
      1,
      false,
      true
    )[0]
    topR2team.setUefaStage(StageSQL.QPO, CompetitionCode.UECL)
  } else if (STAGE_VALUES[stage] <= STAGE_VALUES[StageSQL.QR2]) {
    nationsToPromote.forEach((nation: Association) => {
      const row = query.get(nation.getId(), CompetitionCode.UECL, StageSQL.QR1)
      const teamToPromote = Team.createFromRow(row)
      teamToPromote.setUefaStage(StageSQL.QR2, CompetitionCode.UECL)
    })
  } else if (stage === StageSQL.QR1) {
    const nation = nationsToPromote[0]
    const row = query.get(nation.getId(), CompetitionCode.UECL, StageSQL.QR1)
    const teamToPromote = Team.createFromRow(row)
    teamToPromote.setUefaStage(StageSQL.QR2, CompetitionCode.UECL)
  }
}

export const promoteUclUelReplacements = (
  team: Team,
  stage: StageSQL,
  competitionId: CompetitionCode
) => {
  if (Number(competitionId) === CompetitionCode.UCL) {
    if (team.isInChampPath()) {
      promoteUclChampPath(stage)
    } else {
      promoteUclLeaguePath(stage)
    }
  } else if (Number(competitionId) === CompetitionCode.UEL) {
    promoteUelQual(stage)
  } else if (Number(competitionId) === CompetitionCode.UECL) {
    promoteUeclQual(stage)
  }
}
