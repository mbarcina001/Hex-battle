import { Player } from '../App';
import { City } from '../components/City/City';
import { Hex } from '../components/Hex/Hex';
import { Pnj } from '../components/Pnj/Pnj';
import { getAdjacentHexIds } from './AdjacencyUtils';
import { getRandomHexLocationId } from './HexUtils';

/**
 * Gets current active player
 * @param { Player[] } playerList
 * @param { number } activePlayerId
 * @returns { Player | undefined }
 */
export function getActivePlayer(
  playerList: Player[],
  activePlayerId: number,
): Player | undefined {
  if (!playerList.length || activePlayerId < 0) {
    return;
  }

  return playerList.find((player) => player.playerId === activePlayerId);
}

/**
 * Gets a player with given params, a city and a pnj
 * @param { number } playerId,
 * @param { string } playerColor
 * @returns {Player}
 */
export function getInitialPlayer(
  playerId: number,
  playerColor: string,
  board: Hex[][],
): Player {
  const firstCity: City = {
    id: `cit_${playerId}`,
    name: `City ${playerId}`,
    ownerId: playerId,
    hexLocationId: getRandomHexLocationId(board),
  };

  const firstPnj: Pnj = {
    type: 'any',
    id: `pnj_${playerId}`,
    owner: {
      id: playerId,
      color: playerColor,
    },
    hexLocationId: firstCity.hexLocationId,
    canMove: false,
    attack: 6,
    defense: 2,
    healthPoints: 10,
  };

  const visibleHexsIds: string[] = [firstPnj.hexLocationId].concat(
    getAdjacentHexIds(firstPnj.hexLocationId, board),
  );

  return {
    playerId,
    playerColor,
    pnjList: [firstPnj],
    cityList: [firstCity],
    visibleHexsIds,
  };
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
    cityList: [],
    visibleHexsIds: [],
  };
}
