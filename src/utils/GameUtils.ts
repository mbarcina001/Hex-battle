import { Player, City } from '../App.constants';

/**
 * Class with utilities for Game
 */
export default class GameUtils {
  /**
   * Sets winner if any
   * @param {Player[]} playerList
   * @param {City[]} cityList
   * @returns { Player | undefined } - winner player
   */
  public static checkWinner(
    playerList: Player[],
    cityList: City[]
  ): Player | undefined {
    const alivePlayers = [];

    for (const player of playerList) {
      if (cityList.some((city) => city.owner?.id === player.playerId)) {
        alivePlayers.push(player);
      }
    }

    if (alivePlayers.length === 1) {
      return alivePlayers[0];
    }

    return undefined;
  }
}
