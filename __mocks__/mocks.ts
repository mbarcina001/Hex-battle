import {
  Owner,
  Pnj,
  City,
  Player,
  Hex,
  PNJ_TYPE_NAME,
  PnjType,
  HEX_TYPE,
  SelectedPnj,
  Building,
  BUILDING_TYPE_NAME
} from '../src/App.constants';

const mockOwner: Owner = {
  id: 1,
  color: 'red'
};

export const mockPnjType: PnjType = {
  typeName: PNJ_TYPE_NAME.SOLDIER,
  goldCost: 2,
  maxHealthPoints: 2,
  attack: 2,
  defense: 2,
  movementRange: 2,
  visionRange: 2,
  attackRange: 2,
  abilities: []
};

export const mockPnj: Pnj = {
  type: mockPnjType,
  id: '007',
  owner: mockOwner,
  canMove: false,
  hexLocationId: '1_1',
  healthPoints: 20
};

export const mockCity1: City = {
  name: 'Mock City',
  id: '0',
  owner: mockOwner,
  hexLocationId: '1_1',
  isCapitalCity: true,
  buildings: []
};

export const mockCity2: City = {
  name: 'Mock City 2',
  id: '2',
  owner: mockOwner,
  hexLocationId: '2_2',
  isCapitalCity: false,
  buildings: []
};

export const mockEmptyCity: City = {
  name: 'Mock Empty City',
  id: '3',
  owner: undefined,
  hexLocationId: '3_3',
  isCapitalCity: false,
  buildings: []
};

export const mockPlayer1: Player = {
  playerId: 1,
  playerColor: 'red',
  pnjList: [mockPnj],
  visibleHexsIds: [],
  gold: 0
};

export const mockPlayer2: Player = {
  playerId: 2,
  playerColor: 'blue',
  pnjList: [],
  visibleHexsIds: [],
  gold: 0
};

export const mockBoard: Hex[][] = [
  [
    {
      id: '0_0',
      type: HEX_TYPE.GRASS
    },
    {
      id: '0_1',
      type: HEX_TYPE.GRASS
    },
    {
      id: '0_2',
      type: HEX_TYPE.GRASS
    }
  ],
  [
    {
      id: '1_0',
      type: HEX_TYPE.GRASS
    },
    {
      id: '1_1',
      type: HEX_TYPE.GRASS
    },
    {
      id: '1_2',
      type: HEX_TYPE.GRASS
    },
    {
      id: '1_3',
      type: HEX_TYPE.GRASS
    },
    {
      id: '1_4',
      type: HEX_TYPE.GRASS
    }
  ],
  [
    {
      id: '2_0',
      type: HEX_TYPE.GRASS
    },
    {
      id: '2_1',
      type: HEX_TYPE.GRASS
    },
    {
      id: '2_2',
      type: HEX_TYPE.GRASS
    },
    {
      id: '2_3',
      type: HEX_TYPE.GRASS
    },
    {
      id: '2_4',
      type: HEX_TYPE.GRASS
    },
    {
      id: '2_5',
      type: HEX_TYPE.GRASS
    },
    {
      id: '2_6',
      type: HEX_TYPE.GRASS
    }
  ],
  [
    {
      id: '3_0',
      type: HEX_TYPE.GRASS
    },
    {
      id: '3_1',
      type: HEX_TYPE.GRASS
    },
    {
      id: '3_2',
      type: HEX_TYPE.GRASS
    },
    {
      id: '3_3',
      type: HEX_TYPE.GRASS
    },
    {
      id: '3_4',
      type: HEX_TYPE.GRASS
    }
  ],
  [
    {
      id: '4_0',
      type: HEX_TYPE.GRASS
    },
    {
      id: '4_1',
      type: HEX_TYPE.GRASS
    },
    {
      id: '4_2',
      type: HEX_TYPE.GRASS
    }
  ]
];

export const mockSelectedPnj: SelectedPnj = {
  whichPnj: mockPnj,
  destinationHexs: ['1_1']
};

export const mockBuilding: Building = {
  hexLocationId: '1_1',
  type: {
    typeName: BUILDING_TYPE_NAME.MARKET,
    goldCost: 5,
    goldEarnings: 2,
    allowedHexTypes: [HEX_TYPE.GRASS]
  }
};
