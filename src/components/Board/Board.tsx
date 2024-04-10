import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import HexComp, { Hex } from '../Hex/Hex'
import { Pnj } from '../Pnj/Pnj'

import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext'

import { getAdjacentHexIds } from '../../utils/AdjacencyUtils'
import { MAX_HEALTH_POINTS, isPnjEnemy, isPnjAlly, calcDamage, calcHealPower, calcCounterDamage } from '../../utils/PnjUtils'

import { Player } from '../../App'

interface BoardProps {
  board: Hex[][];
  playerList: Player[],
  updatePlayers: Function
}

export interface PnjToMove {
  whichPnj: Pnj,
  destinationHexs: string[]
}

export interface VisibleHexsByPlayer {
  playerId: number,
  visibleHexsIds: string[]
}

const Board:React.FC<BoardProps> = ({ board, playerList, updatePlayers }) => {
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
   * Trigger selected hex actions:
   *  - Show destination nodes if pnj is in hex
   */
  function triggerSelectedHexActions () {
    const pnjInDestinationHex = getPnjInHex(selectedHex)

    if (movingPnj?.whichPnj.canMove && movingPnj?.destinationHexs?.includes(selectedHex)) {
      if (pnjInDestinationHex && isPnjAlly(pnjInDestinationHex, activePlayer)) {
        healPnj(movingPnj.whichPnj, pnjInDestinationHex)
      } else if (pnjInDestinationHex && isPnjEnemy(pnjInDestinationHex, activePlayer)) {
        attackPnj(movingPnj.whichPnj, pnjInDestinationHex)
      } else {
        movePnjToDestination(movingPnj.whichPnj)
      }

      setMovingPnj(undefined)
      setSelectedHex('')
    } else if (pnjInDestinationHex?.hexLocationId) {
      selectPnjToMove(pnjInDestinationHex)
    }
  }

  /**
   * Heals received pnj
   * @param {Pnj} healerPnj
   * @param {Pnj} restoredPnj
   */
  function healPnj (healerPnj: Pnj, restoredPnj: Pnj) {
    restoredPnj.healthPoints = restoredPnj.healthPoints + calcHealPower(healerPnj)

    if (restoredPnj.healthPoints > MAX_HEALTH_POINTS) {
      restoredPnj.healthPoints = MAX_HEALTH_POINTS
    }

    healerPnj.canMove = false
    updatePlayers([activePlayer])
  }

  /**
   * Attacks received pnj
   * @param {Pnj} attackingPnj
   * @param {Pnj} attackedPnj
   */
  function attackPnj (attackingPnj: Pnj, attackedPnj: Pnj) {
    const defenderOwner = playerList.find(player => player.playerId === attackedPnj.owner.id)

    if (!defenderOwner) {
      return
    }

    attackedPnj.healthPoints = attackedPnj.healthPoints - calcDamage(attackingPnj, attackedPnj)

    if (attackedPnj.healthPoints <= 0) {
      defenderOwner.pnjList = defenderOwner.pnjList.filter(pnj => pnj.id !== attackedPnj.id)
      movePnj(attackingPnj, selectedHex, false)
      attackingPnj.canMove = false
      updatePlayers([activePlayer, defenderOwner])
      return
    }

    attackingPnj.healthPoints = attackingPnj.healthPoints - calcCounterDamage(attackedPnj, attackingPnj)

    if (attackedPnj.healthPoints <= 0) {
      defenderOwner.pnjList = defenderOwner.pnjList.filter(pnj => pnj.id !== attackedPnj.id)
      movePnj(attackingPnj, selectedHex, false)
    }

    attackingPnj.canMove = false
    console.log(JSON.stringify([activePlayer, defenderOwner]))
    updatePlayers([activePlayer, defenderOwner])
  }

  /**
   * Moves given pnj to selected hex
   * @param {Pnj} movingPnj
   */
  function movePnjToDestination (movingPnj: Pnj) {
    movePnj(movingPnj, selectedHex)
    setSelectedHex('')
    setMovingPnj(undefined)
  }

  /**
   * Sets pnj to move next
   * @param {Pnj} pnjToMove
   */
  function selectPnjToMove (pnjToMove: Pnj) {
    setMovingPnj({
      whichPnj: pnjToMove,
      destinationHexs: getPnjAdjacentHexs(pnjToMove)
    })
  }

  /**
   * Moves received pnj to received location
   * @param {Pnj} pnjToMove
   * @param {string} locationToMove
   * @param {boolean} callUpdate
   */
  function movePnj (pnjToMove: Pnj, locationToMove: string, callUpdate = true) {
    const pnj = activePlayer.pnjList.find(playerPnj => playerPnj.id === pnjToMove.id)

    if (pnj) {
      pnj.canMove = false
      pnj.hexLocationId = locationToMove
      addNewVisibleHexsAfterMovement(locationToMove)

      if (callUpdate) {
        updatePlayers([activePlayer])
      }
    }
  }

  function addNewVisibleHexsAfterMovement (newLocation: string) {
    for (const hexId of getAdjacentHexIds(newLocation, board)) {
      if (!activePlayer.visibleHexsIds.includes(hexId)) {
        activePlayer.visibleHexsIds.push(hexId)
        updatePlayers([activePlayer])
      }
    }
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
