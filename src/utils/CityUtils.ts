import { Player } from '../App'
import { City } from '../components/City/City'

/**
 * Calculates if received city is enemy of received active player
 * @param {City} city
 * @param {Player} activePlayer
 * @returns {boolean}
 */
export function isEnemyCity (city: City, activePlayer: Player): boolean {
  return city.ownerId !== activePlayer.playerId
}

/**
 * Calculates if received city is ally of received active player
 * @param {City} city
 * @param {Player} activePlayer
 * @returns {boolean}
 */
export function isAllyCity (city: City, activePlayer: Player): boolean {
  return city.ownerId === activePlayer.playerId
}

/**
 * Gets hex's occupant city if any
 * @param {string} hexId
 * @param {Player[]} playerList
 * @returns {any}
 */
export function getCityInHex (hexId: string, playerList: Player[]) {
  for (const player of playerList) {
    for (const city of player.cityList) {
      if (city.hexLocationId === hexId) {
        return city
      }
    }
  }
}
