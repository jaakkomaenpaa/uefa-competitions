import { useEffect, useState } from 'react'
import rankingService from '../../services/rankings'
import seasonService from '../../services/seasons'
import { Association, Season } from '../../types'
import styles from './Rankings.module.css'
import { getImageUrl } from '../../services/proxy'

const NationRanking = () => {
  const [rankSeason, setRankSeason] = useState<number>()
  const [seasons, setSeasons] = useState<Season[]>([])
  const [rankYears, setRankYears] = useState<number>(5)
  const [nations, setNations] = useState<Association[]>([])

  useEffect(() => {
    const getData = async () => {
      const currentSeason = await seasonService.getCurrentSeason()
      setRankSeason(currentSeason.id)
      const seasonData = await seasonService.getAllSeasons()
      setSeasons(seasonData)
      const nationData = await rankingService.getAssociationCoefficients(
        currentSeason.id,
        5
      )
      setNations(nationData)
    }
    getData()
  }, [])

  useEffect(() => {
    const getRanking = async () => {
      if (!rankSeason || !rankYears) {
        return
      }
      const nationData = await rankingService.getAssociationCoefficients(
        rankSeason,
        rankYears
      )
      setNations(nationData)
    }
    getRanking()
  }, [rankSeason, rankYears])

  return (
    <div>
      <div className={styles.selectContainer}>
        Season
        <select
          name='from-season'
          className={styles.select}
          value={rankSeason}
          onChange={e => setRankSeason(parseInt(e.target.value))}
        >
          {seasons.map((season: Season) => (
            <option className={styles.option} key={season.id} value={season.id}>
              {`${season.startYear}/${season.endYear}`}
            </option>
          ))}
        </select>
        Years
        <select
          name='rank-years'
          className={styles.select}
          value={rankYears}
          onChange={e => setRankYears(parseInt(e.target.value))}
        >
          {seasons.map((season: Season, index: number) => (
            <option className={styles.option} key={season.id} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </div>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <th className={styles.th}>Rank</th>
            <th className={styles.th}>Flag</th>
            <th className={styles.th}>Association</th>
            <th className={styles.th}>Points</th>
          </tr>
        </thead>
        <tbody>
          {nations.map((nation: Association, index: number) => {
            const rank = index + 1
            return (
              <tr key={nation.id} className={styles.tr}>
                <td className={styles.td}>{rank}</td>
                <td className={styles.td}>
                  <img
                    className={styles.flag}
                    src={getImageUrl(nation.flag)}
                    alt='flag'
                  />
                </td>
                <td className={styles.td}>{nation.name}</td>
                <td className={styles.td}>{nation.coeffPoints?.toFixed(3)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default NationRanking
