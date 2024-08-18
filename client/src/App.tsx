import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import UefaCompetition from './pages/Competitions/UefaCompetition'
import Home from './pages/Home'
import Seasons from './pages/Seasons/Seasons'
import { SingleTeam, TeamSearch } from './pages/Teams'
import Rankings from './pages/Rankings'
import { SingleSeason } from './pages/Seasons'
import { DomesticLeagues, NationPage } from './pages/Leagues'
import './index.css'

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className='content'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/seasons' element={<Seasons />} />
          <Route path='/teams' element={<TeamSearch />} />
          <Route path='/teams/:teamId' element={<SingleTeam />} />
          <Route path='/ranking' element={<Rankings />} />
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

export default App
