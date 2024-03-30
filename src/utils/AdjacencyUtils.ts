export interface Coords {
  x: number,
  y: number
}

/**
 * Parses pnj coords to Coords object
 * @param {Pnj} pnj
 * @returns {Coords}
 */
export function parseCoordsFromHexId (hexId: string): Coords {
  return {
    x: parseInt(hexId.split('_')[0]),
    y: parseInt(hexId.split('_')[1])
  }
}

/**
 * Parses Coords object to string
 * @param {Pnj} pnj
 * @returns {strinh}
 */
export function parseHexIdFromCoords (coords: Coords): string {
  return `${coords.x}_${coords.y}`
}

/**
   * Given a hex coords returns adjacent hexs coords
   * @param {string} hexId
   * @param {string[][]} board
   * @returns {string[]}
   */
export function getAdjacentHexIds (hexId: string, board: string[][]): string[] {
  const coords = parseCoordsFromHexId(hexId)
  let adjacentCoords: Coords[] = _getHorizontalAdjacentCoords(coords).concat(
    _getVerticalAdjacentCoords(coords),
    _getDiagonalAdjacentCoords(coords, board)
  )
  adjacentCoords = adjacentCoords.filter(coords => _checkCoordsInBoardBoundaries(coords))
  return adjacentCoords.map(coords => parseHexIdFromCoords(coords))
}

/**
 * Given a hex coords returns adjacent hexs coords in y axis
 * @param {Coords} coords
 * @returns {Coords[]}
 */
function _getHorizontalAdjacentCoords (coords: Coords): Coords[] {
  return [
    {
      x: coords.x,
      y: coords.y - 1
    },
    {
      x: coords.x,
      y: coords.y + 1
    }
  ]
}

/**
 * Given a hex coords returns adjacent hexs coords in x axis
 * @param {Coords} coords
 * @returns {Coords[]}
 */
function _getVerticalAdjacentCoords (coords: Coords): Coords[] {
  return [
    {
      x: coords.x - 1,
      y: coords.y
    },
    {
      x: coords.x + 1,
      y: coords.y
    }
  ]
}

/**
 * Given a hex coords returns adjacent hexs coords in diagonal
 * @param {Coords} coords
   * @param {string[][]} board
 * @returns {Coords[]}
 */
function _getDiagonalAdjacentCoords (coords: Coords, board: string[][]): Coords[] {
  const mapHeight = board.length
  const middleRow = Math.floor(mapHeight / 2)
  console.log(middleRow)

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
    ]
  } else if (coords.y > middleRow) {
    return [
      {
        x: coords.x + 1,
        y: coords.y - 1
      },
      {
        x: coords.x - 1,
        y: coords.y + 1
      }
    ]
  } else {
    return [
      {
        x: coords.x - 1,
        y: coords.y - 1
      },
      {
        x: coords.x - 1,
        y: coords.y + 1
      }
    ]
  }
}

/**
 * Checks if given coordinates are in board boundaries
 * @param {Coords} coords
 * @returns {boolean}
 */
function _checkCoordsInBoardBoundaries (coords: Coords): boolean {
  if (coords.x < 0 || coords.y < 0) {
    return false
  }

  return true
}
