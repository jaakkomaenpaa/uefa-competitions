import { CompetitionCode, StageSQL } from '../types'

type Allocation = {
  [key in StageSQL]?: number;
};

type CompetitionAllocations = {
  [key in CompetitionCode]?: Allocation;
};

type AssociationSpotsEntry = {
  ranks: number[];
  uclTeams: number;
  totalTeams: number;
  allocations: CompetitionAllocations;
};

// Does not take Russia or Liechtenstein into account
export const ASSOCIATION_UEFA_SPOTS: AssociationSpotsEntry[] = [
  {
    ranks: [1, 4],
    uclTeams: 4,
    totalTeams: 7,
    allocations: {
      [CompetitionCode.UCL]: {
        [StageSQL.LP]: 4,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UEL]: {
        [StageSQL.LP]: 2,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UECL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 1,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 0,
      },
    },
  },
  {
    ranks: [5],
    uclTeams: 4,
    totalTeams: 7,
    allocations: {
      [CompetitionCode.UCL]: {
        [StageSQL.LP]: 3,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 1,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UEL]: {
        [StageSQL.LP]: 2,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UECL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 1,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 0,
      },
    },
  },
  {
    ranks: [6],
    uclTeams: 3,
    totalTeams: 6,
    allocations: {
      [CompetitionCode.UCL]: {
        [StageSQL.LP]: 2,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 1,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UEL]: {
        [StageSQL.LP]: 1,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 1,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UECL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 1,
        [StageSQL.QR1]: 0,
      },
    },
  },
  {
    ranks: [7],
    uclTeams: 2,
    totalTeams: 5,
    allocations: {
      [CompetitionCode.UCL]: {
        [StageSQL.LP]: 1,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 1,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UEL]: {
        [StageSQL.LP]: 1,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 1,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UECL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 1,
        [StageSQL.QR1]: 0,
      },
    },
  },
  {
    ranks: [8, 9],
    uclTeams: 2,
    totalTeams: 5,
    allocations: {
      [CompetitionCode.UCL]: {
        [StageSQL.LP]: 1,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 1,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UEL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 1,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 1,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UECL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 1,
        [StageSQL.QR1]: 0,
      },
    },
  },
  {
    ranks: [10],
    uclTeams: 2,
    totalTeams: 5,
    allocations: {
      [CompetitionCode.UCL]: {
        [StageSQL.LP]: 1,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 1,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UEL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 1,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 1,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UECL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 1,
        [StageSQL.QR1]: 0,
      },
    },
  },
  {
    ranks: [11, 12],
    uclTeams: 2,
    totalTeams: 5,
    allocations: {
      [CompetitionCode.UCL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 1,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 1,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UEL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 1,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 1,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UECL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 1,
        [StageSQL.QR1]: 0,
      },
    },
  },
  {
    ranks: [13, 14],
    uclTeams: 2,
    totalTeams: 5,
    allocations: {
      [CompetitionCode.UCL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 1,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 1,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UEL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 1,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UECL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 2,
        [StageSQL.QR1]: 0,
      },
    },
  },
  {
    ranks: [15],
    uclTeams: 2,
    totalTeams: 5,
    allocations: {
      [CompetitionCode.UCL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 2,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UEL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 1,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UECL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 2,
        [StageSQL.QR1]: 0,
      },
    },
  },
  {
    ranks: [16],
    uclTeams: 1,
    totalTeams: 4,
    allocations: {
      [CompetitionCode.UCL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 1,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UEL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 1,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UECL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 2,
        [StageSQL.QR1]: 0,
      },
    },
  },
  {
    ranks: [17, 23],
    uclTeams: 1,
    totalTeams: 4,
    allocations: {
      [CompetitionCode.UCL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 1,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UEL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 1,
      },
      [CompetitionCode.UECL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 2,
        [StageSQL.QR1]: 0,
      },
    },
  },
  {
    ranks: [24, 28],
    uclTeams: 1,
    totalTeams: 4,
    allocations: {
      [CompetitionCode.UCL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 1,
      },
      [CompetitionCode.UEL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 1,
      },
      [CompetitionCode.UECL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 2,
        [StageSQL.QR1]: 0,
      },
    },
  },
  {
    ranks: [29, 32],
    uclTeams: 1,
    totalTeams: 4,
    allocations: {
      [CompetitionCode.UCL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 1,
      },
      [CompetitionCode.UEL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 1,
      },
      [CompetitionCode.UECL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 1,
        [StageSQL.QR1]: 1,
      },
    },
  },
  {
    ranks: [33, 42],
    uclTeams: 1,
    totalTeams: 4,
    allocations: {
      [CompetitionCode.UCL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 1,
      },
      [CompetitionCode.UEL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UECL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 1,
        [StageSQL.QR1]: 2,
      },
    },
  },
  {
    ranks: [43, 48],
    uclTeams: 1,
    totalTeams: 4,
    allocations: {
      [CompetitionCode.UCL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 1,
      },
      [CompetitionCode.UEL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UECL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 3,
      },
    },
  },
  {
    ranks: [49, 53],
    uclTeams: 1,
    totalTeams: 3,
    allocations: {
      [CompetitionCode.UCL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 1,
      },
      [CompetitionCode.UEL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 0,
      },
      [CompetitionCode.UECL]: {
        [StageSQL.LP]: 0,
        [StageSQL.QPO]: 0,
        [StageSQL.QR3]: 0,
        [StageSQL.QR2]: 0,
        [StageSQL.QR1]: 2,
      },
    },
  },
]
