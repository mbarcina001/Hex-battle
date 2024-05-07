export const MAX_HEALTH_POINTS = 10;

export enum HEX_TYPE {
  GRASS = 'GRASS',
  DESERT = 'DESERT'
}

export interface Hex {
  id: string;
  type: string;
}

export interface Owner {
  id: number;
  color: string;
}

export interface SelectedPnj {
  whichPnj: Pnj;
  destinationHexs: string[];
}

export interface VisibleHexsByPlayer {
  playerId: number;
  visibleHexsIds: string[];
}

export enum PNJ_TYPE {
  SOLDIER = 'Soldier',
  EXPLORER = 'Explorer',
  ARCHER = 'Archer',
  GUARDIAN = 'Guardian',
  KNIGHT = 'Knight'
}

export enum PNJ_ABILITY {
  MOVE_AFTER_KILL = 'MOVE_AFTER_KILL'
}

export interface PnjType {
  type: PNJ_TYPE;
  goldCost: number;
  maxHealthPoints: number;
  attack: number;
  defense: number;
  movementRange: number;
  visionRange: number;
  attackRange: number;
  abilities: PNJ_ABILITY[];
}

export interface Pnj {
  type: string;
  id: string;
  owner: Owner;
  canMove: boolean;
  hexLocationId: string;
  attack: number;
  defense: number;
  healthPoints: number;
}

export enum BUILDING_TYPE {
  WINDMILL = 'Windmill',
  WELL = 'Well',
  WOOD_CHOP = 'Wood chop',
  MARKET = 'Market',
  GOLD_MINE = 'Gold mine'
}

export interface BuildingType {
  type: BUILDING_TYPE;
  goldCost: number;
  goldEarnings: number;
  allowedHexTypes: HEX_TYPE[];
}

export interface City {
  name: string;
  id: string;
  isCapitalCity: boolean;
  owner?: Owner;
  hexLocationId: string;
  buildings: BuildingType[];
}

export interface Player {
  playerId: number;
  playerColor: string;
  pnjList: Pnj[];
  visibleHexsIds: string[];
  gold: number;
}

export const BOARD_TYPES: HEX_TYPE[][] = [
  [HEX_TYPE.GRASS, HEX_TYPE.GRASS, HEX_TYPE.GRASS],
  [HEX_TYPE.GRASS, HEX_TYPE.GRASS, HEX_TYPE.GRASS, HEX_TYPE.GRASS],
  [
    HEX_TYPE.GRASS,
    HEX_TYPE.GRASS,
    HEX_TYPE.GRASS,
    HEX_TYPE.GRASS,
    HEX_TYPE.GRASS
  ],
  [
    HEX_TYPE.GRASS,
    HEX_TYPE.GRASS,
    HEX_TYPE.GRASS,
    HEX_TYPE.GRASS,
    HEX_TYPE.GRASS,
    HEX_TYPE.GRASS
  ],
  [
    HEX_TYPE.GRASS,
    HEX_TYPE.GRASS,
    HEX_TYPE.GRASS,
    HEX_TYPE.GRASS,
    HEX_TYPE.GRASS,
    HEX_TYPE.GRASS,
    HEX_TYPE.DESERT
  ],
  [
    HEX_TYPE.GRASS,
    HEX_TYPE.GRASS,
    HEX_TYPE.GRASS,
    HEX_TYPE.GRASS,
    HEX_TYPE.DESERT,
    HEX_TYPE.DESERT
  ],
  [
    HEX_TYPE.GRASS,
    HEX_TYPE.GRASS,
    HEX_TYPE.DESERT,
    HEX_TYPE.DESERT,
    HEX_TYPE.DESERT
  ],
  [HEX_TYPE.GRASS, HEX_TYPE.DESERT, HEX_TYPE.DESERT, HEX_TYPE.DESERT],
  [HEX_TYPE.DESERT, HEX_TYPE.DESERT, HEX_TYPE.DESERT]
];

export const CITY_NAMES: string[] = [
  'Babylon',
  'Constantinople',
  'Alexandria',
  'Athens',
  'Sparta',
  'London',
  'Paris',
  'Rome',
  'Cairo'
];

export const PNJ_TYPES: PnjType[] = [
  {
    type: PNJ_TYPE.EXPLORER,
    goldCost: 2,
    maxHealthPoints: 0,
    attack: 0,
    defense: 0,
    movementRange: 2,
    visionRange: 2,
    attackRange: 1,
    abilities: [PNJ_ABILITY.MOVE_AFTER_KILL]
  },
  {
    type: PNJ_TYPE.SOLDIER,
    goldCost: 3,
    maxHealthPoints: 0,
    attack: 0,
    defense: 0,
    movementRange: 1,
    visionRange: 1,
    attackRange: 1,
    abilities: [PNJ_ABILITY.MOVE_AFTER_KILL]
  },
  {
    type: PNJ_TYPE.ARCHER,
    goldCost: 6,
    maxHealthPoints: 0,
    attack: 0,
    defense: 0,
    movementRange: 1,
    visionRange: 1,
    attackRange: 2,
    abilities: []
  },
  {
    type: PNJ_TYPE.GUARDIAN,
    goldCost: 8,
    maxHealthPoints: 0,
    attack: 0,
    defense: 0,
    movementRange: 1,
    visionRange: 1,
    attackRange: 1,
    abilities: []
  },
  {
    type: PNJ_TYPE.KNIGHT,
    goldCost: 12,
    maxHealthPoints: 0,
    attack: 0,
    defense: 0,
    movementRange: 2,
    visionRange: 1,
    attackRange: 1,
    abilities: [PNJ_ABILITY.MOVE_AFTER_KILL]
  }
];

export const BUILDING_TYPES: BuildingType[] = [
  {
    type: BUILDING_TYPE.WELL,
    goldCost: 3,
    goldEarnings: 1,
    allowedHexTypes: [HEX_TYPE.DESERT]
  },
  {
    type: BUILDING_TYPE.WINDMILL,
    goldCost: 3,
    goldEarnings: 1,
    allowedHexTypes: [HEX_TYPE.GRASS]
  },
  {
    type: BUILDING_TYPE.MARKET,
    goldCost: 4,
    goldEarnings: 2,
    allowedHexTypes: [HEX_TYPE.GRASS, HEX_TYPE.DESERT]
  },
  {
    type: BUILDING_TYPE.WOOD_CHOP,
    goldCost: 7,
    goldEarnings: 3,
    allowedHexTypes: [HEX_TYPE.GRASS]
  },
  {
    type: BUILDING_TYPE.GOLD_MINE,
    goldCost: 7,
    goldEarnings: 3,
    allowedHexTypes: [HEX_TYPE.DESERT]
  }
];

export enum SELECTED_HEX_ACTION {
  HEAL_ALLY = 'HEAL_ALLY',
  ATTACK_ENEMY = 'ATTACK_ENEMY',
  MOVE_PNJ = 'MOVE_PNJ',
  SELECT_PNJ = 'SELECT_PNJ',
  CLEAR_SELECTED_PNJ = 'CLEAR_SELECTED_PNJ',
  NO_ACTION = 'NO_ACTION',
  OPEN_SHOP = 'OPEN_SHOP',
  OPEN_BUILD_MENU = 'OPEN_BUILD_MENU'
}
