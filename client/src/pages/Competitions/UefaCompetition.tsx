import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import uefaSeasonService from '../../services/uefaSeasons'
import compService from '../../services/competitions'
import { TeamStats, Competition } from '../../types'
import LeagueTable from '../../components/LeagueTable'
import { MatchView } from '../../components/MatchView'
import styles from './Competitions.module.css'

const UefaCompetition = () => {
  const { seasonId, compId } = useParams()
  const [teams, setTeams] = useState<TeamStats[]>([])
  const [page, setPage] = useState<number>(1)
  const [competition, setCompetition] = useState<Competition>()

  useEffect(() => {
    const getData = async () => {
      if (seasonId && compId) {
        const teamData = await uefaSeasonService.getLeagueTeamsByUefaSeason(
          seasonId,
          compId
        )
        setTeams(teamData)
        const compData = await compService.getCompById(compId)
        setCompetition(compData)
      }
    }
    getData()
  }, [seasonId, compId])

  if (!competition) return <div>Loading...</div>

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>{competition.name}</h2>
      <div className={styles.buttonContainer}>
        <button
          onClick={() => setPage(1)}
          className={`${styles.pageButton} ${
            page === 1 ? styles.selected : ''
          }`}
        >
          Matches
        </button>
        <button
          onClick={() => setPage(2)}
          className={`${styles.pageButton} ${
            page === 2 ? styles.selected : ''
          }`}
        >
          Table
        </button>
      </div>
      {page === 1 ? <MatchView />: <LeagueTable teams={teams} /> }
    </div>
  )
}

export default UefaCompetition
