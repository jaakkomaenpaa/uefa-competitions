import { useEffect, useState } from 'react'

import domSeasonService from '../../services/domSeasons'
import seasonService from '../../services/seasons'
import uefaSeasonService from '../../services/uefaSeasons'
import { Association, Season } from '../../types'
import { Link } from 'react-router-dom'
import styles from './Home.module.css'
import { initNextSeasonData } from '../../utils/seasons'
import uclLogo from '../../images/UCL_onWhite.jpg'
import uelLogo from '../../images/UEL_onWhite.jpg'
import ueclLogo from '../../images/UECL_onWhite.png'

interface UefaComp {
  name: string
  logo: string
  id: number
  finished: boolean
}

const Home = () => {
  const [nations, setNations] = useState<Association[]>([])
  const [currentSeason, setCurrentSeason] = useState<Season>()
  const [competitions, setCompetitions] = useState<UefaComp[]>([
    {
      name: 'UCL',
      logo: uclLogo,
      id: 1,
      finished: false,
    },
    {
      name: 'UEL',
      logo: uelLogo,
      id: 2,
      finished: false,
    },
    {
      name: 'UECL',
      logo: ueclLogo,
      id: 3,
      finished: false,
    },
  ])

  useEffect(() => {
    const getData = async () => {
      const seasonData = await seasonService.getCurrentSeason()
      setCurrentSeason(seasonData)
      const nationData = await domSeasonService.getDomSeasonStatuses(seasonData.id)
      setNations(nationData.filter((nation: Association) => !nation.seasonFinished))
      const updatedCompetitions = await Promise.all(
        competitions.map(async competition => {
          const compData = await uefaSeasonService.getUefaCompStatus(
            seasonData.id,
            competition.id
          )
          return {
            ...competition,
            finished: compData.finished,
          }
        })
      )
      setCompetitions(updatedCompetitions)
    }
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submit = async () => {
    await initNextSeasonData()
    window.location.reload()
  }

  if (!currentSeason) return <div>Loading...</div>

  return (
    <div className={styles.container}>
      <h2>Leagues not finished for this season</h2>
      <div className={styles.nationList}>
        {competitions.map((comp: UefaComp) => {
          if (!comp.finished) {
            return (
              <Link
                key={comp.id}
                className={styles.link}
                to={`seasons/${currentSeason.id}/uefa/${comp.id}`}
              >
                <div className={styles.imgContainer}>
                  <img className={styles.img} src={comp.logo} alt='logo' />
                </div>
                {comp.name}
              </Link>
            )
          }
          return null
        })}
        {nations.map((nation: Association) => (
          <Link
            className={styles.link}
            key={nation.id}
            to={`/seasons/${currentSeason.id}/domestic/${nation.id}`}
          >
            <div className={styles.imgContainer}>
              <img className={styles.img} src={nation.flag} alt='flag' />
            </div>
            {nation.name}
          </Link>
        ))}
      </div>
      {nations.length === 0 &&
        competitions.every((comp: UefaComp) => comp.finished) && (
          <button className={styles.saveButton} onClick={submit}>
            Finish this season
          </button>
        )}
    </div>
  )
}

export default Home
