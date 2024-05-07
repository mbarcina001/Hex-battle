import { CITY_NAMES, Player, City, Hex } from '../App.constants';
import { getAdjacentHexIds } from './AdjacencyUtils';
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
    isCapitalCity: false,
    hexLocationId: _getCityLocationId(alreadyExistingCities, board),
    buildings: []
  };
}

function _getCityLocationId(
  alreadyExistingCities: City[],
  board: Hex[][]
): string {
  const cityLocationId = getRandomHexLocationId(board);
  return _checkLocationOrSurroundingsOccupied(
    cityLocationId,
    alreadyExistingCities,
    board
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

/**
 * Checks if received location or its surroundings have a city
 * @returns {boolean}
 */
export function _checkLocationOrSurroundingsOccupied(
  cityLocationId: string,
  alreadyExistingCities: City[],
  board: Hex[][]
): boolean {
  const locationOccupied = alreadyExistingCities.some(
    (city) => city.hexLocationId === cityLocationId
  );

  if (locationOccupied) {
    return true;
  }

  const surroundingHexIds = getAdjacentHexIds(cityLocationId, board, 2);

  return alreadyExistingCities.some((city) =>
    surroundingHexIds.includes(city.hexLocationId)
  );
}

export function calculateCityEarningsOnTurnStart(city: City): number {
  let gold = city.isCapitalCity ? 2 : 1;

  city.buildings.forEach((building) => {
    gold += building.goldEarnings;
  });

  return gold;
}
