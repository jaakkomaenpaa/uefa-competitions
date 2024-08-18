export interface Season {
  id: number
  startYear: number
  endYear: number
}

export interface Team {
  id: number | string
  name: string
  logo: string
  code: string
  competition?: CompetitionCode
  coeffPoints?: number
  points?: number
  associationId?: number
  played?: number,
  won?: number,
  drawn?: number,
  lost?: number,
  goalsFor?: number,
  goalsAgainst?: number
  goalDifference?: number
  leaguePosition?: number
  isCupWinner?: boolean
}

export interface TeamWithAssociation extends Team {
  associationFlag: string
  associationCode: string
  associationName: string
}

export interface TeamStats {
  id: number | string
  name: string
  logo: string
  code: string
  played: number,
  won: number,
  drawn: number,
  lost: number,
  goalsFor: number,
  goalsAgainst: number
  goalDifference: number
  points: number
}

export interface Association {
  id: number
  name: string
  code: string
  flag: string
  coeffPoints?: number
  leagueName?: string
  cupName?: string
  seasonFinished?: boolean
}

export interface ConfederationSeason {
  confederation: Association | number
  season: Season | number
  points: number
}

export interface TeamSeason {
  teamId: string | number
  team?: Team
  seasonId: string | number
  uefaCompetition: Competition | number
  leaguePosition: number | null,
  isCupWinner: boolean
  points: number
}

export interface Competition {
  id: number
  name: string
  groups?: number
  teams?: number
}

export enum CompetitionCode {
  UCL = 'UCL',
  UEL = 'UEL',
  UECL = 'UECL',
}

export interface TeamMatch {
  teamId: number
  teamScore: number
  oppScore: number
  stage?: StageSQL | StageClient
  seasonId?: number
  leg?: number
}

export interface Match {
  id: number
  homeId: number
  homeTeam?: string
  homeLogo?: string
  homeScore?: number
  awayId: number
  awayTeam?: string
  awayLogo?: string
  awayScore?: number
  stage?: StageSQL
  seasonId?: number
  isOvertime?: boolean
  pensHome?: number
  pensAway?: number
  competitionId?: number
  leg?: number
}

export interface MatchTemplate {
  homeId: number
  awayId: number
  competitionId: number
  stage: StageSQL
  leg: number
  seasonId: number
}

export interface MatchScore {
  id: number
  homeId: number
  homeScore: number
  awayId: number
  awayScore: number
  isOvertime: boolean
  pensHome?: number
  pensAway?: number
  stage: StageSQL
}

export enum StageSQL {
  QR1 = 'QR1',
  QR2 = 'QR2',
  QR3 = 'QR3',
  QPO = 'QPO',
  LP = 'LP',
  KPO = 'KPO',
  R16 = 'R16',
  QF = 'QF',
  SF = 'SF',
  F = 'F'
}

export enum StageClient {
  QR1 = 'Round 1',
  QR2 = 'Round 2',
  QR3 = 'Round 3',
  QPO = 'Play-offs',
  LP = 'League phase',
  KPO = 'KO Play-offs',
  R16 = 'Round of 16',
  QF = 'Quarter-finals',
  SF = 'Semi-finals',
  F = 'Final'
}

export interface Ranking {
  seasonId: string | number
  seasons: number
}
