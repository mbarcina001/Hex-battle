import { STARTING_GOLD, Player, City, Hex, Pnj } from '../App.constants';
import { getAdjacentHexIds } from './AdjacencyUtils';
import { getEmptyCity } from './CityUtils';

/**
 * Gets current active player
 * @param { Player[] } playerList
 * @param { number } activePlayerId
 * @returns { Player | undefined }
 */
export function getActivePlayer(
  playerList: Player[],
  activePlayerId: number
): Player | undefined {
  if (!playerList.length || activePlayerId < 0) {
    return undefined;
  }

  return playerList.find((player) => player.playerId === activePlayerId);
}

/**
 * Gets a player with given params, a city and a pnj
 * @param { number } playerId,
 * @param { string } playerColor
 * @param { Hex[] } board
 * @returns {Player}
 */
export function getInitialPlayer(
  playerId: number,
  playerColor: string,
  board: Hex[][],
  cityList: City[]
): Player {
  const firstCity: City = getEmptyCity(cityList);
  firstCity.owner = {
    id: playerId,
    color: playerColor
  };

  const firstPnj: Pnj = {
    type: 'any',
    id: `pnj_${playerId}`,
    owner: {
      id: playerId,
      color: playerColor
    },
    hexLocationId: firstCity.hexLocationId,
    canMove: false,
    attack: 6,
    defense: 2,
    healthPoints: 10
  };

  const visibleHexsIds: string[] = [firstPnj.hexLocationId].concat(
    getAdjacentHexIds(firstPnj.hexLocationId, board)
  );

  return {
    playerId,
    playerColor,
    pnjList: [firstPnj],
    visibleHexsIds,
    gold: STARTING_GOLD
  };
}

/**
 * Finds player in received player list
 * @param {Player[]} playerList
 * @param {number} playerId
 * @returns {Player | undefined}
 */
export function findPlayerById(
  playerList: Player[],
  playerId: number
): Player | undefined {
  return playerList.find((player) => player.playerId === playerId);
}

/**
 * Returns a dummy player
 * @returns {Player}
 */
export function getDummyPlayer(): Player {
  return {
    playerId: -1,
    playerColor: 'no-color',
    pnjList: [],
    visibleHexsIds: [],
    gold: 0
  };
}
