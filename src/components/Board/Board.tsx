import React, { ReactElement, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';

import HexComp, { Hex } from '../Hex/Hex';
import { Pnj } from '../Pnj/Pnj';

import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext';

import { getAdjacentHexIds } from '../../utils/AdjacencyUtils';
import {
  isEnemyPnj,
  isAllyPnj,
  getPnjInHex,
  healPnj,
  performAttack,
  performCounterAttack,
  withdrawPnj
} from '../../utils/PnjUtils';

import { Player } from '../../App';
import ActionMenu, { ACTION_ENUM } from '../ActionMenu/ActionMenu';

import { getCityInHex, isEnemyCity } from '../../utils/CityUtils';
import { findPlayerById } from '../../utils/PlayerUtils';

interface BoardProps {
  board: Hex[][];
  playerList: Player[];
  updatePlayers: (playerList: Player[]) => void;
  changeTurn: () => void;
}

export interface SelectedPnj {
  whichPnj: Pnj;
  destinationHexs: string[];
}

export interface VisibleHexsByPlayer {
  playerId: number;
  visibleHexsIds: string[];
}

function Board({
  board,
  playerList,
  updatePlayers,
  changeTurn
}: BoardProps): ReactElement {
  const [selectedHex, setSelectedHex] = useState<string>('');
  const [selectedPnj, setSelectedPnj] = useState<SelectedPnj | undefined>(
    undefined
  );
  const [actionList, setActionList] = useState<ACTION_ENUM[]>([]);

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
   * @param {Pnj} healerPnj
   * @param {Pnj} restoredPnj
   */
  function healAlly(healerPnj: Pnj, restoredPnj: Pnj): void {
    healPnj(healerPnj, restoredPnj);
    updatePlayers([activePlayer]);
  }

  /**
   * pnj attacks another pnj
   *  if kills => withdraw attacked pnj
   *  else => attacked pnj performs counter
   *    if kills => withdraw attacking pnj
   * @param {Pnj} attackingPnj
   * @param {Pnj} attackedPnj
   */
  function attackPnj(attackingPnj: Pnj, attackedPnj: Pnj): void {
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
   * @param {Pnj} pnjToMove
   */
  function movePnjToDestination(pnjToMove: Pnj): void {
    movePnj(pnjToMove, selectedHex);
    setSelectedHex('');
    setSelectedPnj(undefined);
    setActionList([]);
  }

  /**
   * Sets pnj to move next
   * @param {Pnj} SelectedPnj
   */
  function selectPnj(SelectedPnj: Pnj): void {
    setSelectedPnj({
      whichPnj: SelectedPnj,
      destinationHexs: getPnjAdjacentHexs(SelectedPnj)
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
        updatePlayers([activePlayer]);
      }
    }
  }

  /**
   * Trigger selected hex actions:
   *  - Show destination nodes if pnj is in hex
   */
  function triggerSelectedHexActions(): void {
    const pnjInDestinationHex = getPnjInHex(selectedHex, playerList);

    if (
      selectedPnj?.whichPnj.canMove &&
      selectedPnj?.destinationHexs?.includes(selectedHex)
    ) {
      if (pnjInDestinationHex && isAllyPnj(pnjInDestinationHex, activePlayer)) {
        healAlly(selectedPnj.whichPnj, pnjInDestinationHex);
      } else if (
        pnjInDestinationHex &&
        isEnemyPnj(pnjInDestinationHex, activePlayer)
      ) {
        attackPnj(selectedPnj.whichPnj, pnjInDestinationHex);
      } else {
        movePnjToDestination(selectedPnj.whichPnj);
      }

      setSelectedPnj(undefined);
      setSelectedHex('');
    } else if (
      pnjInDestinationHex &&
      isAllyPnj(pnjInDestinationHex, activePlayer) &&
      pnjInDestinationHex.canMove
    ) {
      selectPnj(pnjInDestinationHex);
    } else {
      setSelectedPnj(undefined);
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
          selectedPnj.whichPnj.healthPoints += 3;
          selectedPnj.whichPnj.canMove = false;
          updatePlayers([activePlayer]);
        }
        break;
      case ACTION_ENUM.CAPTURE_CITY:
        if (selectedPnj) {
          const cityInHex = getCityInHex(
            selectedPnj.whichPnj.hexLocationId,
            playerList
          );
          const playersToUpdate = [];

          if (cityInHex) {
            const owner = playerList.find(
              (player) => player.playerId === cityInHex?.owner.id
            );

            if (owner) {
              owner.cityList = owner.cityList.filter(
                (city) => city.id !== cityInHex.id
              );
              playersToUpdate.push(owner);
            }

            activePlayer.cityList.push(cityInHex);
            selectedPnj.whichPnj.canMove = false;
            playersToUpdate.push(activePlayer);
          }

          updatePlayers(playersToUpdate);
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
        playerList
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
    <Container>
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
                cityInHex={getCityInHex(boardHex.id, playerList)}
                setAsSelected={setSelectedHex}
              />
            </div>
          ))}
        </div>
      ))}
      <ActionMenu actionList={actionList} triggerAction={triggerAction} />
    </Container>
  );
}

export default Board;
