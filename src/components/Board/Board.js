import { useEffect, useState } from 'react'
import Hex from '../Hex/Hex'
import { BOARD_TYPES } from '../../App.constants'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import * as _ from 'lodash'

export default function Board ({ activePlayer, turn }) {
  const [board, setBoard] = useState(undefined)
  const [selectedHexId, setSelectedHexId] = useState('')
  const [pnjList, setPnjList] = useState([])
  const [cityList, setCityList] = useState([])
  const [movingPnj, setMovingPnj] = useState(undefined)
  const [visibleHexsByPlayer, setVisibleHexsByPlayer] = useState([])

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
  }, [selectedHexId])

  useEffect(() => {
    if (pnjList?.length && activePlayer && turn === 1) {
      initializeActivePlayerVisibleHexs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pnjList, activePlayer, turn])

  /**
   * Auxiliar function that initializes board
   */
  function initializeBoard () {
    setBoard(BOARD_TYPES)
  }

  /**
   * Auxiliar function that initializes player's city list
   *  Adds first city at a random location
   */
  function initializeCityList () {
    const initialCityPlayer1 = {
      id: 'cit_0',
      name: 'City A',
      owner: 1,
      hexLocationId: getRandomHexLocationId()
    }
    const initialCityPlayer2 = {
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
    const initialPnjPlayer1 = {
      type: 'any',
      id: 'pnj_0',
      owner: 1,
      hexLocationId: cityList[0].hexLocationId
    }
    const initialPnjPlayer2 = {
      type: 'any',
      id: 'pnj_1',
      owner: 2,
      hexLocationId: cityList[1].hexLocationId
    }
    const pnjInitialList = [initialPnjPlayer1, initialPnjPlayer2]
    setPnjList(pnjInitialList)
  }

  /**
   * Auxiliar function that initializes active player's visible hexs
   *  Adds to visible hex list those hexs that player's first pnj can see
   */
  function initializeActivePlayerVisibleHexs () {
    const playerVisibleHexs = {
      playerId: activePlayer,
      visibleHexs: []
    }

    for (const pnj of pnjList) {
      if (pnj.owner === activePlayer) {
        playerVisibleHexs.visibleHexs = playerVisibleHexs.visibleHexs
          .concat(getPnjAdjacentHexs(pnj))
          .concat(pnj.hexLocationId)
      }
    }

    const visibleHexsByPlayerCopy = _.cloneDeep(visibleHexsByPlayer)
    visibleHexsByPlayerCopy.push(playerVisibleHexs)
    setVisibleHexsByPlayer(visibleHexsByPlayerCopy)
  }

  /**
   * Gets hex's occupant pnj if any
   * @param {string} hexId
   * @returns {any}
   */
  function getPnjInHex (hexId) {
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
  function getCityInHex (hexId) {
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

  function getRandomInt (max) {
    return Math.floor(Math.random() * max)
  }

  /**
   * Moves received pnj to received location
   */
  function movePnj (pnjToMove, locationToMove) {
    pnjToMove.hexLocationId = locationToMove
  }

  /**
   * Sets pnj to move next
   */
  function selectPnjToMove (pnjToMove) {
    setMovingPnj(Object.assign(pnjToMove, {
      destinationHexs: getPnjAdjacentHexs(pnjToMove)
    }))
  }

  /**
   * Trigger selected hex actions:
   *  - Show destination nodes if pnj is in hex
   */
  function triggerSelectedHexActions () {
    // MOVE PNJ TO DESTINATION
    if (movingPnj?.destinationHexs?.includes(selectedHexId)) {
      movePnj(movingPnj, selectedHexId)
      setSelectedHexId('')
      setMovingPnj(undefined)
      return
    }

    // SELECT PNJ TO MOVE
    const pnjInHex = getPnjInHex(selectedHexId)
    if (pnjInHex?.hexLocationId) {
      selectPnjToMove(pnjInHex)
      return
    }

    setMovingPnj(undefined)
  }

  /**
   * Given a pnj returns an array with ids of its adjacent hexs
   * @param {any} pnjInHex
   * @returns {any}
   */
  function getPnjAdjacentHexs (pnjInHex) {
    const coords = getPnjCoords(pnjInHex)
    return getAdjacentCoords(coords)
  }

  /**
   * Ggiven a pnj returns its coords
   * @param {any} pnj
   * @returns {any}
   */
  function getPnjCoords (pnj) {
    return {
      x: parseInt(pnj.hexLocationId.split('_')[0]),
      y: parseInt(pnj.hexLocationId.split('_')[1])
    }
  }

  /**
   * Given a hex coords returns adjacent hexs coords
   * @param {any} coords
   * @returns {any}
   */
  function getAdjacentCoords (coords) {
    const adjacentCoords = []
      .concat(getHorizontalAdjacentCoords(coords))
      .concat(getVerticalAdjacentCoords(coords))
      .concat(getDiagonalAdjacentCoords(coords))
    return adjacentCoords.filter(coords => checkCoordsInBoardBoundaries(coords))
  }

  function checkCoordsInBoardBoundaries (coords) {
    const splittedCoords = {
      x: coords.split('_')[0],
      y: coords.split('_')[1]
    }
    if (splittedCoords.x < 0 || splittedCoords.y < 0) {
      return false
    }
  }

  /**
   * Given a hex coords returns adjacent hexs coords in y axis
   * @param {any} coords
   * @returns {any}
   */
  function getHorizontalAdjacentCoords (coords) {
    return [
      `${coords.x - 1}_${coords.y}`,
      `${coords.x + 1}_${coords.y}`
    ]
  }

  /**
   * Given a hex coords returns adjacent hexs coords in x axis
   * @param {any} coords
   * @returns {any}
   */
  function getVerticalAdjacentCoords (coords) {
    return [
      `${coords.x}_${coords.y - 1}`,
      `${coords.x}_${coords.y + 1}`
    ]
  }

  /**
   * Given a hex coords returns adjacent hexs coords in diagonal
   * @param {any} coords
   * @returns {any}
   */
  function getDiagonalAdjacentCoords (coords) {
    if (board.length / 2 < coords.y) {
      return [
        `${coords.x + 1}_${coords.y - 1}`,
        `${coords.x - 1}_${coords.y + 1}`
      ]
    }
    return [
      `${coords.x - 1}_${coords.y - 1}`,
      `${coords.x + 1}_${coords.y + 1}`
    ]
  }

  function isHexVisible (hexId) {
    return getActivePlayerVisibleHexs().includes(hexId)
  }

  function getActivePlayerVisibleHexs () {
    return visibleHexsByPlayer.find(elem => elem.playerId === activePlayer)?.visibleHexs || []
  }

  return (
    <Container>
      {board?.map((boardRow, idx) => (
        <Row className='justify-content-md-center' key={idx}>
          {boardRow.map((boardHexType, jdx) => (
            <Col key={`${jdx}_${idx}`} xs lg='1'>
              <Hex
                id={`${jdx}_${idx}`}
                type={boardHexType}
                isSelected={selectedHexId === `${jdx}_${idx}`}
                isVisible={isHexVisible(`${jdx}_${idx}`)}
                isDestinationHex={movingPnj?.destinationHexs?.includes(`${jdx}_${idx}`)}
                pnjInHex={getPnjInHex(`${jdx}_${idx}`)}
                cityInHex={getCityInHex(`${jdx}_${idx}`)}
                setAsSelected={setSelectedHexId}
              />
            </Col>
          ))}
        </Row>
      ))}
    </Container>
  )
}
