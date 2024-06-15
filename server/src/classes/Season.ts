import { DB } from '../utils/config'

export default class Season {
  constructor(
    private id: number,
    private startYear: number,
    private endYear: number
  ) {}

  public static createFromRow(row: any): Season {
    return new Season(row.id, row.startYear, row.endYear)
  }

  static fetchAll(): Season[] {
    const rows = DB.prepare(
      `
      SELECT id, start_year AS startYear, end_year AS endYear
      FROM seasons  
    `
    ).all() as Season[]
    if (!rows) {
      throw new Error('Seasons not found')
    }
    return rows.map(row => this.createFromRow(row))
  }

  static fetchById(id: number): Season {
    const row = DB.prepare(
      `
      SELECT id, start_year AS startYear, end_year AS endYear
      FROM seasons
      WHERE id = ?  
    `
    ).get(id) as Season
    if (!row) {
      throw new Error('Season not found')
    }
    return this.createFromRow(row)
  }

  static fetchCurrent(): Season {
    const row = DB.prepare(
      `
      SELECT id, start_year AS startYear, end_year AS endYear
      FROM seasons
      ORDER BY start_year DESC
    `
    ).get() as Season
    if (!row) {
      throw new Error('Season not found')
    }
    return this.createFromRow(row)
  }

  static setNext(): Season {
    const current = this.fetchCurrent()
    const nextStartYear = current.startYear + 1
    const nextEndYear = current.endYear + 1

    const insert = DB.prepare(
      `
      INSERT INTO seasons (start_year, end_year)
      VALUES (?, ?)
    `
    ).run(nextStartYear, nextEndYear)

    if (insert.changes === 0) {
      throw new Error('Setting next season failed')
    }
    return this.fetchCurrent()
  }

  public getId(): number {
    return this.id
  }

  public getStartYear(): number {
    return this.startYear
  }

  public getEndYear(): number {
    return this.endYear
  }

  public getSeasonString(): string {
    return `${this.startYear}/${this.endYear}`
  }
}
