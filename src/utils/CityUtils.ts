import { Player } from '../App';
import { City } from '../components/City/City';

/**
 * Calculates if received city is enemy of received active player
 * @param {City} city
 * @param {Player} activePlayer
 * @returns {boolean}
 */
export function isEnemyCity(city: City, activePlayer: Player): boolean {
  return city.ownerId !== activePlayer.playerId;
}

/**
 * Calculates if received city is ally of received active player
 * @param {City} city
 * @param {Player} activePlayer
 * @returns {boolean}
 */
export function isAllyCity(city: City, activePlayer: Player): boolean {
  return city.ownerId === activePlayer.playerId;
}

/**
 * Gets hex's occupant city from received pnjListif any
 * @param {string} hexId
 * @param {Player[]} playerList
 * @returns {City | undefined}
 */
export function _getCityFromListInHex(
  hexId: string,
  pnjList: City[]
): City | undefined {
  return pnjList.find((pnj) => {
    if (pnj.hexLocationId === hexId) {
      return pnj;
    }
    return undefined;
  });
}

/**
 * Gets hex's occupant city if any
 * @param {string} hexId
 * @param {Player[]} playerList
 * @returns {City | undefined}
 */
export function getCityInHex(
  hexId: string,
  playerList: Player[]
): City | undefined {
  // eslint-disable-next-line no-restricted-syntax
  for (const player of playerList) {
    const foundCity = _getCityFromListInHex(hexId, player.cityList);
    if (foundCity) {
      return foundCity;
    }
  }

  return undefined;
}
