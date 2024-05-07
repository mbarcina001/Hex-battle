import {
  BOARD_TYPES,
  Player,
  City,
  Hex,
  Pnj,
  SelectedPnj,
  SELECTED_HEX_ACTION
} from '../App.constants';
import { getCityInHex, isAllyCity } from './CityUtils';
import { isAllyPnj, isEnemyPnj } from './PnjUtils';
import { getAdjacentHexIds } from './AdjacencyUtils';

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
  board: Hex[][],
  pnjInDestinationHex?: Pnj,
  selectedPnj?: SelectedPnj
): SELECTED_HEX_ACTION {
  if (_canSelectedPnjMoveToSelectedHex(selectedHexId, selectedPnj)) {
    if (_canHealPnjInHex(activePlayer, pnjInDestinationHex)) {
      return SELECTED_HEX_ACTION.HEAL_ALLY;
    }

    if (_canAttackPnjInHex(activePlayer, pnjInDestinationHex)) {
      return SELECTED_HEX_ACTION.ATTACK_ENEMY;
    }

    return SELECTED_HEX_ACTION.MOVE_PNJ;
  }

  if (
    _destinationHexContainsUnoccupaidCity(
      selectedHexId,
      cityList,
      activePlayer,
      pnjInDestinationHex
    )
  ) {
    return SELECTED_HEX_ACTION.OPEN_SHOP;
  }

  if (
    _destinationHexCanOwnBuilding(
      selectedHexId,
      cityList,
      activePlayer,
      board,
      pnjInDestinationHex
    )
  ) {
    return SELECTED_HEX_ACTION.OPEN_BUILD_MENU;
  }

  if (
    _destinationHexContainsAllyPnjWhichCanMove(
      activePlayer,
      pnjInDestinationHex
    )
  ) {
    return SELECTED_HEX_ACTION.SELECT_PNJ;
  }

  return SELECTED_HEX_ACTION.CLEAR_SELECTED_PNJ;
}

function _canSelectedPnjMoveToSelectedHex(
  selectedHexId: string,
  selectedPnj?: SelectedPnj
): boolean {
  return (
    !!selectedPnj &&
    selectedPnj.whichPnj.canMove &&
    selectedPnj.destinationHexs.includes(selectedHexId)
  );
}

function _canHealPnjInHex(
  activePlayer: Player,
  pnjInDestinationHex?: Pnj
): boolean {
  return !!pnjInDestinationHex && isAllyPnj(pnjInDestinationHex, activePlayer);
}

function _canAttackPnjInHex(
  activePlayer: Player,
  pnjInDestinationHex?: Pnj
): boolean {
  return !!pnjInDestinationHex && isEnemyPnj(pnjInDestinationHex, activePlayer);
}

function _destinationHexContainsUnoccupaidCity(
  selectedHexId: string,
  cityList: City[],
  activePlayer: Player,
  pnjInDestinationHex?: Pnj
): boolean {
  return (
    !pnjInDestinationHex &&
    getCityInHex(selectedHexId, cityList)?.owner?.id === activePlayer.playerId
  );
}

function _destinationHexContainsAllyPnjWhichCanMove(
  activePlayer: Player,
  pnjInDestinationHex?: Pnj
): boolean {
  return (
    !!pnjInDestinationHex &&
    isAllyPnj(pnjInDestinationHex, activePlayer) &&
    pnjInDestinationHex.canMove
  );
}

function _destinationHexCanOwnBuilding(
  selectedHexId: string,
  cityList: City[],
  activePlayer: Player,
  board: Hex[][],
  pnjInDestinationHex?: Pnj
): boolean {
  return (
    !_checkIfHexContainsEnemyPnj(activePlayer, pnjInDestinationHex) &&
    _hexHasAdjacentAllyCity(selectedHexId, cityList, activePlayer, board)
  );
}

function _checkIfHexContainsEnemyPnj(
  activePlayer: Player,
  pnjInDestinationHex?: Pnj
): boolean {
  return !pnjInDestinationHex || isAllyPnj(pnjInDestinationHex, activePlayer);
}

function _hexHasAdjacentAllyCity(
  selectedHexId: string,
  cityList: City[],
  activePlayer: Player,
  board: Hex[][]
): boolean {
  const adjacentHexs = getAdjacentHexIds(selectedHexId, board);
  return adjacentHexs.some((hex) => {
    const cityInHex = getCityInHex(hex, cityList);
    return !!cityInHex && isAllyCity(cityInHex, activePlayer);
  });
}
