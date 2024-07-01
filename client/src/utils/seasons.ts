import uefaSeasonService from '../services/uefaSeasons'
import domSeasonService from '../services/domSeasons'
import seasonService from '../services/seasons'

import { Season } from '../types'

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
