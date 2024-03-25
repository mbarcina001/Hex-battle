import { useState } from 'react'
import './App.css'
import Board from './components/Board/Board'

function App () {
  const [actualTurn, setActualTurn] = useState(1)
  const [activePlayer, setActivePlayer] = useState(1)
  const [winner, setWinner] = useState('')

  const players = [
    {
      id: 1,
      visibleHexs: [] // TODO
    },
    {
      id: 2,
      visibleHexs: [] // TODO
    }
  ]

  function changeTurn () {
    if (activePlayer === players.length) {
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

  return (
    <>
      <p>{`Turno: ${actualTurn} - Jugador: ${activePlayer}`}</p>
      {winner === '' ? <Board /> : <p>{`Ganador: Jugador ${winner}`}</p>}

      <button onClick={changeTurn}>Fin del turno</button>
    </>
  )
}

export default App
