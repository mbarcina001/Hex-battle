import {
  BOARD_TYPES,
  Player,
  City,
  Hex,
  Pnj,
  SelectedPnj,
  SELECTED_HEX_ACTION
} from '../App.constants';
import CityUtils from './CityUtils';
import PnjUtils from './PnjUtils';

/**
 * Class with utilities for board
 */
export default class BoardUtils {
  /**
   * Gets initial game board
   * @returns {Hex[]}
   */
  public static getInitialBoard(): Hex[][] {
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
   * @param {string} selectedHexId
   * @param {Player} activePlayer
   * @param {City[]} cityList
   * @param {Hex[]} board
   * @param {Pnj | undefined} pnjInDestinationHex
   * @param {SelectedPnj | undefined} selectedPnj
   * @returns {SELECTED_HEX_ACTION}
   */
  public static getActionToTriggerInSelectedHex(
    selectedHexId: string,
    activePlayer: Player,
    cityList: City[],
    board: Hex[][],
    pnjInDestinationHex?: Pnj,
    selectedPnj?: SelectedPnj
  ): SELECTED_HEX_ACTION {
    if (this._canSelectedPnjMoveToSelectedHex(selectedHexId, selectedPnj)) {
      if (this._canHealPnjInHex(activePlayer, pnjInDestinationHex)) {
        return SELECTED_HEX_ACTION.HEAL_ALLY;
      }

      if (this._canAttackPnjInHex(activePlayer, pnjInDestinationHex)) {
        return SELECTED_HEX_ACTION.ATTACK_ENEMY;
      }

      return SELECTED_HEX_ACTION.MOVE_PNJ;
    }

    if (
      this._destinationHexContainsAllyPnjWhichCanMove(
        activePlayer,
        pnjInDestinationHex
      )
    ) {
      return SELECTED_HEX_ACTION.SELECT_PNJ;
    }

    if (
      this._destinationHexContainsAllyCity(
        selectedHexId,
        cityList,
        activePlayer,
        pnjInDestinationHex
      )
    ) {
      return SELECTED_HEX_ACTION.OPEN_SHOP;
    }

    if (
      this._destinationHexCanOwnBuilding(
        selectedHexId,
        cityList,
        activePlayer,
        board,
        pnjInDestinationHex
      )
    ) {
      return SELECTED_HEX_ACTION.OPEN_BUILD_MENU;
    }

    return SELECTED_HEX_ACTION.CLEAR_SELECTED_PNJ;
  }

  /**
   * Checks if selected Pnj can move to selected Hex
   * @param {string} selectedHexId
   * @param {SelectedPnj} selectedPnj
   * @returns {boolean}
   */
  public static _canSelectedPnjMoveToSelectedHex(
    selectedHexId: string,
    selectedPnj?: SelectedPnj
  ): boolean {
    return (
      !!selectedPnj &&
      selectedPnj.whichPnj.canMove &&
      selectedPnj.destinationHexs.includes(selectedHexId)
    );
  }

  /**
   * Checks if Pnj in destination hex can be healed by active P^layer
   * @param {Player} activePlayer
   * @param {Pnj | undefined} pnjInDestinationHex
   * @returns {boolean}
   */
  public static _canHealPnjInHex(
    activePlayer: Player,
    pnjInDestinationHex?: Pnj
  ): boolean {
    return (
      !!pnjInDestinationHex &&
      PnjUtils.isAllyPnj(pnjInDestinationHex, activePlayer)
    );
  }

  /**
   * Checks if Pnj in destination hex can be attacked by active P^layer
   * @param {Player} activePlayer
   * @param {Pnj | undefined} pnjInDestinationHex
   * @returns {boolean}
   */
  public static _canAttackPnjInHex(
    activePlayer: Player,
    pnjInDestinationHex?: Pnj
  ): boolean {
    return (
      !!pnjInDestinationHex &&
      PnjUtils.isEnemyPnj(pnjInDestinationHex, activePlayer)
    );
  }

  /**
   * Checks if destination Hex contains an city with no Owner + no enemy is in it
   * @param {string} selectedHexId
   * @param {City[]} cityList
   * @param {Player} activePlayer
   * @param {Pnj} pnjInDestinationHex
   * @returns {boolean}
   */
  public static _destinationHexContainsAllyCity(
    selectedHexId: string,
    cityList: City[],
    activePlayer: Player,
    pnjInDestinationHex?: Pnj
  ): boolean {
    if (
      pnjInDestinationHex &&
      PnjUtils.isEnemyPnj(pnjInDestinationHex, activePlayer)
    ) {
      return false;
    }

    const cityInHex = CityUtils.getCityInHex(selectedHexId, cityList);

    return !!cityInHex && CityUtils.isAllyCity(cityInHex, activePlayer);
  }

  /**
   * Checks if selected hex contains a Pnj belonging active Player that can move
   * @param {Player} activePlayer
   * @param {Pnj | undefined} pnjInDestinationHex
   * @returns {boolean}
   */
  public static _destinationHexContainsAllyPnjWhichCanMove(
    activePlayer: Player,
    pnjInDestinationHex?: Pnj
  ): boolean {
    return (
      !!pnjInDestinationHex &&
      PnjUtils.isAllyPnj(pnjInDestinationHex, activePlayer) &&
      pnjInDestinationHex.canMove
    );
  }

  /**
   * Checks if destination hex can have a building. True if:
   *  - Has a adjacent City
   *  - City is owned by active Player
   *  - Hex is not ocuppied by an enemy Pnj
   * @param {string} selectedHexId
   * @param {City[]} cityList
   * @param {Player} activePlayer
   * @param {Hex[]} board
   * @param {Pnj | undefined} pnjInDestinationHex
   * @returns {boolean}
   */
  public static _destinationHexCanOwnBuilding(
    selectedHexId: string,
    cityList: City[],
    activePlayer: Player,
    board: Hex[][],
    pnjInDestinationHex?: Pnj
  ): boolean {
    return (
      !this._checkIfHexContainsEnemyPnj(activePlayer, pnjInDestinationHex) &&
      this._hexHasAdjacentAllyCity(selectedHexId, cityList, activePlayer, board)
    );
  }

  /**
   * Checks if received Pnj is an enemy Pnj
   * @param {Player} activePlayer
   * @param {Pnj} pnjInDestinationHex
   * @returns {boolean}
   */
  public static _checkIfHexContainsEnemyPnj(
    activePlayer: Player,
    pnjInDestinationHex?: Pnj
  ): boolean {
    return (
      !!pnjInDestinationHex &&
      PnjUtils.isEnemyPnj(pnjInDestinationHex, activePlayer)
    );
  }

  /**
   * Checks if received hex has an adjacent City owned by active Player
   * @param {string} selectedHexId
   * @param {City []} cityList
   * @param {Player} activePlayer
   * @param {Hex[]} board
   * @returns {boolean}
   */
  public static _hexHasAdjacentAllyCity(
    selectedHexId: string,
    cityList: City[],
    activePlayer: Player,
    board: Hex[][]
  ): boolean {
    const adjacentCity = CityUtils.getAdjacentCityIfAny(
      selectedHexId,
      board,
      cityList
    );
    return !!adjacentCity && CityUtils.isAllyCity(adjacentCity, activePlayer);
  }
}
