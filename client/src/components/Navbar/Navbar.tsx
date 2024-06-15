import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

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
  return (
    <Router>
      <div className={styles.container}>
        <Link className={styles.navbarTab} to='/'>
          Home
        </Link>
        <Link className={styles.navbarTab} to='/seasons'>
          Seasons
        </Link>
        <Link className={styles.navbarTab} to='/teams'>
          Teams
        </Link>
        <Link className={styles.navbarTab} to='/ranking'>
          Ranking
        </Link>
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
          <Route
            path='/seasons/:seasonId/domestic'
            element={<DomesticLeagues />}
          />
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
