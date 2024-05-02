import { Player } from '../App';
import { CITY_NAMES } from '../App.constants';
import { City } from '../components/City/City';
import { Hex } from '../components/Hex/Hex';
import { getRandomHexLocationId } from './HexUtils';
import { getRandomInt } from './Utils';

/**
 * Calculates if received city is enemy of received active player
 * @param {City} city
 * @param {Player} activePlayer
 * @returns {boolean}
 */
export function isEnemyCity(city: City, activePlayer: Player): boolean {
  return city.owner?.id !== activePlayer.playerId;
}

/**
 * Calculates if received city is ally of received active player
 * @param {City} city
 * @param {Player} activePlayer
 * @returns {boolean}
 */
export function isAllyCity(city: City, activePlayer: Player): boolean {
  return city.owner?.id === activePlayer.playerId;
}

/**
 * Gets hex's occupant city if any
 * @param {string} hexId
 * @param {Player[]} playerList
 * @returns {City | undefined}
 */
export function getCityInHex(
  hexId: string,
  cityList: City[]
): City | undefined {
  return cityList.find((city) => city.hexLocationId === hexId);
}

/**
 * Changes received city ownership to receiving capturing player
 * @param {City} cityToCapture
 * @param {Player[]} playerList
 * @param {Player} capturingPlayer
 * @returns {Player[]}
 */
export function captureCity(
  cityToCapture: City,
  capturingPlayer: Player
): void {
  cityToCapture.owner = {
    id: capturingPlayer.playerId,
    color: capturingPlayer.playerColor
  };
}

export function getInitialCity(
  alreadyExistingCities: City[],
  board: Hex[][]
): City {
  return {
    name: _getCityName(alreadyExistingCities),
    id: alreadyExistingCities.length.toString(),
    owner: undefined,
    hexLocationId: _getCityLocationId(alreadyExistingCities, board)
  };
}

function _getCityLocationId(
  alreadyExistingCities: City[],
  board: Hex[][]
): string {
  const cityLocationId = getRandomHexLocationId(board);
  return alreadyExistingCities.some(
    (city) => city.hexLocationId === cityLocationId
  )
    ? _getCityLocationId(alreadyExistingCities, board)
    : cityLocationId;
}

function _getCityName(alreadyExistingCities: City[]): string {
  const cityNameIndex = getRandomInt(CITY_NAMES.length - 1);
  const cityName = CITY_NAMES[cityNameIndex];
  return alreadyExistingCities.some((city) => city.name === cityName)
    ? _getCityName(alreadyExistingCities)
    : cityName;
}

export function getEmptyCity(cities: City[]): City {
  const cityIndex = getRandomInt(cities.length - 1);
  const city = cities[cityIndex];
  return !city.owner ? city : getEmptyCity(cities);
}
