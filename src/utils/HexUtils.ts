import Utils from './Utils';
import { Hex } from '../App.constants';

/**
 * Class with utilities for Hexs
 */
export default class HexUtils {
  /**
   * Gets random hexLocationId from board
   * @param {Hex[]} board
   * @returns {string}
   */
  public static getRandomHexLocationId(board: Hex[][]): string {
    const yCoord = Utils.getRandomInt(board.length);
    const xCoord = Utils.getRandomInt(board[yCoord].length);
    return `${xCoord}_${yCoord}`;
  }
}
