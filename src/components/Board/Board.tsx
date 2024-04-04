import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import HexComp, { Hex } from '../Hex/Hex'
import { Pnj } from '../Pnj/Pnj'
import { City } from '../City/City'

import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext'

import { getAdjacentHexIds } from '../../utils/AdjacencyUtils'
import { isPnjEnemy, isPnjAlly } from '../../utils/PnjUtils'

import { BOARD_TYPES } from '../../App.constants'

import * as _ from 'lodash'

interface BoardProps {
  turn: number
}

export interface PnjToMove extends Pnj {
  destinationHexs: string[]
}

export interface VisibleHexsByPlayer {
  playerId: number,
  visibleHexsIds: string[]
}

const Board:React.FC<BoardProps> = ({ turn }) => {
  const [board, setBoard] = useState<Hex[][]>([])
  const [selectedHex, setSelectedHex] = useState<string>('')
  const [pnjList, setPnjList] = useState<Pnj[]>([])
  const [cityList, setCityList] = useState<City[]>([])
  const [movingPnj, setMovingPnj] = useState<PnjToMove | undefined>(undefined)
  const [visibleHexsByPlayer, setVisibleHexsByPlayer] = useState<VisibleHexsByPlayer[]>([])

  const activePlayer = useActivePlayerContext()

  useEffect(() => {
    initializeBoard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (board?.length) {
      initializeCityList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board])

  useEffect(() => {
    if (cityList?.length) {
      initializePnjList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityList])

  useEffect(() => {
    triggerSelectedHexActions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHex])

  useEffect(() => {
    if (pnjList?.length && activePlayer && turn === 1) {
      initializeActivePlayerVisibleHexs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pnjList, activePlayer, turn])

  useEffect(() => {
    if (pnjList?.length && activePlayer) {
      setPlayerPnjsActive()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pnjList, activePlayer])

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
   * Auxiliar function that initializes player's city list
   *  Adds first city at a random location
   */
  function initializeCityList () {
    const initialCityPlayer1: City = {
      id: 'cit_0',
      name: 'City A',
      owner: 1,
      hexLocationId: getRandomHexLocationId()
    }
    const initialCityPlayer2: City = {
      id: 'cit_1',
      name: 'City B',
      owner: 2,
      hexLocationId: getRandomHexLocationId()
    }
    setCityList([initialCityPlayer1, initialCityPlayer2])
  }

  /**
   * Auxiliar function that initializes player's pnj list
   *  Adds first PNJ in player's first city
   */
  function initializePnjList () {
    const initialPnjPlayer1: Pnj = {
      type: 'any',
      id: 'pnj_0',
      owner: 1,
      hexLocationId: cityList[0].hexLocationId,
      canMove: false
    }
    const initialPnjPlayer2: Pnj = {
      type: 'any',
      id: 'pnj_1',
      owner: 2,
      hexLocationId: cityList[1].hexLocationId,
      canMove: false
    }
    setPnjList([initialPnjPlayer1, initialPnjPlayer2])
  }

  /**
   * Auxiliar function that initializes active player's visible hexs
   *  Adds to visible hex list those hexs that player's first pnj can see
   */
  function initializeActivePlayerVisibleHexs () {
    if (!activePlayer?.playerId) {
      return
    }

    const playerVisibleHexs: VisibleHexsByPlayer = {
      playerId: activePlayer.playerId,
      visibleHexsIds: []
    }

    for (const pnj of pnjList) {
      if (isPnjAlly(pnj, activePlayer)) {
        playerVisibleHexs.visibleHexsIds = playerVisibleHexs.visibleHexsIds
          .concat(getAdjacentHexIds(pnj.hexLocationId, board), pnj.hexLocationId)
      }
    }

    const visibleHexsByPlayerCopy = _.cloneDeep(visibleHexsByPlayer)
    visibleHexsByPlayerCopy.push(playerVisibleHexs)
    setVisibleHexsByPlayer(visibleHexsByPlayerCopy)
  }

  /**
   * Gets hex's occupant pnj if any
   * @param {string} hexId
   * @returns {Pnj | undefined}
   */
  function getPnjInHex (hexId: string): Pnj | undefined {
    for (const pnj of pnjList) {
      if (pnj.hexLocationId === hexId) {
        return pnj
      }
    }
  }

  /**
   * Gets hex's occupant city if any
   * @param {string} hexId
   * @returns {any}
   */
  function getCityInHex (hexId: string) {
    for (const city of cityList) {
      if (city.hexLocationId === hexId) {
        return city
      }
    }
  }

  /**
   * Gets random hexLocationId from board
   * @returns {string}
   */
  function getRandomHexLocationId () {
    const yCoord = getRandomInt(board.length)
    const xCoord = getRandomInt(board[yCoord].length)
    return `${xCoord}_${yCoord}`
  }

  function getRandomInt (max: number) {
    return Math.floor(Math.random() * max)
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
    const playerVisibleHexs = visibleHexsByPlayer.find(elem => elem.playerId === activePlayer.playerId)

    if (!playerVisibleHexs?.visibleHexsIds) {
      return
    }

    for (const hexId of getAdjacentHexIds(newLocation, board)) {
      if (!playerVisibleHexs.visibleHexsIds.includes(hexId)) {
        playerVisibleHexs.visibleHexsIds.push(hexId)
      }
    }
  }

  function setPlayerPnjsActive () {
    for (const pnj of pnjList) {
      if (isPnjAlly(pnj, activePlayer)) {
        pnj.canMove = true
      }
    }
  }

  /**
   * Sets pnj to move next
   * @param {Pnj} pnjToMove
   */
  function selectPnjToMove (pnjToMove: Pnj) {
    setMovingPnj(Object.assign(pnjToMove, {
      destinationHexs: getPnjAdjacentHexs(pnjToMove)
    }))
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
    const pnjListCopy = _.cloneDeep(pnjList)
    const pnjIndex = pnjListCopy.findIndex(pnj => pnj.id === pnjInDestinationHex.id)

    if (pnjIndex >= 0) {
      pnjListCopy.splice(pnjIndex, 1)
    }
    setPnjList(pnjListCopy)
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
    return getActivePlayerVisibleHexs().includes(hexId)
  }

  function getActivePlayerVisibleHexs () {
    return visibleHexsByPlayer.find(elem => elem.playerId === activePlayer.playerId)?.visibleHexsIds || []
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
