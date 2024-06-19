import { useState, useEffect, ChangeEvent } from 'react'
import { useParams } from 'react-router-dom'

import SingleStage from './SingleStage'
import { Match, StageClient } from '../../types'
import uefaSeasonService from '../../services/uefaSeasons'
import styles from './MatchView.module.css'

const MatchView = () => {
  const { seasonId, compId } = useParams()
  const [matches, setMatches] = useState<Match[]>([])
  const [currentStage, setCurrentStage] = useState<StageClient>(StageClient.QR1)

  useEffect(() => {
    const getStage = () => {
      const stage = window.localStorage.getItem(`stage-comp-${compId}`)
      if (stage) {
        setCurrentStage(stage as StageClient)
      }
    }

    const getMatches = async () => {
      if (seasonId && compId && currentStage) {
        const matchData = await uefaSeasonService.getMatchesByCompStage(
          seasonId,
          compId,
          currentStage
        )
        setMatches(matchData)
      }
    }
    getStage()
    getMatches()
  }, [compId, seasonId, currentStage])

  if (!seasonId || !compId) return <div>Loading...</div>

  const handleStageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const stage = event.target.value as StageClient
    setCurrentStage(stage)
    window.localStorage.setItem(`stage-comp-${compId}`, stage)
  }

  return (
    <div className={styles.container}>
      <select
        className={styles.stageSelect}
        value={currentStage}
        onChange={handleStageChange}
      >
        {Object.values(StageClient).map((stage: StageClient) => (
          <option className={styles.option} key={stage} value={stage}>
            {stage}
          </option>
        ))}
      </select>
      <SingleStage stage={currentStage} matches={matches} />
    </div>
  )
}

export default MatchView
