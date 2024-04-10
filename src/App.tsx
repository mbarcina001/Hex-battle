import './App.scss'
import React, { useState, useEffect } from 'react'
import Board from './components/Board/Board'
import Button from 'react-bootstrap/Button'

import { ActivePlayerContext } from './context/ActivePlayerContext/ActivePlayerContext'
import { BOARD_TYPES } from './App.constants'
import { Hex } from './components/Hex/Hex'
import { City } from './components/City/City'
import { Pnj } from './components/Pnj/Pnj'
import { getRandomHexLocationId } from './utils/HexUtils'
import { getAdjacentHexIds } from './utils/AdjacencyUtils'

import * as _ from 'lodash'

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
  const [winner] = useState<number | undefined>(undefined)
  const [board, setBoard] = useState<Hex[][]>([])

  useEffect(() => {
    initializeBoard()
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
   * Auxiliar function that initializes board
   */
  function initializeBoard () {
    const board: Hex[][] = []
    BOARD_TYPES.forEach((_, idx) => {
      const row: Hex[] = []

      BOARD_TYPES[idx].forEach((_, jdx) => {
        row.push({
          id: `${jdx}_${idx}`,
          type: BOARD_TYPES[idx][jdx]
        })
      })

      board.push(row)
    })

    setBoard(board)
  }

  /**
   * Auxiliar function that initializes player list
   */
  function intializePlayerList () {
    const players: Player[] = [
      getInitialPlayer(1, 'red'),
      getInitialPlayer(2, 'blue')
    ]

    setPlayerList(players)
    setActivePlayerId(players[0].playerId)
  }

  /**
   * Gets a player with given params, a city and a pnj
   * @param { number } playerId,
   * @param { string } playerColor
   * @returns {Player}
   */
  function getInitialPlayer (playerId: number, playerColor: string): Player {
    const firstCity: City = {
      id: `cit_${playerId}`,
      name: `City ${playerId}`,
      ownerId: playerId,
      hexLocationId: getRandomHexLocationId(board)
    }

    const firstPnj: Pnj = {
      type: 'any',
      id: `pnj_${playerId}`,
      owner: {
        id: playerId,
        color: playerColor
      },
      hexLocationId: firstCity.hexLocationId,
      canMove: false,
      attack: 6,
      defense: 2,
      healthPoints: 10
    }

    const visibleHexsIds: string[] = [firstPnj.hexLocationId].concat(getAdjacentHexIds(firstPnj.hexLocationId, board))

    return {
      playerId,
      playerColor,
      pnjList: [firstPnj],
      cityList: [firstCity],
      visibleHexsIds
    }
  }

  /**
   * Changes current turn to the next player
   *  If current player is last player => increase turn number
   * @returns { void }
   */
  function changeTurn () {
    const activePlayerIndex = playerList.findIndex(player => player.playerId === activePlayerId)

    if (activePlayerIndex + 1 === playerList.length) {
      setActualTurn(actualTurn + 1)
      setActivePlayerId(playerList[0].playerId)
      return
    }

    const newActivePlayerId = playerList[activePlayerIndex + 1].playerId
    setActivePlayerId(newActivePlayerId)
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
    if (winner) {
      return <p>{`Ganador: Jugador ${winner}`}</p>
    }

    return (
      <Board board={board} playerList={playerList} updatePlayers={updatePlayers} />
    )
  }

  /**
   * Gets current active player
   * @returns {Player | undefined}
   */
  function getActivePlayer (): Player | undefined {
    if (!playerList.length || activePlayerId < 0) {
      return
    }

    return playerList.find(player => player.playerId === activePlayerId)
  }

  /**
   * Returns a dummy player
   * @returns {Player}
   */
  function getDummyPlayer (): Player {
    return {
      playerId: -1,
      playerColor: 'no-color',
      pnjList: [],
      cityList: [],
      visibleHexsIds: []
    }
  }

  return (
    <>
      <ActivePlayerContext.Provider value={getActivePlayer() ?? getDummyPlayer()}>
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
