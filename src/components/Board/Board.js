import { useEffect, useState } from 'react'
import Hex from '../Hex/Hex'
import { BOARD_TYPES } from '../../App.constants'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function Board (activePlayer) {
  const [selectedHexId, setSelectedHexId] = useState('')
  const [pnjList, setPnjList] = useState([])
  const [cityList, setCityList] = useState([])
  const [movingPnj, setMovingPnj] = useState(undefined)

  useEffect(() => {
    initializeCityList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    if (pnjList?.length) {
      // TODO: Poner visibles las casillas (?????)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pnjList])

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
    const yCoord = getRandomInt(BOARD_TYPES.length)
    const xCoord = getRandomInt(BOARD_TYPES[yCoord].length)
    return `${xCoord}_${yCoord}`
  }

  function getRandomInt (max) {
    return Math.floor(Math.random() * max)
  }

  /**
   * Auxiliar function that moves received pnj to received location
   */
  function movePnj (pnjToMove, locationToMove) {
    pnjToMove.hexLocationId = locationToMove
  }

  /**
   * Auxiliar function that selects pnj to move
   */
  function selectPnjToMove (pnjToMove) {
    setMovingPnj(Object.assign(pnjToMove, {
      destinationHexs: getPnjDestinationHexs(pnjToMove)
    }))
  }

  /**
   * Trigger selected hex actions:
   *  - Show destination nodes if pnj is in hex
   */
  function triggerSelectedHexActions () {
    // SELECT PNJ DESTINATION
    if (movingPnj?.destinationHexs?.includes(selectedHexId)) {
      movePnj()
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

  function getPnjDestinationHexs (pnjInHex) {
    const coords = getPnjCoords(pnjInHex)

    return []
      .concat(getHorizontalNearestCoords(coords))
      .concat(getVerticalNearestCoords(coords))
      .concat(getDiagonalNearestCoords(coords))
  }

  function getPnjCoords (pnj) {
    return {
      x: parseInt(pnj.hexLocationId.split('_')[0]),
      y: parseInt(pnj.hexLocationId.split('_')[1])
    }
  }

  function getHorizontalNearestCoords (coords) {
    return [
      `${coords.x - 1}_${coords.y}`,
      `${coords.x + 1}_${coords.y}`
    ]
  }

  function getVerticalNearestCoords (coords) {
    return [
      `${coords.x}_${coords.y - 1}`,
      `${coords.x}_${coords.y + 1}`
    ]
  }

  function getDiagonalNearestCoords (coords) {
    if (BOARD_TYPES.length / 2 < coords.y) {
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

  return (
    <Container>
      {BOARD_TYPES.map((boardRow, idx) => (
        <Row className='justify-content-md-center' key={idx}>
          {boardRow.map((boardHexType, jdx) => (
            <Col key={`${jdx}_${idx}`} xs lg='1'>
              <Hex
                id={`${jdx}_${idx}`}
                type={boardHexType}
                isSelected={selectedHexId === `${jdx}_${idx}`}
                // isVisible={activePlayer.visibleHexs?.include(`${jdx}_${idx}`)}
                isVisible='true'
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
