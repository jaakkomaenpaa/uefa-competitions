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
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [competition, setCompetition] = useState<Competition>()

  useEffect(() => {
    const getPage = () =>{
      const page = window.localStorage.getItem(`page-comp-${compId}`)
      if (page) {
        setCurrentPage(parseInt(page))
      }
    }

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
    getPage()
    getData()
  }, [seasonId, compId])

  if (!competition) return <div>Loading...</div>

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.localStorage.setItem(`page-comp-${compId}`, page.toString())
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>{competition.name}</h2>
      <div className={styles.buttonContainer}>
        <button
          onClick={() => handlePageChange(1)}
          className={`${styles.pageButton} ${
            currentPage === 1 ? styles.selected : ''
          }`}
        >
          Matches
        </button>
        <button
          onClick={() => handlePageChange(2)}
          className={`${styles.pageButton} ${
            currentPage === 2 ? styles.selected : ''
          }`}
        >
          Table
        </button>
      </div>
      {currentPage === 1 ? <MatchView />: <LeagueTable teams={teams} /> }
    </div>
  )
}

export default UefaCompetition
