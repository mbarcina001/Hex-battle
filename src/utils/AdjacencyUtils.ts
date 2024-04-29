import { Hex } from '../components/Hex/Hex';

export interface Coords {
  x: number;
  y: number;
}

/**
 * Checks if given coordinates are in board boundaries
 * @param {Coords} coords
 * @returns {boolean}
 */
function checkCoordsInBoardBoundaries(coords: Coords): boolean {
  if (coords.x < 0 || coords.y < 0) {
    return false;
  }

  return true;
}

/**
 * Given a hex coords returns adjacent hexs coords in y axis
 * @param {Coords} coords
 * @returns {Coords[]}
 */
function getHorizontalAdjacentCoords(coords: Coords): Coords[] {
  return [
    {
      x: coords.x,
      y: coords.y - 1
    },
    {
      x: coords.x,
      y: coords.y + 1
    }
  ];
}

/**
 * Given a hex coords returns adjacent hexs coords in x axis
 * @param {Coords} coords
 * @returns {Coords[]}
 */
function getVerticalAdjacentCoords(coords: Coords): Coords[] {
  return [
    {
      x: coords.x - 1,
      y: coords.y
    },
    {
      x: coords.x + 1,
      y: coords.y
    }
  ];
}

/**
 * Given a hex coords returns adjacent hexs coords in diagonal
 * @param {Coords} coords
 * @param {Hex[][]} board
 * @returns {Coords[]}
 */
function getDiagonalAdjacentCoords(coords: Coords, board: Hex[][]): Coords[] {
  const mapHeight = board.length;
  const middleRow = Math.floor(mapHeight / 2);

  if (coords.y < middleRow) {
    return [
      {
        x: coords.x - 1,
        y: coords.y - 1
      },
      {
        x: coords.x + 1,
        y: coords.y + 1
      }
    ];
  }
  if (coords.y > middleRow) {
    return [
      {
        x: coords.x + 1,
        y: coords.y - 1
      },
      {
        x: coords.x - 1,
        y: coords.y + 1
      }
    ];
  }
  return [
    {
      x: coords.x - 1,
      y: coords.y - 1
    },
    {
      x: coords.x - 1,
      y: coords.y + 1
    }
  ];
}

/**
 * Parses pnj coords to Coords object
 * @param {Pnj} pnj
 * @returns {Coords}
 */
export function parseCoordsFromHexId(hexId: string): Coords {
  return {
    x: parseInt(hexId.split('_')[0], 10),
    y: parseInt(hexId.split('_')[1], 10)
  };
}

/**
 * Parses Coords object to string
 * @param {Pnj} pnj
 * @returns {strinh}
 */
export function parseHexIdFromCoords(coords: Coords): string {
  return `${coords.x}_${coords.y}`;
}

/**
 * Given a hex coords returns adjacent hexs coords
 * @param {string} hexId
 * @param {Hex[][]} board
 * @returns {string[]}
 */
export function getAdjacentHexIds(hexId: string, board: Hex[][]): string[] {
  const coords = parseCoordsFromHexId(hexId);
  let adjacentCoords: Coords[] = getHorizontalAdjacentCoords(coords).concat(
    getVerticalAdjacentCoords(coords),
    getDiagonalAdjacentCoords(coords, board)
  );
  adjacentCoords = adjacentCoords.filter((coordsToFilter) => (
    checkCoordsInBoardBoundaries(coordsToFilter)
  ));
  return adjacentCoords.map((coordsToMap) => parseHexIdFromCoords(coordsToMap));
}
