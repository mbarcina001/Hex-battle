import './App.scss'
import React, { useState, useEffect } from 'react'
import Board from './components/Board/Board'
import Button from 'react-bootstrap/Button'

import { ActivePlayerContext } from './context/ActivePlayerContext/ActivePlayerContext'

export interface Player {
  playerId: number,
  playerColor: string
}

const App: React.FC = () => {
  const [activePlayer, setActivePlayer] = useState<Player>({
    playerId: -1,
    playerColor: 'no-color'
  })
  const [playerList, setPlayerList] = useState<Player[]>([])
  const [actualTurn, setActualTurn] = useState<number>(1)
  const [winner, setWinner] = useState<number | undefined>(undefined)

  useEffect(() => {
    intialisePlayerList()
  }, [])

  function intialisePlayerList () {
    const players = [
      {
        playerId: 1,
        playerColor: 'red'
      },
      {
        playerId: 2,
        playerColor: 'blue'
      }
    ]
    setPlayerList(players)
    setActivePlayer(players[0])
  }

  function changeTurn () {
    if (!activePlayer) {
      return // Game has not started
    }

    const activePlayerIndex = playerList.findIndex(player => player.playerId === activePlayer.playerId)

    if (activePlayerIndex + 1 === playerList.length) {
      const newTurn = actualTurn + 1

      // TODO: Remove
      if (newTurn === 7) {
        setWinner(1)
      }

      setActualTurn(newTurn)
      setActivePlayer(playerList[0])
      return
    }

    const newActivePlayer = playerList[activePlayerIndex + 1]
    setActivePlayer(newActivePlayer)
  }

  function getMainContent () {
    if (winner) {
      return <p>{`Ganador: Jugador ${winner}`}</p>
    }

    return (
      <Board turn={actualTurn} />
    )
  }

  return (
    <>
      <ActivePlayerContext.Provider value={activePlayer}>
        <p>{`Turno: ${actualTurn} - Jugador: ${activePlayer.playerId}`}</p>

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
