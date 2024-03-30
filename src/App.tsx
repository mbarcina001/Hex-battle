import './App.scss'
import React, { useState } from 'react'
import Board from './components/Board/Board'
import Button from 'react-bootstrap/Button'

const App: React.FC = () => {
  const [actualTurn, setActualTurn] = useState<number>(1)
  const [activePlayer, setActivePlayer] = useState<number>(1)
  const [winner, setWinner] = useState<number | undefined>(undefined)
  const playerCount = 2

  function changeTurn () {
    if (activePlayer === playerCount) {
      const newTurn = actualTurn + 1

      // TODO: Remove
      if (newTurn === 7) {
        setWinner(1)
      }

      setActualTurn(newTurn)
      setActivePlayer(1)
      return
    }

    const newActivePlayer = activePlayer + 1
    setActivePlayer(newActivePlayer)
  }

  function getMainContent () {
    if (winner) {
      return <p>{`Ganador: Jugador ${winner}`}</p>
    }

    return (
      <Board activePlayer={activePlayer} turn={actualTurn} />
    )
  }

  return (
    <>
      <p>{`Turno: ${actualTurn} - Jugador: ${activePlayer}`}</p>

      {getMainContent()}

      <Button
        variant='danger'
        onClick={changeTurn}
      >
        Fin del turno
      </Button>
    </>
  )
}

export default App
