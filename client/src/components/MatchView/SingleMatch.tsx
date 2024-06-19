import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { getImageUrl } from '../../services/proxy'
import { Match, MatchScore, StageClient } from '../../types'
import styles from './MatchView.module.css'
import { convertStageClientToSql } from '../../utils'
import matchService from '../../services/matches'

interface SingleMatchProps {
  match: Match
  stage: StageClient
  saveMatch: (match: MatchScore) => void
}

const SingleMatch = ({ match, stage, saveMatch }: SingleMatchProps) => {
  const [homeScore, setHomeScore] = useState<string>('')
  const [awayScore, setAwayScore] = useState<string>('')
  const [homeAggr, setHomeAggr] = useState<number>()
  const [awayAggr, setAwayAggr] = useState<number>()
  const [homePens, setHomePens] = useState<number>()
  const [awayPens, setAwayPens] = useState<number>()

  const prevHomeScore = useRef<string>(homeScore)
  const prevAwayScore = useRef<string>(awayScore)

  useEffect(() => {
    const getAggregate = async () => {
      const data = await matchService.getAggregate(match.id)
      if (data === null) {
        return
      }
      setHomeAggr(data.homeAggregate)
      setAwayAggr(data.awayAggregate)

      if (data.homePens !== null && data.awayPens !== null) {
        setHomePens(data.homePens)
        setAwayPens(data.awayPens)
      }
    }
    getAggregate()
  }, [match.id])

  useEffect(() => {
    if (
      homeScore &&
      awayScore &&
      (homeScore !== prevHomeScore.current || awayScore !== prevAwayScore.current)
    ) {
      const updatedMatch = {
        id: match.id,
        homeId: match.homeId,
        awayId: match.awayId,
        homeScore: parseInt(homeScore),
        awayScore: parseInt(awayScore),
        isOvertime: false,
        pensHome: undefined,
        pensAway: undefined,
        stage: convertStageClientToSql(stage),
      }
      saveMatch(updatedMatch)
      prevHomeScore.current = homeScore
      prevAwayScore.current = awayScore
    }
  }, [homeScore, awayScore, match.id, match.homeId, match.awayId, stage, saveMatch])

  const handleScoreChange = (
    event: ChangeEvent<HTMLInputElement>,
    isHome: boolean
  ) => {
    const score = event.target.value

    if (isHome) {
      setHomeScore(score)
    } else {
      setAwayScore(score)
    }
  }

  return (
    <div className={styles.matchContainer} key={match.id}>
      <div className={styles.scoreContainer}>
        <div className={styles.homeTeamContainer}>
          {match.homeTeam}
          <div className={styles.imgContainer}>
            <img
              className={styles.logo}
              src={match.homeLogo!}
              alt='logo'
            />
          </div>
        </div>
        <div className={styles.inputContainer}>
          <input
            className={`${styles.scoreField} ${
              match.homeScore !== null ? styles.disabled : ''
            }`}
            onChange={e => handleScoreChange(e, true)}
            value={match.homeScore === null ? homeScore : match.homeScore}
            disabled={match.homeScore !== null}
          />
          <input
            className={`${styles.scoreField} ${
              match.awayScore !== null ? styles.disabled : ''
            }`}
            onChange={e => handleScoreChange(e, false)}
            value={match.awayScore === null ? awayScore : match.awayScore}
            disabled={match.awayScore !== null}
          />
        </div>
        <div className={styles.awayTeamContainer}>
          <div className={styles.imgContainer}>
            <img
              className={styles.logo}
              src={match.awayLogo!}
              alt='logo'
            />
          </div>
          {match.awayTeam}
        </div>
      </div>
      {homeAggr !== undefined && awayAggr !== undefined && (
        <div className={styles.aggregate}>
          Aggregate: {homeAggr}-{awayAggr}
          {homePens !== undefined &&
            awayPens !== undefined &&
            `  (p ${homePens}-${awayPens})`}
        </div>
      )}
    </div>
  )
}

export default SingleMatch
