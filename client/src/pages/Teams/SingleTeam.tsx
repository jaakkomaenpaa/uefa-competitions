import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { Team } from '../../types'
import styles from './Teams.module.css'
import teamService from '../../services/teams'

const SingleTeam = () => {
  const { teamId } = useParams()

  const [team, setTeam] = useState<Team>()

  useEffect(() => {
    const getTeam = async () => {
      if (!teamId) {
        return
      }
      const data = await teamService.getTeamById(teamId)
      setTeam(data)
    }

    getTeam()
  }, [teamId])

  return <div>{team?.name}</div>
}

export default SingleTeam
