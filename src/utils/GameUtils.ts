import { Player } from '../App';
import { City } from '../components/City/City';

/**
 * Sets winner if any
 * @returns { Player | undefined } - winner player
 */
export function checkWinner(
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
