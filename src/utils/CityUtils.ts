import { CITY_NAMES, Player, City, Hex, Building } from '../App.constants';
import AdjacencyUtils from './AdjacencyUtils';
import HexUtils from './HexUtils';
import Utils from './Utils';

/**
 * Class with utilities for cities
 */
export default class CityUtils {
  /**
   * Calculates if received city is enemy of received active player
   * @param {City} city
   * @param {Player} activePlayer
   * @returns {boolean}
   */
  public static isEnemyCity(city: City, activePlayer: Player): boolean {
    return city.owner?.id !== activePlayer.playerId;
  }

  /**
   * Calculates if received city is ally of received active player
   * @param {City} city
   * @param {Player} activePlayer
   * @returns {boolean}
   */
  public static isAllyCity(city: City, activePlayer: Player): boolean {
    return city.owner?.id === activePlayer.playerId;
  }

  /**
   * Gets hex's occupant city if any
   * @param {string} hexId
   * @param {City[]} cityList
   * @returns {City | undefined}
   */
  public static getCityInHex(
    hexId: string,
    cityList: City[]
  ): City | undefined {
    return cityList.find((city) => city.hexLocationId === hexId);
  }

  /**
   * Gets hex's occupant building if any
   * @param {string} hexId
   * @param {City[]} cityList
   * @returns {Building | undefined}
   */
  public static getBuildingInHex(
    hexId: string,
    cityList: City[]
  ): Building | undefined {
    for (const city of cityList) {
      const foundBuilding = city.buildings.find(
        (building) => building.hexLocationId === hexId
      );
      if (foundBuilding) {
        return foundBuilding;
      }
    }
  }

  /**
   * Changes received city ownership to receiving capturing player
   * @param {City} cityToCapture
   * @param {Player} capturingPlayer
   * @returns {void}
   */
  public static captureCity(
    cityToCapture: City,
    capturingPlayer: Player
  ): void {
    cityToCapture.owner = {
      id: capturingPlayer.playerId,
      color: capturingPlayer.playerColor
    };
  }

  /**
   * Gets random initial city for board
   * @param {City[]} alreadyExistingCities
   * @param {Hex[]} board
   * @returns {City}
   */
  public static getInitialCity(
    alreadyExistingCities: City[],
    board: Hex[][]
  ): City {
    return {
      name: this._getCityName(alreadyExistingCities),
      id: alreadyExistingCities.length.toString(),
      owner: undefined,
      isCapitalCity: false,
      hexLocationId: this._getCityLocationId(alreadyExistingCities, board),
      buildings: []
    };
  }

  /**
   * Retrieves a random location id with no city in its surroundings
   * @param {City[]} alreadyExistingCities
   * @param {Hex[]} board
   * @returns {string}
   */
  public static _getCityLocationId(
    alreadyExistingCities: City[],
    board: Hex[][]
  ): string {
    const cityLocationId = HexUtils.getRandomHexLocationId(board);
    return this._checkLocationOrSurroundingsOccupied(
      cityLocationId,
      alreadyExistingCities,
      board
    )
      ? this._getCityLocationId(alreadyExistingCities, board)
      : cityLocationId;
  }

  /**
   * Gets random city name that has not alrready been taken from constants file
   * @param {City[]} alreadyExistingCities
   * @returns {string}
   */
  public static _getCityName(alreadyExistingCities: City[]): string {
    const cityNameIndex = Utils.getRandomInt(CITY_NAMES.length - 1);
    const cityName = CITY_NAMES[cityNameIndex];
    return alreadyExistingCities.some((city) => city.name === cityName)
      ? this._getCityName(alreadyExistingCities)
      : cityName;
  }

  /**
   * Retrieves a random city with no owner
   * @param {City[]} cities
   * @returns {City}
   */
  public static getEmptyCity(cities: City[]): City {
    const cityIndex = Utils.getRandomInt(cities.length - 1);
    const city = cities[cityIndex];
    return !city.owner ? city : this.getEmptyCity(cities);
  }

  /**
   * Checks if received location or its surroundings have a city
   * @param {string} cityLocationId
   * @param {City[]} alreadyExistingCities
   * @param {Hex[]} board
   * @returns {boolean}
   */
  public static _checkLocationOrSurroundingsOccupied(
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

    const surroundingHexIds = AdjacencyUtils.getAdjacentHexIds(
      cityLocationId,
      board,
      2
    );

    return alreadyExistingCities.some((city) =>
      surroundingHexIds.includes(city.hexLocationId)
    );
  }

  /**
   * SHOW ME THE MOMNEY
   * Calculates received city earnings
   * @param {City} city
   * @returns {number}
   */
  public static calculateCityEarningsOnTurnStart(city: City): number {
    let gold = city.isCapitalCity ? 2 : 1;

    city.buildings.forEach((building) => {
      gold += building.type.goldEarnings;
    });

    return gold;
  }

  /**
   * Gets received hex's adjacent city if it has any
   * @param {string} hexId
   * @param {Hex[]} board
   * @param  {City[]} cityList
   * @returns {City | undefined}
   */
  public static getAdjacentCityIfAny(
    hexId: string,
    board: Hex[][],
    cityList: City[]
  ): City | undefined {
    const adjacentHexs = AdjacencyUtils.getAdjacentHexIds(hexId, board);

    for (const hex of adjacentHexs) {
      const cityInHex = this.getCityInHex(hex, cityList);
      if (cityInHex) {
        return cityInHex;
      }
    }

    return undefined;
  }
}
