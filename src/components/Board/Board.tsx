import React, { ReactElement, useEffect, useState } from 'react';
import './Board.scss';

import HexComp from '../Hex/Hex';

import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext';

import { getAdjacentHexIds } from '../../utils/AdjacencyUtils';
import {
  getPnjInHex,
  healPnj,
  performAttack,
  performCounterAttack,
  withdrawPnj,
  healSelf
} from '../../utils/PnjUtils';

import {
  Player,
  City,
  Hex,
  Pnj,
  SelectedPnj,
  SELECTED_HEX_ACTION,
  BuildingType,
  PnjType
} from '../../App.constants';
import ActionMenu, { ACTION_ENUM } from '../ActionMenu/ActionMenu';

import {
  captureCity,
  getAdjacentCityIfAny,
  getCityInHex,
  getBuildingInHex,
  isEnemyCity
} from '../../utils/CityUtils';
import { findPlayerById } from '../../utils/PlayerUtils';
import { getActionToTriggerInSelectedHex } from '../../utils/BoardUtils';
import PnjMenu from '../PnjMenu/PnjMenu';
import BuildMenu from '../BuildMenu/BuildMenu';

interface BoardProps {
  board: Hex[][];
  cityList: City[];
  playerList: Player[];
  updatePlayers: (playerList: Player[]) => void;
  updateCities: (cityList: City[]) => void;
  changeTurn: () => void;
}

function Board({
  board,
  cityList,
  playerList,
  updatePlayers,
  updateCities,
  changeTurn
}: BoardProps): ReactElement {
  const [selectedHex, setSelectedHex] = useState<string>('');
  const [selectedPnj, setSelectedPnj] = useState<SelectedPnj | undefined>(
    undefined
  );
  const [actionList, setActionList] = useState<ACTION_ENUM[]>([]);
  const [showPnjMenu, setShowPnjMenu] = useState<boolean>(false);
  const [showBuildMenu, setShowBuildMenu] = useState<boolean>(false);

  const activePlayer = useActivePlayerContext();

  /**
   * Given a pnj returns an array with ids of its adjacent hexs
   * @param {Pnj} pnjInHex
   * @returns {string[]}
   */
  function getPnjAdjacentHexs(pnjInHex: Pnj): string[] {
    return getAdjacentHexIds(pnjInHex.hexLocationId, board);
  }

  /**
   * Heals received pnj
   * @param {Pnj | undefined} healerPnj
   * @param {Pnj | undefined} restoredPnj
   */
  function healAlly(healerPnj?: Pnj, restoredPnj?: Pnj): void {
    if (!healerPnj || !restoredPnj) {
      return;
    }
    healPnj(healerPnj, restoredPnj);
    updatePlayers([activePlayer]);
  }

  /**
   * pnj attacks another pnj
   *  if kills => withdraw attacked pnj
   *  else => attacked pnj performs counter
   *    if kills => withdraw attacking pnj
   * @param {Pnj | undefined} attackingPnj
   * @param {Pnj | undefined} attackedPnj
   */
  function attackPnj(attackingPnj?: Pnj, attackedPnj?: Pnj): void {
    if (!attackingPnj || !attackedPnj) {
      return;
    }

    const attackerOwner = findPlayerById(playerList, attackingPnj.owner.id);
    const defenderOwner = findPlayerById(playerList, attackedPnj.owner.id);

    if (!attackerOwner || !defenderOwner) {
      return;
    }

    let isPnjDead = performAttack(attackingPnj, attackedPnj);

    if (isPnjDead) {
      withdrawPnj(attackedPnj, defenderOwner);
      movePnj(attackingPnj, selectedHex, false);
      updatePlayers([activePlayer, defenderOwner]);
      return;
    }

    attackingPnj.canMove = false;
    isPnjDead = performCounterAttack(attackedPnj, attackingPnj);

    if (isPnjDead) {
      withdrawPnj(attackingPnj, attackerOwner);
    }

    updatePlayers([activePlayer, defenderOwner, attackerOwner]);
  }

  /**
   * Moves given pnj to selected hex
   * @param {Pnj | undefined} pnjToMove
   */
  function movePnjToDestination(pnjToMove?: Pnj): void {
    if (!pnjToMove) {
      return;
    }
    movePnj(pnjToMove, selectedHex);
    setSelectedHex('');
    setSelectedPnj(undefined);
    setActionList([]);
  }

  /**
   * Sets pnj to move next
   * @param {Pnj | undefined} selectedPnj
   */
  function selectPnj(selectedPnj?: Pnj): void {
    if (!selectedPnj) {
      return;
    }
    setSelectedPnj({
      whichPnj: selectedPnj,
      destinationHexs: getPnjAdjacentHexs(selectedPnj)
    });
  }

  /**
   * Moves received pnj to received location
   * @param {Pnj} selectedPnj
   * @param {string} locationToMove
   * @param {boolean} callUpdate
   */
  function movePnj(
    pnjToMove: Pnj,
    locationToMove: string,
    callUpdate = true
  ): void {
    pnjToMove.canMove = false;
    pnjToMove.hexLocationId = locationToMove;
    addNewVisibleHexsAfterMovement(locationToMove);

    if (callUpdate) {
      updatePlayers([activePlayer]);
    }
  }

  function addNewVisibleHexsAfterMovement(newLocation: string): void {
    for (const hexId of getAdjacentHexIds(newLocation, board)) {
      if (!activePlayer.visibleHexsIds.includes(hexId)) {
        activePlayer.visibleHexsIds.push(hexId);
      }
    }
    updatePlayers([activePlayer]);
  }

  /**
   * Trigger selected hex actions:
   *  - Show destination nodes if pnj is in hex
   */
  function triggerSelectedHexActions(): void {
    const pnjInDestinationHex = getPnjInHex(selectedHex, playerList);
    const actionToTrigger = getActionToTriggerInSelectedHex(
      selectedHex,
      activePlayer,
      cityList,
      board,
      pnjInDestinationHex,
      selectedPnj
    );
    setShowPnjMenu(false);
    setShowBuildMenu(false);

    switch (actionToTrigger) {
      case SELECTED_HEX_ACTION.HEAL_ALLY:
        healAlly(selectedPnj?.whichPnj, pnjInDestinationHex);
        setSelectedPnj(undefined);
        setSelectedHex('');
        break;
      case SELECTED_HEX_ACTION.ATTACK_ENEMY:
        attackPnj(selectedPnj?.whichPnj, pnjInDestinationHex);
        setSelectedPnj(undefined);
        setSelectedHex('');
        break;
      case SELECTED_HEX_ACTION.MOVE_PNJ:
        movePnjToDestination(selectedPnj?.whichPnj);
        setSelectedPnj(undefined);
        setSelectedHex('');
        break;
      case SELECTED_HEX_ACTION.SELECT_PNJ:
        selectPnj(pnjInDestinationHex);
        break;
      case SELECTED_HEX_ACTION.CLEAR_SELECTED_PNJ:
        setSelectedPnj(undefined);
        break;
      case SELECTED_HEX_ACTION.OPEN_SHOP:
        setShowPnjMenu(true);
        break;
      case SELECTED_HEX_ACTION.OPEN_BUILD_MENU:
        setShowBuildMenu(true);
        break;
      default:
        break;
    }
  }

  /**
   * Triggers received action
   * @param {ACTION_ENUM} action
   */
  function triggerAction(action: ACTION_ENUM): void {
    switch (action) {
      case ACTION_ENUM.HEAL_ACTIVE_PNJ:
        if (selectedPnj) {
          healSelf(selectedPnj.whichPnj);
          updatePlayers([activePlayer]);
        }
        break;
      case ACTION_ENUM.CAPTURE_CITY:
        if (!selectedPnj) {
          break;
        }
        const cityToCapture = getCityInHex(
          selectedPnj.whichPnj.hexLocationId,
          cityList
        );

        if (cityToCapture) {
          captureCity(cityToCapture, activePlayer);
          selectedPnj.whichPnj.canMove = false;
        }

        break;
      case ACTION_ENUM.END_TURN:
        changeTurn();
        break;
      default:
        break;
    }

    setSelectedPnj(undefined);
    setSelectedHex('');
  }

  function purchaseBuilding(buildingType: BuildingType): void {
    const cityToUpgrade = getAdjacentCityIfAny(selectedHex, board, cityList);

    if (cityToUpgrade) {
      cityToUpgrade.buildings.push({
        hexLocationId: selectedHex,
        type: buildingType
      });
      updateCities([cityToUpgrade]);

      activePlayer.gold -= buildingType.goldCost;
      updatePlayers([activePlayer]);
    }
  }

  function purchasePnj(pnj: PnjType): void {
    activePlayer.gold -= pnj.goldCost;
    activePlayer.pnjList.push({
      type: pnj.type,
      id: `pnj_999`, // TODO: GIVE UNIQUE ID
      owner: {
        id: activePlayer.playerId,
        color: activePlayer.playerColor
      },
      hexLocationId: selectedHex,
      canMove: false,
      attack: pnj.attack,
      defense: pnj.defense,
      healthPoints: pnj.maxHealthPoints
    });
    updatePlayers([activePlayer]);
  }

  useEffect(() => {
    setActionList([]);
    setSelectedHex('');
  }, [activePlayer]);

  useEffect(() => {
    const actions = [];
    if (selectedPnj) {
      actions.push(ACTION_ENUM.HEAL_ACTIVE_PNJ);

      const cityInHex = getCityInHex(
        selectedPnj.whichPnj.hexLocationId,
        cityList
      );
      if (cityInHex && isEnemyCity(cityInHex, activePlayer)) {
        actions.push(ACTION_ENUM.CAPTURE_CITY);
      }
    }

    setActionList(actions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPnj]);

  useEffect(() => {
    triggerSelectedHexActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHex]);

  return (
    <>
      {board?.map((boardRow) => (
        <div className="d-flex justify-content-md-center" key={boardRow[0].id}>
          {boardRow.map((boardHex) => (
            <div key={boardHex.id}>
              <HexComp
                hex={boardHex}
                isSelected={selectedHex === boardHex.id}
                isDestinationHex={
                  selectedPnj?.destinationHexs?.includes(boardHex.id) ?? false
                }
                pnjInHex={getPnjInHex(boardHex.id, playerList)}
                cityInHex={getCityInHex(boardHex.id, cityList)}
                buildingInHex={getBuildingInHex(boardHex.id, cityList)}
                setAsSelected={setSelectedHex}
              />
            </div>
          ))}
        </div>
      ))}

      <div className="right-menu">
        <ActionMenu actionList={actionList} triggerAction={triggerAction} />
        {showPnjMenu ? <PnjMenu purchasePnj={purchasePnj} /> : ''}
        {showBuildMenu ? <BuildMenu purchaseBuilding={purchaseBuilding} /> : ''}
      </div>
    </>
  );
}

export default Board;
