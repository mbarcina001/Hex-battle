import { Hex } from '../App.constants';
import ArrayUtils from './ArrayUtils';

interface Coords {
  x: number;
  y: number;
}

/**
 * Class with utilities for calculating hex adjacencies
 */
export default class AdjacencyUtils {
  /**
   * Checks if given coordinates are in board boundaries
   * @param {Coords} coords
   * @returns {boolean}
   */
  public static _checkCoordsInBoardBoundaries(coords: Coords): boolean {
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
  public static _getHorizontalAdjacentCoords(coords: Coords): Coords[] {
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
  public static _getVerticalAdjacentCoords(coords: Coords): Coords[] {
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
   * @param {Hex[]} board
   * @returns {Coords[]}
   */
  public static _getDiagonalAdjacentCoords(
    coords: Coords,
    board: Hex[][]
  ): Coords[] {
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
   * Parses received coords to Coords object
   * @param {string} stringCoords
   * @returns {Coords}
   */
  public static parseCoordsFromHexId(stringCoords: string): Coords {
    return {
      x: parseInt(stringCoords.split('_')[0], 10),
      y: parseInt(stringCoords.split('_')[1], 10)
    };
  }

  /**
   * Parses Coords object to string
   * @param {Coords} coords
   * @returns {string}
   */
  public static parseHexIdFromCoords(coords: Coords): string {
    return `${coords.x}_${coords.y}`;
  }

  /**
   * Retrieves adjacent hex ids to received hexId given any range
   * @param {string} hexId
   * @param {Hex[]} board
   * @param {number} range
   * @returns {string[]}
   */
  public static getAdjacentHexIds(
    hexId: string,
    board: Hex[][],
    range = 1
  ): string[] {
    let adjacentHexIds: string[] = [];
    let hexsToCheck: string[] = [hexId];

    while (range > 0) {
      const loopResult = this._getAdjacentHexIdsFromArray(hexsToCheck, board);
      hexsToCheck = loopResult;
      adjacentHexIds = adjacentHexIds.concat(loopResult);

      range -= 1;
    }

    return adjacentHexIds;
  }

  /**
   * Given an hex ids array returns adjacent hexs ids
   * @param {string[]} hexIds
   * @param {Hex[]} board
   * @returns {string[]}
   */
  public static _getAdjacentHexIdsFromArray(
    hexIds: string[],
    board: Hex[][]
  ): string[] {
    let result: string[] = [];

    hexIds.forEach(
      (hexId) => (result = result.concat(this._getAdjacentHexIds(hexId, board)))
    );

    return ArrayUtils.filterRepeatedElements(result);
  }

  /**
   * Given a hex id returns adjacent hexs ids
   * @param {string} hexId
   * @param {Hex[]} board
   * @returns {string[]}
   */
  public static _getAdjacentHexIds(hexId: string, board: Hex[][]): string[] {
    const coords = this.parseCoordsFromHexId(hexId);
    let adjacentCoords: Coords[] = this._getHorizontalAdjacentCoords(
      coords
    ).concat(
      this._getVerticalAdjacentCoords(coords),
      this._getDiagonalAdjacentCoords(coords, board)
    );
    adjacentCoords = adjacentCoords.filter((coordsToFilter) =>
      this._checkCoordsInBoardBoundaries(coordsToFilter)
    );
    return adjacentCoords.map((coordsToMap) =>
      this.parseHexIdFromCoords(coordsToMap)
    );
  }
}
