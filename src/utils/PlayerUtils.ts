import { Player, City, Hex, Pnj, PNJ_TYPE_NAME } from '../App.constants';
import AdjacencyUtils from './AdjacencyUtils';
import CityUtils from './CityUtils';
import PnjUtils from './PnjUtils';

/**
 * Class with utilities for Players
 */
export default class PlayerUtils {
  /**
   * Gets current active player
   * @param { Player[] } playerList
   * @param { number } activePlayerId
   * @returns { Player | undefined }
   */
  public static getActivePlayer(
    playerList: Player[],
    activePlayerId: number
  ): Player | undefined {
    if (!playerList.length || activePlayerId < 0) {
      return undefined;
    }

    return playerList.find((player) => player.playerId === activePlayerId);
  }

  /**
   * Gets a player with given params and a pnj.
   * It also assigns player as owner of a random unoccupied city
   * @param { number } playerId,
   * @param { string } playerColor
   * @param { Hex[] } board
   * @param { City[] } cityList
   * @returns {Player}
   */
  public static getInitialPlayer(
    playerId: number,
    playerColor: string,
    board: Hex[][],
    cityList: City[]
  ): Player {
    const firstCity: City = CityUtils.getEmptyCity(cityList);
    firstCity.owner = {
      id: playerId,
      color: playerColor
    };
    firstCity.isCapitalCity = true;

    const firstPnj: Pnj = {
      type: PnjUtils.getPnjTypeByName(PNJ_TYPE_NAME.SOLDIER),
      id: `pnj_${playerId}`,
      owner: {
        id: playerId,
        color: playerColor
      },
      hexLocationId: firstCity.hexLocationId,
      canMove: false,
      healthPoints: 10
    };

    const visibleHexsIds: string[] = [firstPnj.hexLocationId].concat(
      AdjacencyUtils.getAdjacentHexIds(firstPnj.hexLocationId, board)
    );

    return {
      playerId,
      playerColor,
      pnjList: [firstPnj],
      visibleHexsIds,
      gold: 0
    };
  }

  /**
   * Finds player in received player list
   * @param {Player[]} playerList
   * @param {number} playerId
   * @returns {Player | undefined}
   */
  public static findPlayerById(
    playerList: Player[],
    playerId: number
  ): Player | undefined {
    return playerList.find((player) => player.playerId === playerId);
  }

  /**
   * Returns a dummy player
   * @returns {Player}
   */
  public static getDummyPlayer(): Player {
    return {
      playerId: -1,
      playerColor: 'no-color',
      pnjList: [],
      visibleHexsIds: [],
      gold: 0
    };
  }

  /**
   * SHOW ME THE MONEY!
   *  Calculates received player's earnings at each turn
   * @param {Player} player
   * @param {City[]} cityList
   * @returns {number}
   */
  public static calculatePlayerGoldOnTurnStart(
    player: Player,
    cityList: City[]
  ): number {
    let gold = 0;

    cityList.forEach((city) => {
      if (CityUtils.isAllyCity(city, player)) {
        gold += CityUtils.calculateCityEarningsOnTurnStart(city);
      }
    });

    return gold;
  }
}
