import uefaSeasonService from './services/uefaSeasons'
import domSeasonService from './services/domSeasons'
import seasonService from './services/seasons'
import matchService from './services/matches'

import { Season, StageClient, StageSQL } from './types'

export const sleep = (s: number) => {
  return new Promise(resolve => setTimeout(resolve, s * 1000))
}

export const splitArrayIntoChunks = (array: any[], chunkSize: number) => {
  const chunks: any[] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

export const initNextSeasonData = async () => {
  console.log('test1')
  const nextSeason: Season = await seasonService.setNextSeason()

  console.log('test2')
  // set nations into uefa table with 0 points
  await uefaSeasonService.initNationUefaSeasons(nextSeason.id)

  console.log('test3')
  // set teams into domestic tables with null positions
  await domSeasonService.initAllDomSeasons(nextSeason.id)

  console.log('test4')
  // Set teams for uefa competitions
  await uefaSeasonService.initUefaSpots(nextSeason.id)

  console.log('test5')
  // Draw first qualifying rounds
  await uefaSeasonService.setFirstQualStages(nextSeason.id)
  console.log('test6')
}

export const isStageReadyToDraw = async (
  stage: StageClient,
  competitionId: number,
  seasonId: number
) => {
  if (seasonId === 1) {
    return false
  }

  const prevStage = getPreviousStage(stage)

  if (prevStage === null) {
    return true
  }

  const prevStageSql = convertStageClientToSql(prevStage)

  if (competitionId === 1) {
    const status = await matchService.getStageStatus(1, prevStageSql, seasonId)
    return status.finished
  } else if (competitionId === 2) {
    if (stage === StageClient.QR3) {
      const uclStatus = await matchService.getStageStatus(1, StageSQL.QR2, seasonId)
      const uelStatus = await matchService.getStageStatus(2, StageSQL.QR2, seasonId)
      return uclStatus.finished && uelStatus.finished
    }

    if (stage === StageClient.QPO) {
      const uclStatus = await matchService.getStageStatus(1, StageSQL.QR3, seasonId)
      const uelStatus = await matchService.getStageStatus(2, StageSQL.QR3, seasonId)
      return uclStatus.finished && uelStatus.finished
    }

    if (stage === StageClient.LP) {
      const uclStatus = await matchService.getStageStatus(1, StageSQL.QPO, seasonId)
      const uelStatus = await matchService.getStageStatus(2, StageSQL.QPO, seasonId)
      return uclStatus.finished && uelStatus.finished
    }

    const status = await matchService.getStageStatus(2, prevStageSql, seasonId)
    return status.finished
  } else if (competitionId === 3) {
    if (stage === StageClient.QR2) {
      const uclStatus = await matchService.getStageStatus(1, StageSQL.QR1, seasonId)
      const uelStatus = await matchService.getStageStatus(2, StageSQL.QR1, seasonId)
      const ueclStatus = await matchService.getStageStatus(3, StageSQL.QR1, seasonId)

      return uclStatus.finished && uelStatus.finished && ueclStatus.finished
    }

    if (stage === StageClient.QR3) {
      const uelStatus = await matchService.getStageStatus(2, StageSQL.QR2, seasonId)
      const ueclStatus = await matchService.getStageStatus(3, StageSQL.QR2, seasonId)

      return uelStatus.finished && ueclStatus.finished
    }

    if (stage === StageClient.QPO) {
      const uelStatus = await matchService.getStageStatus(2, StageSQL.QR3, seasonId)
      const ueclStatus = await matchService.getStageStatus(3, StageSQL.QR3, seasonId)

      return uelStatus.finished && ueclStatus.finished
    }

    if (stage === StageClient.LP) {
      const uelStatus = await matchService.getStageStatus(2, StageSQL.QPO, seasonId)
      const ueclStatus = await matchService.getStageStatus(3, StageSQL.QPO, seasonId)

      return uelStatus.finished && ueclStatus.finished
    }

    const status = await matchService.getStageStatus(3, prevStageSql, seasonId)
    return status.finished
  }
}

export const getPreviousStage = (stage: StageClient): StageClient | null => {
  const stages = Object.values(StageClient)
  const prevStageIndex = stages.indexOf(stage) - 1

  if (prevStageIndex < 0) {
    return null
  }
  return stages[prevStageIndex]
}

export const convertStageClientToSql = (stageClient: StageClient) => {
  const mapping: { [key in StageClient]: StageSQL } = {
    [StageClient.QR1]: StageSQL.QR1,
    [StageClient.QR2]: StageSQL.QR2,
    [StageClient.QR3]: StageSQL.QR3,
    [StageClient.QPO]: StageSQL.QPO,
    [StageClient.LP]: StageSQL.LP,
    [StageClient.KPO]: StageSQL.KPO,
    [StageClient.R16]: StageSQL.R16,
    [StageClient.QF]: StageSQL.QF,
    [StageClient.SF]: StageSQL.SF,
    [StageClient.F]: StageSQL.F,
  }
  return mapping[stageClient]
}

export const convertStageSqlToClient = (stageSql: StageSQL) => {
  const mapping: { [key in StageSQL]: StageClient } = {
    [StageSQL.QR1]: StageClient.QR1,
    [StageSQL.QR2]: StageClient.QR2,
    [StageSQL.QR3]: StageClient.QR3,
    [StageSQL.QPO]: StageClient.QPO,
    [StageSQL.LP]: StageClient.LP,
    [StageSQL.KPO]: StageClient.KPO,
    [StageSQL.R16]: StageClient.R16,
    [StageSQL.QF]: StageClient.QF,
    [StageSQL.SF]: StageClient.SF,
    [StageSQL.F]: StageClient.F,
  }

  return mapping[stageSql]
}
