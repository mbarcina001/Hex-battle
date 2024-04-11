import './App.scss'
import React, { useState, useEffect } from 'react'
import Board from './components/Board/Board'
import Button from 'react-bootstrap/Button'

import { ActivePlayerContext } from './context/ActivePlayerContext/ActivePlayerContext'
import { Hex } from './components/Hex/Hex'
import { City } from './components/City/City'
import { Pnj } from './components/Pnj/Pnj'

import * as _ from 'lodash'
import { getInitialBoard } from './utils/BoardUtils'
import { getActivePlayer, getDummyPlayer, getInitialPlayer } from './utils/PlayerUtils'
import { checkWinner } from './utils/GameUtils'

export interface Player {
  playerId: number,
  playerColor: string,
  pnjList: Pnj[],
  cityList: City[],
  visibleHexsIds: string[]
}

const App: React.FC = () => {
  const [activePlayerId, setActivePlayerId] = useState<number>(-1)
  const [playerList, setPlayerList] = useState<Player[]>([])
  const [actualTurn, setActualTurn] = useState<number>(1)
  const [winner, setWinner] = useState<Player | undefined>(undefined)
  const [board, setBoard] = useState<Hex[][]>([])

  useEffect(() => {
    setBoard(getInitialBoard)
  }, [])

  useEffect(() => {
    if (board?.length) {
      intializePlayerList()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board])

  useEffect(() => {
    const playerListCopy = _.cloneDeep(playerList)
    const activePlayerIdx = playerListCopy.findIndex(player => player.playerId === activePlayerId)

    if (activePlayerIdx >= 0 && playerListCopy[activePlayerIdx]?.pnjList?.length) {
      const updatedPnjList = playerListCopy[activePlayerIdx].pnjList.map(pnj => {
        return {
          ...pnj,
          canMove: true
        }
      })
      playerListCopy[activePlayerIdx].pnjList = updatedPnjList
      setPlayerList(playerListCopy)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePlayerId])

  /**
   * Auxiliar function that initializes player list
   */
  function intializePlayerList () {
    const players: Player[] = [
      getInitialPlayer(1, 'red', board),
      getInitialPlayer(2, 'blue', board)
    ]

    setPlayerList(players)
    setActivePlayerId(players[0].playerId)
  }

  /**
   * Changes current turn to the next player
   *  If current player is last player => increase turn number
   * @returns { void }
   */
  function changeTurn () {
    const winPlayer = checkWinner(playerList)
    if (winPlayer) {
      setWinner(winPlayer)
      return
    }

    const activePlayerIndex = playerList.findIndex(player => player.playerId === activePlayerId)
    const isLastPlayerInTurn = activePlayerIndex + 1 === playerList.length

    if (isLastPlayerInTurn) {
      setActualTurn(actualTurn + 1)
      setActivePlayerId(playerList[0].playerId)
    } else {
      const newActivePlayerId = playerList[activePlayerIndex + 1].playerId
      setActivePlayerId(newActivePlayerId)
    }
  }

  /**
   * Updates every received player
   * @param {Player[]} playerToUpdateArr
   */
  function updatePlayers (playerToUpdateArr: Player[]) {
    const playerListCopy = _.cloneDeep(playerList)

    for (const playerToUpdate of playerToUpdateArr) {
      const playerToUpdateIdx = playerListCopy.findIndex(player => player.playerId === playerToUpdate.playerId)

      if (playerToUpdateIdx >= 0) {
        playerListCopy[playerToUpdateIdx] = playerToUpdate
      }
    }

    setPlayerList(playerListCopy)
  }

  /**
   * Shows winner if any; else shows board
   * @returns {any}
   */
  function getMainContent () {
    return winner
      ? <p>{`Ganador: Jugador ${winner.playerId}`}</p>
      : <Board board={board} playerList={playerList} updatePlayers={updatePlayers} />
  }

  return (
    <>
      <ActivePlayerContext.Provider
        value={getActivePlayer(playerList, activePlayerId) ?? getDummyPlayer()}
      >
        <p>{`Turno: ${actualTurn} - Jugador: ${activePlayerId}`}</p>

        {getMainContent()}

        <Button
          variant='danger'
          onClick={changeTurn}
        >
          Fin del turno
        </Button>
      </ActivePlayerContext.Provider>
    </>
  )
}

export default App
