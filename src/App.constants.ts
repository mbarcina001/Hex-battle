export const MAX_HEALTH_POINTS = 10;

export enum HEX_TYPE {
  GRASS = 'GRASS',
  DESERT = 'DESERT'
}

export interface Hex {
  id: string;
  type: HEX_TYPE;
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

export enum PNJ_TYPE_NAME {
  NO_PNJ = 'NOOOOOOOO',
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
  typeName: PNJ_TYPE_NAME;
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
  type: PnjType;
  id: string;
  owner: Owner;
  canMove: boolean;
  hexLocationId: string;
  healthPoints: number;
}

export enum BUILDING_TYPE_NAME {
  WINDMILL = 'Windmill',
  WELL = 'Well',
  WOOD_CHOP = 'Wood chop',
  MARKET = 'Market',
  GOLD_MINE = 'Gold mine'
}

export interface Building {
  hexLocationId: string;
  type: BuildingType;
}

export interface BuildingType {
  typeName: BUILDING_TYPE_NAME;
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
  buildings: Building[];
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
    typeName: PNJ_TYPE_NAME.NO_PNJ,
    goldCost: 0,
    maxHealthPoints: 0,
    attack: 0,
    defense: 0,
    movementRange: 0,
    visionRange: 0,
    attackRange: 0,
    abilities: []
  },
  {
    typeName: PNJ_TYPE_NAME.EXPLORER,
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
    typeName: PNJ_TYPE_NAME.SOLDIER,
    goldCost: 3,
    maxHealthPoints: 20,
    attack: 7,
    defense: 2,
    movementRange: 1,
    visionRange: 1,
    attackRange: 1,
    abilities: [PNJ_ABILITY.MOVE_AFTER_KILL]
  },
  {
    typeName: PNJ_TYPE_NAME.ARCHER,
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
    typeName: PNJ_TYPE_NAME.GUARDIAN,
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
    typeName: PNJ_TYPE_NAME.KNIGHT,
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
    typeName: BUILDING_TYPE_NAME.WELL,
    goldCost: 3,
    goldEarnings: 1,
    allowedHexTypes: [HEX_TYPE.DESERT]
  },
  {
    typeName: BUILDING_TYPE_NAME.WINDMILL,
    goldCost: 3,
    goldEarnings: 1,
    allowedHexTypes: [HEX_TYPE.GRASS]
  },
  {
    typeName: BUILDING_TYPE_NAME.MARKET,
    goldCost: 4,
    goldEarnings: 2,
    allowedHexTypes: [HEX_TYPE.GRASS, HEX_TYPE.DESERT]
  },
  {
    typeName: BUILDING_TYPE_NAME.WOOD_CHOP,
    goldCost: 7,
    goldEarnings: 3,
    allowedHexTypes: [HEX_TYPE.GRASS]
  },
  {
    typeName: BUILDING_TYPE_NAME.GOLD_MINE,
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
