import { useEffect, useState } from 'react'
import Hex from '../Hex/Hex'
import { BOARD_TYPES } from '../../App.constants'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function Board () {
  const [selectedNodeId, setSelectedNodeId] = useState('')
  const [pnjList, setPnjList] = useState([])
  const [cityList, setCityList] = useState([])

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

  /**
   * Auxiliar function that initialises player's city list
   *  Adds first city at a random location
   */
  async function initializeCityList () {
    const initialCityPlayer1 = {
      id: 'cit_1',
      name: 'City A',
      owner: 1,
      hexLocationId: getRandomHexLocationId()
    }
    const initialCityPlayer2 = {
      id: 'cit_2',
      name: 'City B',
      owner: 2,
      hexLocationId: getRandomHexLocationId()
    }
    await setCityList([initialCityPlayer1, initialCityPlayer2])
  }

  /**
   * Auxiliar function that initialises player's pnj list
   *  Adds first PNJ in player's first city
   */
  async function initializePnjList () {
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
    const xCoord = getRandomInt(BOARD_TYPES.length)
    const yCoord = getRandomInt(BOARD_TYPES[xCoord].length)
    return `${xCoord}_${yCoord}`
  }

  function getRandomInt (max) {
    return Math.floor(Math.random() * max)
  }

  return (
    <Container>
      {BOARD_TYPES.map((boardRow, idx) => (
        <Row className='justify-content-md-center' key={idx}>
          {boardRow.map((boardHexType, jdx) => (
            <Col key={`${idx}_${jdx}`} xs lg='1'>
              <Hex
                id={`${idx}_${jdx}`}
                type={boardHexType}
                isSelected={selectedNodeId === `${idx}_${jdx}`}
                pnjInHex={getPnjInHex(`${idx}_${jdx}`)}
                cityInHex={getCityInHex(`${idx}_${jdx}`)}
                setAsSelected={setSelectedNodeId}
              />
            </Col>
          ))}
        </Row>
      ))}
    </Container>
  )
}
