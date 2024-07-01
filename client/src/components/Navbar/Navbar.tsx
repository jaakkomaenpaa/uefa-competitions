import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

import Ranking from '../../pages/Rankings/Rankings'
import Seasons from '../../pages/Seasons/Seasons'
import Teams from '../../pages/Teams'
import Home from '../../pages/Home'
import SingleSeason from '../../pages/Seasons/SingleSeason'
import UefaCompetition from '../../pages/Competitions/UefaCompetition'
import DomesticLeagues from '../../pages/Leagues/DomesticLeagues'
import NationPage from '../../pages/Leagues/NationPage'
import styles from './Navbar.module.css'

const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      const links = containerRef.current.querySelectorAll<HTMLAnchorElement>(
        `.${styles.navbarTab}`
      )

      const activeBar = containerRef.current.querySelector<HTMLDivElement>(
        `.${styles.activeBar}`
      ) as HTMLElement

      const link = links[activeIndex]

      activeBar.style.transform = `translateX(${link.offsetLeft}px)`
      activeBar.style.width = `${link.offsetWidth}px`
    }
  }, [activeIndex])

  return (
    <Router>
      <div className={styles.container} ref={containerRef}>
        <Link className={styles.navbarTab} to='/' onClick={() => setActiveIndex(0)}>
          Home
        </Link>
        <Link
          className={styles.navbarTab}
          to='/seasons'
          onClick={() => setActiveIndex(1)}
        >
          Seasons
        </Link>
        <Link
          className={styles.navbarTab}
          to='/teams'
          onClick={() => setActiveIndex(2)}
        >
          Teams
        </Link>
        <Link
          className={styles.navbarTab}
          to='/ranking'
          onClick={() => setActiveIndex(3)}
        >
          Ranking
        </Link>
        <div className={styles.activeBar}></div>
      </div>
      <div className={styles.content}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/seasons' element={<Seasons />} />
          <Route path='/teams' element={<Teams />} />
          <Route path='/ranking' element={<Ranking />} />
          <Route path='/seasons/:seasonId' element={<SingleSeason />} />
          <Route
            path='/seasons/:seasonId/uefa/:compId'
            element={<UefaCompetition />}
          />
          <Route path='/seasons/:seasonId/domestic' element={<DomesticLeagues />} />
          <Route
            path='/seasons/:seasonId/domestic/:nationId'
            element={<NationPage />}
          />
        </Routes>
      </div>
    </Router>
  )
}

export default Navbar
