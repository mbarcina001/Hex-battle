import { Player } from '../App'

/**
 * Sets winner if any
 * @returns { Player | undefined } - winner player
 */
export function checkWinner (playerList: Player[]): Player | undefined {
  const alivePlayers = playerList.filter(player => player.cityList.length)
  if (alivePlayers.length === 1) {
    return alivePlayers[0]
  }
}
