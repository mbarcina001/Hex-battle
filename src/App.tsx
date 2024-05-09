import './App.scss';
import React, { useState, useEffect, ReactElement } from 'react';
import * as _ from 'lodash';
import Board from './components/Board/Board';

import { ActivePlayerContext } from './context/ActivePlayerContext/ActivePlayerContext';
import { Hex, City, Player } from './App.constants';

import BoardUtils from './utils/BoardUtils';
import CityUtils from './utils/CityUtils';
import GameUtils from './utils/GameUtils';
import PlayerUtils from './utils/PlayerUtils';

import TurnCounter from './components/TurnCounter/TurnCounter';

/**
 * Main app component
 * @returns {ReactElement}
 */
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

    cities.push(CityUtils.getInitialCity(cities, board));
    cities.push(CityUtils.getInitialCity(cities, board));
    cities.push(CityUtils.getInitialCity(cities, board));
    cities.push(CityUtils.getInitialCity(cities, board));

    setCityList(cities);
  }

  /**
   * Auxiliar function that initializes player list
   */
  function intializePlayerList(): void {
    const players: Player[] = [
      PlayerUtils.getInitialPlayer(1, 'red', board, cityList),
      PlayerUtils.getInitialPlayer(2, 'blue', board, cityList)
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
    const winPlayer = GameUtils.checkWinner(playerList, cityList);
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
   * Updates received players in main player list
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
   * Updates every received city
   * @param {City[]} cityToUpdateArr
   */
  function updateCities(cityToUpdateArr: City[]): void {
    const cityListCopy = _.cloneDeep(cityList);

    cityToUpdateArr.forEach((cityToUpdate: City) => {
      updateCity(cityListCopy, cityToUpdate);
    });

    setCityList(cityListCopy);
  }

  /**
   * Updates received cities in main city list
   * @param {City[]} cityListToUpdate
   * @param {City} cityToUpdate
   */
  function updateCity(cityListToUpdate: City[], cityToUpdate: City): void {
    const cityToUpdateIdx = cityListToUpdate.findIndex(
      (city) => city.id === cityToUpdate.id
    );

    if (cityToUpdateIdx >= 0) {
      cityListToUpdate[cityToUpdateIdx] = cityToUpdate;
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
        updateCities={updateCities}
        changeTurn={changeTurn}
      />
    );
  }

  useEffect(() => {
    if (!board.length) {
      setBoard(BoardUtils.getInitialBoard);
    }
  }, [board]);

  useEffect(() => {
    if (board.length && !cityList.length) {
      initializeCityList();
    }
  }, [board, cityList]);

  useEffect(() => {
    if (board.length && cityList.length && !playerList.length) {
      intializePlayerList();
    }
  }, [board, cityList, playerList]);

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
      playerListCopy[activePlayerIdx].gold +=
        PlayerUtils.calculatePlayerGoldOnTurnStart(
          playerListCopy[activePlayerIdx],
          cityList
        );
      setPlayerList(playerListCopy);
    }
  }, [activePlayerId]);

  return (
    <ActivePlayerContext.Provider
      value={
        PlayerUtils.getActivePlayer(playerList, activePlayerId) ??
        PlayerUtils.getDummyPlayer()
      }
    >
      <TurnCounter turnNumber={actualTurn}></TurnCounter>

      <div className="main-content">{getMainContent()}</div>
    </ActivePlayerContext.Provider>
  );
}

export default App;
