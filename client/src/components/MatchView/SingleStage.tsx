import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Match, MatchScore, StageClient } from '../../types'
import styles from './MatchView.module.css'
import matchService from '../../services/matches'
import SingleMatch from './SingleMatch'
import {
  convertStageClientToSql,
  getNextStage,
  isStageReadyToDraw,
} from '../../utils/stages'
import { sleep } from '../../utils/general'

interface SingleStageProps {
  stage: StageClient
  matches: Match[]
}

const SingleStage = ({ stage, matches }: SingleStageProps) => {
  const { seasonId, compId } = useParams()
  const [matchesToSave, setMatchesToSave] = useState<MatchScore[]>([])
  const [isReadyToDraw, setIsReadyToDraw] = useState<boolean>(false)
  const [isFinished, setIsFinished] = useState<boolean>(false)

  matches = matches.sort((a: Match, b: Match) => {
    const aIsFinished = a.homeScore !== null
    const bIsFinished = b.homeScore !== null

    if (aIsFinished === bIsFinished) {
      return 0
    }

    return aIsFinished ? 1 : -1
  })

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
    console.log('match', match)
    setMatchesToSave([...matchesToSave, match])
    console.log('matches to save', matchesToSave)
  }

  const finishStage = async () => {
    await matchService.finishStage(seasonId, stage, compId)
    const nextStage = getNextStage(stage)
    if (nextStage !== null) {
      window.localStorage.setItem(`stage-comp-${compId}`, nextStage)
    }
    await sleep(0.5)
    window.location.reload()
  }

  const setScores = async () => {
    matchesToSave.forEach(async (match: MatchScore) => {
      await matchService.setMatchScore(match)
    })
    await sleep(0.5)
    window.location.reload()
  }

  const makeDraw = async () => {
    await matchService.getDrawForStage(
      parseInt(compId),
      convertStageClientToSql(stage)
    )
    window.location.reload()
  }

  if (isFinished && matches.length === 0) {
    return <div className={styles.matchList}>Data not available</div>
  }

  return (
    <div className={styles.matchList}>
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
        <div>This stage cannot be drawn yet</div>
      )}
      {matches.length === 0 && isReadyToDraw ? (
        <button className={styles.saveButton} onClick={makeDraw}>
          Make draw
        </button>
      ) : null}
      {matchesToSave.length > 0 && (
        <button className={styles.saveButton} onClick={setScores}>
          Save scores
        </button>
      )}
      {matches.map((match: Match) => (
        <SingleMatch
          key={match.id}
          match={match}
          saveMatch={saveMatch}
          stage={stage}
        />
      ))}
    </div>
  )
}

export default SingleStage
