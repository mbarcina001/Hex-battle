import React, { ReactElement, useEffect, useState } from 'react';
import './Board.scss';

import HexComp from '../Hex/Hex';

import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext';

import AdjacencyUtils from '../../utils/AdjacencyUtils';
import PnjUtils from '../../utils/PnjUtils';
import CityUtils from '../../utils/CityUtils';
import BoardUtils from '../../utils/BoardUtils';
import PlayerUtils from '../../utils/PlayerUtils';

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

/**
 * Component that displays game board
 * @param {BoardProps} props
 * @returns {ReactElement}
 */
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
    return AdjacencyUtils.getAdjacentHexIds(pnjInHex.hexLocationId, board);
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
    PnjUtils.healPnj(healerPnj, restoredPnj);
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

    const attackerOwner = PlayerUtils.findPlayerById(
      playerList,
      attackingPnj.owner.id
    );
    const defenderOwner = PlayerUtils.findPlayerById(
      playerList,
      attackedPnj.owner.id
    );

    if (!attackerOwner || !defenderOwner) {
      return;
    }

    let isPnjDead = PnjUtils.performAttack(attackingPnj, attackedPnj);

    if (isPnjDead) {
      PnjUtils.withdrawPnj(attackedPnj, defenderOwner);
      movePnj(attackingPnj, selectedHex, false);
      updatePlayers([activePlayer, defenderOwner]);
      return;
    }

    attackingPnj.canMove = false;
    isPnjDead = PnjUtils.performCounterAttack(attackedPnj, attackingPnj);

    if (isPnjDead) {
      PnjUtils.withdrawPnj(attackingPnj, attackerOwner);
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
   * @param {Pnj} pnjToMove
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

  /**
   * Retrieves new visibles hexs after Player moves a Pnj and adds them to visibles hexs list
   * @param {string} newLocation
   */
  function addNewVisibleHexsAfterMovement(newLocation: string): void {
    for (const hexId of AdjacencyUtils.getAdjacentHexIds(newLocation, board)) {
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
    const pnjInDestinationHex = PnjUtils.getPnjInHex(selectedHex, playerList);
    const actionToTrigger = BoardUtils.getActionToTriggerInSelectedHex(
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
          PnjUtils.healSelf(selectedPnj.whichPnj);
          updatePlayers([activePlayer]);
        }
        break;
      case ACTION_ENUM.CAPTURE_CITY:
        if (!selectedPnj) {
          break;
        }
        const cityToCapture = CityUtils.getCityInHex(
          selectedPnj.whichPnj.hexLocationId,
          cityList
        );

        if (cityToCapture) {
          CityUtils.captureCity(cityToCapture, activePlayer);
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

  /**
   * Adds new building of received type to selected hex's adjacent city
   * @param {BuildingType} buildingType
   */
  function purchaseBuilding(buildingType: BuildingType): void {
    const cityToUpgrade = CityUtils.getAdjacentCityIfAny(
      selectedHex,
      board,
      cityList
    );

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

  /**
   * Adds new Pnj of received type to active Player's pnj list
   * @param {PnjType} pnjType
   */
  function purchasePnj(pnjType: PnjType): void {
    activePlayer.gold -= pnjType.goldCost;
    activePlayer.pnjList.push({
      type: pnjType,
      id: `pnj_999`, // TODO: GIVE UNIQUE ID
      owner: {
        id: activePlayer.playerId,
        color: activePlayer.playerColor
      },
      hexLocationId: selectedHex,
      canMove: false,
      healthPoints: pnjType.maxHealthPoints
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

      const cityInHex = CityUtils.getCityInHex(
        selectedPnj.whichPnj.hexLocationId,
        cityList
      );
      if (cityInHex && CityUtils.isEnemyCity(cityInHex, activePlayer)) {
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
                pnjInHex={PnjUtils.getPnjInHex(boardHex.id, playerList)}
                cityInHex={CityUtils.getCityInHex(boardHex.id, cityList)}
                buildingInHex={CityUtils.getBuildingInHex(
                  boardHex.id,
                  cityList
                )}
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
