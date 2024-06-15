import { useState } from 'react'

import styles from './Rankings.module.css'
import ClubRanking from './ClubRanking'
import NationRanking from './NationRanking'

const Rankings = () => {

  const [page, setPage] = useState<number>(1)


  return (
    <div className={styles.container}>
      <h2 className={styles.header}>UEFA Rankings</h2>
      <div className={styles.buttonContainer}>
        <button
          onClick={() => setPage(1)}
          className={`${styles.pageButton} ${
            page === 1 ? styles.selected : ''
          }`}
        >
          Clubs
        </button>
        <button
          onClick={() => setPage(2)}
          className={`${styles.pageButton} ${
            page === 2 ? styles.selected : ''
          }`}
        >
          Associations
        </button>
      </div>
      {page === 1 ? <ClubRanking /> : <NationRanking />}
    </div>
  )
}

export default Rankings
