import './App.scss';
import React, { useState, useEffect, ReactElement } from 'react';
import * as _ from 'lodash';
import Board from './components/Board/Board';

import { ActivePlayerContext } from './context/ActivePlayerContext/ActivePlayerContext';
import { Hex } from './components/Hex/Hex';
import { City } from './components/City/City';
import { Pnj } from './components/Pnj/Pnj';

import { getInitialBoard } from './utils/BoardUtils';
import {
  getActivePlayer,
  getDummyPlayer,
  getInitialPlayer
} from './utils/PlayerUtils';
import { checkWinner } from './utils/GameUtils';
import TurnCounter from './components/TurnCounter/TurnCounter';
import { getInitialCity } from './utils/CityUtils';

export interface Player {
  playerId: number;
  playerColor: string;
  pnjList: Pnj[];
  visibleHexsIds: string[];
}

function App(): ReactElement {
  const [activePlayerId, setActivePlayerId] = useState<number>(-1);
  const [playerList, setPlayerList] = useState<Player[]>([]);
  const [actualTurn, setActualTurn] = useState<number>(1);
  const [winner, setWinner] = useState<Player | undefined>(undefined);
  const [board, setBoard] = useState<Hex[][]>([]);
  const [cityList, setCityList] = useState<City[]>([]);

  /**
   * Auxiliar function that initializes city list
   */
  function initializeCityList(): void {
    const cities: City[] = [];

    cities.push(getInitialCity(cities, board));
    cities.push(getInitialCity(cities, board));
    cities.push(getInitialCity(cities, board));
    cities.push(getInitialCity(cities, board));

    setCityList(cities);
  }

  /**
   * Auxiliar function that initializes player list
   */
  function intializePlayerList(): void {
    const players: Player[] = [
      getInitialPlayer(1, 'red', board, cityList),
      getInitialPlayer(2, 'blue', board, cityList)
    ];

    setPlayerList(players);
    setActivePlayerId(players[0].playerId);
  }

  /**
   * Changes current turn to the next player
   *  If current player is last player => increase turn number
   * @returns { void }
   */
  function changeTurn(): void {
    const winPlayer = checkWinner(playerList, cityList);
    if (winPlayer) {
      setWinner(winPlayer);
      return;
    }

    const activePlayerIndex = playerList.findIndex(
      (player) => player.playerId === activePlayerId
    );
    const isLastPlayerInTurn = activePlayerIndex + 1 === playerList.length;

    if (isLastPlayerInTurn) {
      setActualTurn(actualTurn + 1);
      setActivePlayerId(playerList[0].playerId);
    } else {
      const newActivePlayerId = playerList[activePlayerIndex + 1].playerId;
      setActivePlayerId(newActivePlayerId);
    }
  }

  /**
   * Updates every received player
   * @param {Player[]} playerToUpdateArr
   */
  function updatePlayers(playerToUpdateArr: Player[]): void {
    const playerListCopy = _.cloneDeep(playerList);

    playerToUpdateArr.forEach((playerToUpdate: Player) => {
      updatePlayer(playerListCopy, playerToUpdate);
    });

    setPlayerList(playerListCopy);
  }

  /**
   * Updates received player in player list
   * @param {Player[]} playerListToUpdate
   * @param {Player} playerToUpdate
   */
  function updatePlayer(
    playerListToUpdate: Player[],
    playerToUpdate: Player
  ): void {
    const playerToUpdateIdx = playerListToUpdate.findIndex(
      (player) => player.playerId === playerToUpdate.playerId
    );

    if (playerToUpdateIdx >= 0) {
      playerListToUpdate[playerToUpdateIdx] = playerToUpdate;
    }
  }

  /**
   * Shows winner if any; else shows board
   * @returns {ReactElement}
   */
  function getMainContent(): ReactElement {
    return winner ? (
      <p>{`Winner: Player ${winner.playerId}`}</p>
    ) : (
      <Board
        board={board}
        cityList={cityList}
        playerList={playerList}
        updatePlayers={updatePlayers}
        changeTurn={changeTurn}
      />
    );
  }

  useEffect(() => {
    setBoard(getInitialBoard);
  }, []);

  useEffect(() => {
    if (board?.length) {
      initializeCityList();
    }
  }, [board]);

  useEffect(() => {
    if (board?.length && cityList.length) {
      intializePlayerList();
    }
  }, [board, cityList]);

  useEffect(() => {
    const playerListCopy = _.cloneDeep(playerList);
    const activePlayerIdx = playerListCopy.findIndex(
      (player) => player.playerId === activePlayerId
    );

    if (
      activePlayerIdx >= 0 &&
      playerListCopy[activePlayerIdx]?.pnjList?.length
    ) {
      const updatedPnjList = playerListCopy[activePlayerIdx].pnjList.map(
        (pnj) => ({
          ...pnj,
          canMove: true
        })
      );
      playerListCopy[activePlayerIdx].pnjList = updatedPnjList;
      setPlayerList(playerListCopy);
    }
  }, [activePlayerId]);

  return (
    <ActivePlayerContext.Provider
      value={getActivePlayer(playerList, activePlayerId) ?? getDummyPlayer()}
    >
      <TurnCounter turnNumber={actualTurn}></TurnCounter>

      <div className="main-content">{getMainContent()}</div>
    </ActivePlayerContext.Provider>
  );
}

export default App;
