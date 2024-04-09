import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import HexComp, { Hex } from '../Hex/Hex'
import { Pnj } from '../Pnj/Pnj'

import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext'

import { getAdjacentHexIds } from '../../utils/AdjacencyUtils'
import { isPnjEnemy, isPnjAlly } from '../../utils/PnjUtils'

import { Player } from '../../App'

interface BoardProps {
  board: Hex[][];
  playerList: Player[]
}

export interface PnjToMove extends Pnj {
  destinationHexs: string[]
}

export interface VisibleHexsByPlayer {
  playerId: number,
  visibleHexsIds: string[]
}

const Board:React.FC<BoardProps> = ({ board, playerList }) => {
  const [selectedHex, setSelectedHex] = useState<string>('')
  const [movingPnj, setMovingPnj] = useState<PnjToMove | undefined>(undefined)

  const activePlayer = useActivePlayerContext()

  useEffect(() => {
    triggerSelectedHexActions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHex])

  /**
   * Gets hex's occupant pnj if any
   * @param {string} hexId
   * @returns {Pnj | undefined}
   */
  function getPnjInHex (hexId: string): Pnj | undefined {
    for (const player of playerList) {
      for (const pnj of player.pnjList) {
        if (pnj.hexLocationId === hexId) {
          return pnj
        }
      }
    }
  }

  /**
   * Gets hex's occupant city if any
   * @param {string} hexId
   * @returns {any}
   */
  function getCityInHex (hexId: string) {
    for (const player of playerList) {
      for (const city of player.cityList) {
        if (city.hexLocationId === hexId) {
          return city
        }
      }
    }
  }

  /**
   * Moves received pnj to received location
   * @param {PnjToMove} pnjToMove
   * @param {string} locationToMove
   */
  function movePnj (pnjToMove: PnjToMove, locationToMove: string) {
    pnjToMove.hexLocationId = locationToMove
    addNewVisibleHexsAfterMovement(locationToMove)
    pnjToMove.canMove = false
  }

  function addNewVisibleHexsAfterMovement (newLocation: string) {
    for (const hexId of getAdjacentHexIds(newLocation, board)) {
      if (!activePlayer.visibleHexsIds.includes(hexId)) {
        activePlayer.visibleHexsIds.push(hexId)
      }
    }
  }

  /**
   * Sets pnj to move next
   * @param {Pnj} pnjToMove
   */
  function selectPnjToMove (pnjToMove: Pnj) {
    setMovingPnj({
      ...pnjToMove,
      destinationHexs: getPnjAdjacentHexs(pnjToMove)
    })
  }

  /**
   * Trigger selected hex actions:
   *  - Show destination nodes if pnj is in hex
   */
  function triggerSelectedHexActions () {
    console.log('triggerSelectedHexActions')
    const pnjInDestinationHex = getPnjInHex(selectedHex)

    if (movingPnj?.canMove && movingPnj?.destinationHexs?.includes(selectedHex)) {
      if (pnjInDestinationHex && isPnjAlly(pnjInDestinationHex, activePlayer)) {
        healPnj(pnjInDestinationHex)
        return
      }

      // ATACK
      if (pnjInDestinationHex && isPnjEnemy(pnjInDestinationHex, activePlayer)) {
        attackPnj(movingPnj, pnjInDestinationHex)
        return
      }

      // MOVE PNJ TO DESTINATION
      movePnj(movingPnj, selectedHex)
      setSelectedHex('')
      setMovingPnj(undefined)
      return
    }

    // SELECT PNJ TO MOVE
    if (pnjInDestinationHex?.hexLocationId) {
      selectPnjToMove(pnjInDestinationHex)
      return
    }

    setMovingPnj(undefined)
  }

  /**
   * Heals received pnj
   * @param {Pnj} pnjInDestinationHex
   */
  function healPnj (pnjInDestinationHex: Pnj) {
    // TODO
  }

  /**
   * Attacks received pnj
   * @param {Pnj} attackingPnj
   * @param {Pnj} attackedPnj
   */
  function attackPnj (attackingPnj: PnjToMove, attackedPnj: Pnj) {
    // TODO: Reduce heal & kill if heal === 0
    killPnj(attackedPnj)
    movePnj(attackingPnj, selectedHex)
  }

  /**
   * Kills received pnj
   * @param {Pnj} pnjInDestinationHex
   */
  function killPnj (pnjInDestinationHex: Pnj) {
    // TODO
  }

  /**
   * Given a pnj returns an array with ids of its adjacent hexs
   * @param {Pnj} pnjInHex
   * @returns {string[]}
   */
  function getPnjAdjacentHexs (pnjInHex: Pnj): string[] {
    return getAdjacentHexIds(pnjInHex.hexLocationId, board)
  }

  function isHexVisible (hexId: string): boolean {
    return activePlayer.visibleHexsIds.includes(hexId)
  }

  return (
    <Container>
      {board?.map((boardRow, idx) => (
        <Row className='justify-content-md-center' key={idx}>
          {boardRow.map((_, jdx) => (
            <Col key={`${jdx}_${idx}`} xs lg='1'>
              <HexComp
                hex={board[idx][jdx]}
                isSelected={selectedHex === `${jdx}_${idx}`}
                isVisible={isHexVisible(`${jdx}_${idx}`)}
                isDestinationHex={movingPnj?.destinationHexs?.includes(`${jdx}_${idx}`) ?? false}
                pnjInHex={getPnjInHex(`${jdx}_${idx}`)}
                cityInHex={getCityInHex(`${jdx}_${idx}`)}
                setAsSelected={setSelectedHex}
              />
            </Col>
          ))}
        </Row>
      ))}
    </Container>
  )
}

export default Board
