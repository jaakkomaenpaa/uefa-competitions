import { useEffect, useState } from 'react'

import seasonService from '../../services/seasons'
import { Season } from '../../types'
import styles from './Seasons.module.css'
import { Link } from 'react-router-dom'

const Seasons = () => {
  const [seasons, setSeasons] = useState<Season[]>([])

  useEffect(() => {
    const getSeasons = async () => {
      const seasonData = await seasonService.getAllSeasons()
      setSeasons(seasonData)
    }
    getSeasons()
  }, [])

  return (
    <div className={styles.container}>
      {seasons.map((season: Season) => (
        <Link
          key={season.id}
          className={styles.link}
          to={`${season.id}`}
        >{`${season.startYear}/${season.endYear}`}</Link>
      ))}
    </div>
  )
}

export default Seasons
