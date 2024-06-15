import { Link } from 'react-router-dom'

import styles from './Seasons.module.css'

const SingleSeason = () => {
  return (
    <div className={styles.container}>
      <Link className={styles.link} to={`uefa/${1}`}>Uefa Champions League</Link>
      <Link className={styles.link} to={`uefa/${2}`}>Uefa Europa League</Link>
      <Link className={styles.link} to={`uefa/${3}`}>Uefa Europa Conference League</Link>
      <Link className={styles.link} to={`domestic`}>Member Associations</Link>
    </div>
  )
}

export default SingleSeason
