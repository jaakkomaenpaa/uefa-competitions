import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import nationService from '../../services/nations'
import { Association } from '../../types'

import styles from './Leagues.module.css'

const DomesticLeagues = () => {
  const { seasonId } = useParams()
  const [nations, setNations] = useState<Association[]>([])

  useEffect(() => {
    const getNations = async () => {
      const nationData = await nationService.getAllNations()
      setNations(nationData)
    }
    getNations()
  }, [])

  return (
    <div className={styles.nationList}>
      {nations.map((nation: Association) => (
        <Link
          className={styles.link}
          key={nation.id}
          to={`/seasons/${seasonId}/domestic/${nation.id}`}
        >
          <div className={styles.imgContainer}>
            <img className={styles.flag} src={nation.flag} alt='flag' />
          </div>
          {nation.name}
        </Link>
      ))}
    </div>
  )
}

export default DomesticLeagues
