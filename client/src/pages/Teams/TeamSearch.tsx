import { ChangeEvent, useEffect, useState } from 'react'

import nationService from '../../services/nations'
import teamService from '../../services/teams'
import styles from './Teams.module.css'
import { Association, TeamWithAssociation } from '../../types'
import NationSelect from '../../components/NationSelect'
import { getImageUrl } from '../../services/proxy'
import { Link } from 'react-router-dom'

const TeamSearch = () => {
  const [input, setInput] = useState<string>('')
  const [teamList, setTeamList] = useState<TeamWithAssociation[]>([])
  const [nations, setNations] = useState<Association[]>([])
  const [currentNation, setCurrentNation] = useState<Association>()
  const [showAllNations, setShowAllNations] = useState<boolean>(true)

  useEffect(() => {
    const getData = async () => {
      const nationData = await nationService.getAllNations()
      setNations(
        nationData.sort((a: Association, b: Association) =>
          a.code.localeCompare(b.code)
        )
      )
    }
    getData()
  }, [])

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value
    setInput(input)
    if (input.length < 3) {
      return
    }

    const teams = await teamService.getTeamsBySearchTerm(input)
  
    setTeamList(
      teams.filter((team: TeamWithAssociation) => {
        if (currentNation) {
          return team.associationId === currentNation.id
        }
        return true
      })
    )
  }

  const handleNationChange = async (nation: Association) => {
    setCurrentNation(nation)
    const teams = await teamService.getTeamsByAssociation(nation.id)
    setTeamList(
      teams.filter((team: TeamWithAssociation) =>
        team.name.toLowerCase().includes(input.toLowerCase())
      )
    )
  }

  return (
    <div className={styles.container}>
      <h2>Search teams</h2>
      <div className={styles.searchContainer}>
        <input
          className={styles.input}
          placeholder='Search'
          value={input}
          onChange={handleInputChange}
        />
        <NationSelect
          nations={nations}
          currentNation={currentNation || null}
          setNation={handleNationChange}
        />
      </div>

      <div className={styles.teamList}>
        {teamList.map((team: TeamWithAssociation) => (
          <div key={team.id} className={styles.team}>
            <img
              className={styles.flag}
              src={getImageUrl(team.associationFlag)}
              alt='flag'
            />
            <div className={styles.imgContainer}>
              <img className={styles.logo} src={team.logo} alt='logo' />
            </div>
            <Link to={`${team.id}`} className={styles.link}>
              {team.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamSearch
