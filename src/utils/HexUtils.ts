import { getRandomInt } from './Utils'
import { Hex } from '../components/Hex/Hex'

/**
 * Gets random hexLocationId from board
 * @param {Hex[][]} board
 * @returns {string}
 */
export function getRandomHexLocationId (board: Hex[][]) {
  const yCoord = getRandomInt(board.length)
  const xCoord = getRandomInt(board[yCoord].length)
  return `${xCoord}_${yCoord}`
}
