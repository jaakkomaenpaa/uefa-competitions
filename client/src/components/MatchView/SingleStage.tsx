import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Match, MatchScore, StageClient } from '../../types'
import styles from './MatchView.module.css'
import matchService from '../../services/matches'
import SingleMatch from './SingleMatch'
import { convertStageClientToSql, isStageReadyToDraw } from '../../utils'

interface SingleStageProps {
  stage: StageClient
  matches: Match[]
}

const SingleStage = ({ stage, matches }: SingleStageProps) => {
  const { seasonId, compId } = useParams()
  const [matchesToSave, setMatchesToSave] = useState<MatchScore[]>([])
  const [isReadyToDraw, setIsReadyToDraw] = useState<boolean>(false)
  const [isFinished, setIsFinished] = useState<boolean>(false)

  useEffect(() => {
    const getStatus = async () => {
      if (!compId || !seasonId) {
        return
      }
      const drawStatus = await isStageReadyToDraw(
        stage,
        parseInt(compId),
        parseInt(seasonId)
      )
      setIsReadyToDraw(drawStatus)
      const stageStatus = await matchService.getStageStatus(
        parseInt(compId),
        convertStageClientToSql(stage),
        seasonId
      )
      setIsFinished(stageStatus.finished)
    }
    getStatus()
  }, [stage, compId, seasonId])

  if (!stage || !seasonId || !compId) {
    return <div>No stage selected</div>
  }

  const saveMatch = (match: MatchScore) => {
    setMatchesToSave([...matchesToSave, match])
  }

  const finishStage = async () => {
    await matchService.finishStage(seasonId, stage, compId)
    window.location.reload()
  }

  const setScores = async () => {
    matchesToSave.forEach(async (match: MatchScore) => {
      await matchService.setMatchScore(match)
    })
    window.location.reload()
  }

  const makeDraw = async () => {
    await matchService.getDrawForStage(
      parseInt(compId),
      convertStageClientToSql(stage)
    )
    window.location.reload()
  }

  return (
    <div className={styles.matchList}>
      {matches.map((match: Match) => (
        <SingleMatch
          key={match.id}
          match={match}
          saveMatch={saveMatch}
          stage={stage}
        />
      ))}
      {matches.length > 0 &&
        !isFinished &&
        matches.every(
          (match: Match) => match.homeScore !== null && match.awayScore !== null
        ) && (
          <button className={styles.saveButton} onClick={finishStage}>
            Finish this stage
          </button>
        )}
      {matches.length === 0 && !isReadyToDraw && (
        <div>No matches for this stage yet</div>
      )}
      {matches.length === 0 && isReadyToDraw && (
        <button className={styles.saveButton} onClick={makeDraw}>
          Make draw
        </button>
      )}
      {matchesToSave.length > 0 && (
        <button className={styles.saveButton} onClick={setScores}>
          Save scores
        </button>
      )}
    </div>
  )
}

export default SingleStage
