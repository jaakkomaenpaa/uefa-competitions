import { Team, TeamStats } from '../../types'
import styles from './LeagueTable.module.css'

interface LeagueTableProps {
  teams: TeamStats[]
}

const LeagueTable = ({ teams }: LeagueTableProps) => {
  if (teams.length === 0) {
    return (
      <div className={styles.container}>League phase not yet initialized</div>
    )
  }

  teams.sort((a: TeamStats, b: TeamStats) => {
    const aGD = a.goalsFor - a.goalsAgainst
    const bGD = b.goalsFor - b.goalsAgainst
    if (a.points !== b.points) {
      return b.points - a.points
    } else if (aGD !== bGD) {
      return bGD - aGD
    } else {
      return b.goalsFor - a.goalsFor
    }
  })

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <th className={styles.th}>Rank</th>
            <th className={styles.th}>Logo</th>
            <th className={styles.th}>Club</th>
            <th className={styles.th}>Played</th>
            <th className={styles.th}>Won</th>
            <th className={styles.th}>Drawn</th>
            <th className={styles.th}>Lost</th>
            <th className={styles.th}>GF</th>
            <th className={styles.th}>GA</th>
            <th className={styles.th}>+/-</th>
            <th className={styles.th}>Points</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team: Team, index: number) => {
            const rank = index + 1
            if (!team.goalsFor || !team.goalsAgainst) {
              team.goalsFor = 0
              team.goalsAgainst = 0
            }
            return (
              <tr key={team.id} className={styles.tr}>
                <td className={styles.td}>{rank}</td>
                <td className={styles.td}>
                  <img className={styles.img} src={team.logo} alt='logo' />
                </td>
                <td className={styles.td}>{team.name}</td>
                <td className={styles.td}>{team.played}</td>
                <td className={styles.td}>{team.won}</td>
                <td className={styles.td}>{team.drawn}</td>
                <td className={styles.td}>{team.lost}</td>
                <td className={styles.td}>{team.goalsFor}</td>
                <td className={styles.td}>{team.goalsAgainst}</td>
                <td className={styles.td}>
                  {team.goalDifference}
                </td>
                <td className={styles.td}>{team.points}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default LeagueTable
