import Team from '../classes/Team'
import { CompetitionCode, StageSQL } from '../types'

type TeamCount = number | [number, number]

export const TEAMS_BY_STAGE: Record<
  CompetitionCode,
  Record<StageSQL, number>
> = {
  [CompetitionCode.UCL]: {
    [StageSQL.QR1]: 0,
    [StageSQL.QR2]: 0,
    [StageSQL.QR3]: 0,
    [StageSQL.QPO]: 0,
    [StageSQL.LP]: 36,
    [StageSQL.KPO]: 16,
    [StageSQL.R16]: 16,
    [StageSQL.QF]: 8,
    [StageSQL.SF]: 4,
    [StageSQL.F]: 2,
  },
  [CompetitionCode.UEL]: {
    [StageSQL.QR1]: 0,
    [StageSQL.QR2]: 0,
    [StageSQL.QR3]: 0,
    [StageSQL.QPO]: 0,
    [StageSQL.LP]: 36,
    [StageSQL.KPO]: 16,
    [StageSQL.R16]: 16,
    [StageSQL.QF]: 8,
    [StageSQL.SF]: 4,
    [StageSQL.F]: 2,
  },
  [CompetitionCode.UECL]: {
    [StageSQL.QR1]: 0,
    [StageSQL.QR2]: 0,
    [StageSQL.QR3]: 0,
    [StageSQL.QPO]: 0,
    [StageSQL.LP]: 36,
    [StageSQL.KPO]: 16,
    [StageSQL.R16]: 16,
    [StageSQL.QF]: 8,
    [StageSQL.SF]: 4,
    [StageSQL.F]: 2,
  },
}

export const SEEDED_R16_TEAMS = 8

export const HAS_STAGE_TWO_PATHS = {
  [CompetitionCode.UCL]: {
    [StageSQL.QR1]: false,
    [StageSQL.QR2]: true,
    [StageSQL.QR3]: true,
    [StageSQL.QPO]: true,
    [StageSQL.LP]: false,
    [StageSQL.KPO]: false,
    [StageSQL.R16]: false,
    [StageSQL.QF]: false,
    [StageSQL.SF]: false,
    [StageSQL.F]: false,
  },
  [CompetitionCode.UEL]: {
    [StageSQL.QR1]: false,
    [StageSQL.QR2]: false,
    [StageSQL.QR3]: true,
    [StageSQL.QPO]: false,
    [StageSQL.LP]: false,
    [StageSQL.KPO]: false,
    [StageSQL.R16]: false,
    [StageSQL.QF]: false,
    [StageSQL.SF]: false,
    [StageSQL.F]: false,
  },
  [CompetitionCode.UECL]: {
    [StageSQL.QR1]: false,
    [StageSQL.QR2]: true,
    [StageSQL.QR3]: true,
    [StageSQL.QPO]: true,
    [StageSQL.LP]: false,
    [StageSQL.KPO]: false,
    [StageSQL.R16]: false,
    [StageSQL.QF]: false,
    [StageSQL.SF]: false,
    [StageSQL.F]: false,
  },
}

type DemotionFunction = (team: Team) => {
  competitionId: CompetitionCode
  stage: StageSQL
}

type DemotionConfig =
  | {
      competitionId: CompetitionCode
      stage: StageSQL
    }
  | DemotionFunction

type StageDemotions = {
  [key in CompetitionCode]?: {
    [key in StageSQL]?: DemotionConfig
  }
}

export const STAGE_DEMOTIONS: StageDemotions = {
  [CompetitionCode.UCL]: {
    [StageSQL.QPO]: {
      competitionId: CompetitionCode.UEL,
      stage: StageSQL.LP,
    },
    [StageSQL.QR3]: (team: Team) => {
      const demotionStage = team.isInChampPath() ? StageSQL.QPO : StageSQL.LP
      return {
        competitionId: CompetitionCode.UEL,
        stage: demotionStage,
      }
    },
    [StageSQL.QR2]: {
      competitionId: CompetitionCode.UEL,
      stage: StageSQL.QR3,
    },
    [StageSQL.QR1]: {
      competitionId: CompetitionCode.UECL,
      stage: StageSQL.QR2,
    },
  },
  [CompetitionCode.UEL]: {
    [StageSQL.QPO]: {
      competitionId: CompetitionCode.UECL,
      stage: StageSQL.LP,
    },
    [StageSQL.QR3]: {
      competitionId: CompetitionCode.UECL,
      stage: StageSQL.QPO,
    },
    [StageSQL.QR2]: {
      competitionId: CompetitionCode.UECL,
      stage: StageSQL.QR3,
    },
    [StageSQL.QR1]: {
      competitionId: CompetitionCode.UECL,
      stage: StageSQL.QR2,
    },
  },
}

export const STAGE_VALUES: Record<StageSQL, number> = {
  [StageSQL.F]: 1,
  [StageSQL.SF]: 2,
  [StageSQL.QF]: 3,
  [StageSQL.R16]: 4,
  [StageSQL.KPO]: 5,
  [StageSQL.LP]: 6,
  [StageSQL.QPO]: 7,
  [StageSQL.QR3]: 8,
  [StageSQL.QR2]: 9,
  [StageSQL.QR1]: 10,
}

export const ASSOCIATION_RANKING_DELAY = 2
export const EPS_SPOT_RANKING_DELAY = 1
export const CLUB_RANKING_DELAY = 1

// TODO: Add promotion rules