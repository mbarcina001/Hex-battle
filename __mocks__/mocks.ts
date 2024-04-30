import { Player } from '../src/App';
import { City } from '../src/components/City/City';
import { Hex } from '../src/components/Hex/Hex';
import { Pnj, PnjOwner } from '../src/components/Pnj/Pnj';

const mockOwner: PnjOwner = {
  id: 1,
  color: 'red'
};

export const mockPnj: Pnj = {
  type: 'mockType',
  id: '007',
  owner: mockOwner,
  canMove: false,
  hexLocationId: '1_1',
  attack: 10,
  defense: 10,
  healthPoints: 20
};

export const mockCity: City = {
  name: 'Mock City',
  id: '0',
  ownerId: 1,
  hexLocationId: '1_1'
};

export const mockPlayer1: Player = {
  playerId: 1,
  playerColor: 'red',
  pnjList: [mockPnj],
  cityList: [mockCity],
  visibleHexsIds: []
};

export const mockPlayer2: Player = {
  playerId: 2,
  playerColor: 'blue',
  pnjList: [],
  cityList: [],
  visibleHexsIds: []
};

export const mockBoard: Hex[][] = [
  [
    {
      id: '0_0',
      type: 'grass'
    },
    {
      id: '0_1',
      type: 'grass'
    },
    {
      id: '0_2',
      type: 'grass'
    }
  ],
  [
    {
      id: '1_0',
      type: 'grass'
    },
    {
      id: '1_1',
      type: 'grass'
    },
    {
      id: '1_2',
      type: 'grass'
    },
    {
      id: '1_3',
      type: 'grass'
    },
    {
      id: '1_4',
      type: 'grass'
    }
  ],
  [
    {
      id: '2_0',
      type: 'grass'
    },
    {
      id: '2_1',
      type: 'grass'
    },
    {
      id: '2_2',
      type: 'grass'
    },
    {
      id: '2_3',
      type: 'grass'
    },
    {
      id: '2_4',
      type: 'grass'
    },
    {
      id: '2_5',
      type: 'grass'
    },
    {
      id: '2_6',
      type: 'grass'
    }
  ],
  [
    {
      id: '3_0',
      type: 'grass'
    },
    {
      id: '3_1',
      type: 'grass'
    },
    {
      id: '3_2',
      type: 'grass'
    },
    {
      id: '3_3',
      type: 'grass'
    },
    {
      id: '3_4',
      type: 'grass'
    }
  ],
  [
    {
      id: '4_0',
      type: 'grass'
    },
    {
      id: '4_1',
      type: 'grass'
    },
    {
      id: '4_2',
      type: 'grass'
    }
  ]
];
