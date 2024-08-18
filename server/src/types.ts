import Team from './classes/Team'

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
  F = 'F',
}

export enum CompetitionCode {
  UCL = 1,
  UEL = 2,
  UECL = 3,
}

export enum TournamentPhase {
  Qualifying = 'Q',
  League = 'L',
  Knockout = 'KO',
}

export interface TeamWithStats extends Team {
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
}

export interface TeamWithAssociation extends Team {
  associationFlag: string
  associationCode: string
  associationName: string
}

export interface TeamGroupStats {
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
}

export interface BaseRankNation {
  id: number
  coeffPoints?: number
}

export interface Aggregate {
  homeAggregate: number
  awayAggregate: number
  homePens: number | null
  awayPens: number | null
}