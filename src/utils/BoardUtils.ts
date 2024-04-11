import { BOARD_TYPES } from '../App.constants'
import { Hex } from '../components/Hex/Hex'

/**
 * Gets initial game board
 * @returns {Hex[][]}
 */
export function getInitialBoard (): Hex[][] {
  const board: Hex[][] = []
  BOARD_TYPES.forEach((_, idx) => {
    const row: Hex[] = []

    BOARD_TYPES[idx].forEach((_, jdx) => {
      row.push({
        id: `${jdx}_${idx}`,
        type: BOARD_TYPES[idx][jdx]
      })
    })

    board.push(row)
  })

  return board
}
