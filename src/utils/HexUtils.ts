import { getRandomInt } from './Utils';
import { Hex } from '../App.constants';

/**
 * Gets random hexLocationId from board
 * @param {Hex[][]} board
 * @returns {string}
 */
export function getRandomHexLocationId(board: Hex[][]): string {
  const yCoord = getRandomInt(board.length);
  const xCoord = getRandomInt(board[yCoord].length);
  return `${xCoord}_${yCoord}`;
}
