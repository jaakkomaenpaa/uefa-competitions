import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import LeagueDnd from '../../components/LeagueDnd'
import DomCupSelect from '../../components/DomCupSelect'
import { Team, Season, Association } from '../../types'
import domSeasonService from '../../services/domSeasons'
import seasonService from '../../services/seasons'
import nationService from '../../services/nations'
import styles from './Leagues.module.css'

const NationPage = () => {
  const { seasonId, nationId } = useParams<{
    seasonId: string
    nationId: string
  }>()
  const [teams, setTeams] = useState<Team[]>([])
  const [season, setSeason] = useState<Season>()
  const [nation, setNation] = useState<Association>()
  const [cupWinner, setCupWinner] = useState<Team | null>(null)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)

  useEffect(() => {
    const getData = async () => {
      if (seasonId && nationId) {
        const leagueData = await domSeasonService.getTeamsByDomSeason(
          seasonId,
          nationId
        )
        setTeams(leagueData)

        if (leagueData.length === 0) return

        if (leagueData[0].leaguePosition > 0) {
          setIsDisabled(true)
          const winner = leagueData.filter((team: Team) => team.isCupWinner)
          setCupWinner(winner[0])
        }

        const seasonData = await seasonService.getSeasonById(seasonId)
        setSeason(seasonData)
        const nationData = await nationService.getNationById(nationId)
        setNation(nationData)
      }
    }
    getData()
  }, [seasonId, nationId])

  const submit = async () => {
    if (!cupWinner || !seasonId || !nationId) return
    await domSeasonService.postDomSeasonResults(
      seasonId,
      nationId,
      teams,
      cupWinner
    )
    window.location.reload()
  }

  if (!nation || !season || teams.length === 0) return <div>Loading...</div>

  return (
    <div className={styles.nationPageContainer}>
      <h2>
        {nation.name} season {season?.startYear}/{season?.endYear}
      </h2>
      <div className={styles.content}>
        {nation.leagueName && (
          <LeagueDnd
            teams={teams}
            nation={nation}
            setTeams={setTeams}
            disabled={isDisabled}
          />
        )}
        <div className={styles.rightColumn}>
          <DomCupSelect
            teams={teams}
            nation={nation}
            cupWinner={cupWinner}
            setCupWinner={setCupWinner}
            disabled={isDisabled}
          />
          <button
            disabled={isDisabled}
            onClick={submit}
            className={`${styles.saveButton} ${
              isDisabled ? styles.disabled : ''
            }`}
          >
            Save selections
          </button>
        </div>
      </div>
    </div>
  )
}

export default NationPage
