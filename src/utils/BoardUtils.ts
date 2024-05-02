import { Player } from '../App';
import { BOARD_TYPES } from '../App.constants';
import { SELECTED_HEX_ACTION, SelectedPnj } from '../components/Board/Board';
import { City } from '../components/City/City';
import { Hex } from '../components/Hex/Hex';
import { Pnj } from '../components/Pnj/Pnj';
import { getCityInHex } from './CityUtils';
import { isAllyPnj, isEnemyPnj } from './PnjUtils';

/**
 * Gets initial game board
 * @returns {Hex[][]}
 */
export function getInitialBoard(): Hex[][] {
  const board: Hex[][] = [];
  BOARD_TYPES.forEach((_, idx) => {
    const row: Hex[] = [];

    BOARD_TYPES[idx].forEach((__, jdx) => {
      row.push({
        id: `${jdx}_${idx}`,
        type: BOARD_TYPES[idx][jdx]
      });
    });

    board.push(row);
  });

  return board;
}

/**
 * Gets which action is triggered after selecting received hex
 * @returns {SELECTED_HEX_ACTION}
 */
export function getActionToTriggerInSelectedHex(
  selectedHexId: string,
  activePlayer: Player,
  cityList: City[],
  pnjInDestinationHex?: Pnj,
  selectedPnj?: SelectedPnj
): SELECTED_HEX_ACTION {
  if (
    selectedPnj?.whichPnj.canMove &&
    selectedPnj?.destinationHexs?.includes(selectedHexId)
  ) {
    if (pnjInDestinationHex && isAllyPnj(pnjInDestinationHex, activePlayer)) {
      return SELECTED_HEX_ACTION.HEAL_ALLY;
    } else if (
      pnjInDestinationHex &&
      isEnemyPnj(pnjInDestinationHex, activePlayer)
    ) {
      return SELECTED_HEX_ACTION.ATTACK_ENEMY;
    } else {
      return SELECTED_HEX_ACTION.MOVE_PNJ;
    }
  } else if (
    !pnjInDestinationHex &&
    getCityInHex(selectedHexId, cityList)?.owner?.id === activePlayer.playerId
  ) {
    return SELECTED_HEX_ACTION.OPEN_SHOP;
  } else if (
    pnjInDestinationHex &&
    isAllyPnj(pnjInDestinationHex, activePlayer) &&
    pnjInDestinationHex.canMove
  ) {
    return SELECTED_HEX_ACTION.SELECT_PNJ;
  } else {
    return SELECTED_HEX_ACTION.CLEAR_SELECTED_PNJ;
  }
}
