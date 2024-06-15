import { useState, useEffect } from 'react'
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
    getMatches()
  }, [compId, seasonId, currentStage])

  if (!seasonId || !compId) return <div>Loading...</div>

  return (
    <div className={styles.container}>
      <select
        className={styles.stageSelect}
        value={currentStage}
        onChange={e => setCurrentStage(e.target.value as StageClient)}
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
