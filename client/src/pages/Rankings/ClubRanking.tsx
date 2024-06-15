import { useEffect, useState } from 'react'
import rankingService from '../../services/rankings'
import seasonService from '../../services/seasons'
import { Season, Team } from '../../types'
import styles from './Rankings.module.css'
import { getImageUrl } from '../../services/proxy'

const ClubRanking = () => {
  const [rankSeason, setRankSeason] = useState<number>()
  const [seasons, setSeasons] = useState<Season[]>([])
  const [rankYears, setRankYears] = useState<number>(5)
  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => {
    const getData = async () => {
      const currentSeason = await seasonService.getCurrentSeason()
      setRankSeason(currentSeason.id)
      const seasonData = await seasonService.getAllSeasons()
      setSeasons(seasonData)
      const teamData = await rankingService.getClubCoefficients(
        currentSeason.id,
        5
      )
      setTeams(teamData)
    }
    getData()
  }, [])

  useEffect(() => {
    const getRanking = async () => {
      if (!rankSeason || !rankYears) {
        return
      }
      const teamData = await rankingService.getClubCoefficients(
        rankSeason,
        rankYears
      )
      setTeams(teamData)
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
            <th className={styles.th}>Logo</th>
            <th className={styles.th}>Club</th>
            <th className={styles.th}>Points</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team: Team, index: number) => {
            const rank = index + 1
            return (
              <tr key={team.id} className={styles.tr}>
                <td className={styles.td}>{rank}</td>
                <td className={styles.td}>
                  <img
                    className={styles.logo}
                    src={getImageUrl(team.logo)}
                    alt='logo'
                  />
                </td>
                <td className={styles.td}>{team.name}</td>
                <td className={styles.td}>{team.coeffPoints?.toFixed(3)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ClubRanking
