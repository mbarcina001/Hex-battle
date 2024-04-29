import { Player } from '../src/App';
import { Pnj, PnjOwner } from '../src/components/Pnj/Pnj';

export const mockPlayer1: Player = {
  playerId: 1,
  playerColor: 'red',
  pnjList: [],
  cityList: [],
  visibleHexsIds: []
};

export const mockPlayer2: Player = {
  playerId: 2,
  playerColor: 'blue',
  pnjList: [],
  cityList: [],
  visibleHexsIds: []
};

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
