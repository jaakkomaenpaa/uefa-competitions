import Association from '../classes/Association'
import Team from '../classes/Team'
import { ASSOCIATION_UEFA_SPOTS } from '../rules/spots'
import { CompetitionCode, StageSQL } from '../types'
import { moveArrayItem } from './helpers'

export const setAssociationSpots = (
  associationRank: number,
  association: Association,
  seasonId: number
) => {
  const cupWinner = association.getCupWinner(seasonId - 1)

  // If Liechtenstein
  // TODO: check if has rights for higher spot
  if (association.getId() === 1) {
    cupWinner.setUefaStage(StageSQL.QR2, CompetitionCode.UECL)
    return
  }

  // If Russia
  if (association.getId() === 235) {
    return
  }

  const allocationData = getAllocationsByRank(associationRank)

  if (!allocationData) {
    throw new Error(`No spot allocation found for rank ${associationRank}`)
  }

  const { allocations, totalTeams, uclTeams } = allocationData
  let topTeams = association.getTopLeagueTeams(seasonId - 1, totalTeams)

  const cupWinnerPosition =
    topTeams.findIndex((team: Team) => team.getId() === cupWinner.getId()) + 1

  // Insert cup winner to place after ucl spots
  if (cupWinnerPosition === 0) {
    topTeams.splice(uclTeams, 0, cupWinner)

    // Move cup winner up in positions
  } else if (cupWinnerPosition > uclTeams) {
    topTeams = moveArrayItem(topTeams, cupWinnerPosition - 1, uclTeams)
  }

  const competitions = Object.values(CompetitionCode).filter(
    (value): value is CompetitionCode => typeof value === 'number'
  )

  // Iterate through allocations and place teams according to them
  competitions.forEach((comp: CompetitionCode) => {
    const stages = [
      StageSQL.LP,
      StageSQL.QPO,
      StageSQL.QR3,
      StageSQL.QR2,
      StageSQL.QR1,
    ]

    stages.forEach((stage: StageSQL) => {
      const places = allocations[comp]?.[stage]

      if (places === undefined) {
        throw new Error(
          `Uefa places not found for stage ${stage} and comp ${comp}`
        )
      }

      for (let i = 1; i <= places; i++) {
        if (topTeams.length === 0) break

        topTeams[0].setUefaStage(stage, comp)
        topTeams.shift()
      }
    })
  })
}

const getAllocationsByRank = (rank: number) => {
  for (const entry of ASSOCIATION_UEFA_SPOTS) {
    if (
      (entry.ranks.length === 1 && rank === entry.ranks[0]) ||
      (rank >= entry.ranks[0] && rank <= entry.ranks[1])
    ) {
      return {
        allocations: entry.allocations,
        totalTeams: entry.totalTeams,
        uclTeams: entry.uclTeams,
      }
    }
  }
  return null
}
