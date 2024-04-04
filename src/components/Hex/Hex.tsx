import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext'
import { isPnjAlly } from '../../utils/PnjUtils'
import CityComp, { City } from '../City/City'
import PnjComp, { Pnj } from '../Pnj/Pnj'
import './Hex.scss'
import React from 'react'

export interface Hex {
  id: string,
  type: string,
}

interface HexProps {
  hex: Hex,
  isSelected: boolean,
  isVisible: boolean,
  isDestinationHex: boolean,
  pnjInHex?: Pnj,
  cityInHex?: City,
  setAsSelected: Function,
}

const HexComp:React.FC<HexProps> = ({ hex, isSelected, isVisible, isDestinationHex, pnjInHex, cityInHex, setAsSelected }) => {
  const activePlayer = useActivePlayerContext()

  /**
   * Handles click event
   * Sets this Hex as selected if it is visible for active player
   */
  function handleHexClick () {
    if (isVisible) {
      setAsSelected(hex.id)
    }
  }

  function getBorderColorClass () {
    if (isDestinationHex && pnjInHex) {
      if (isPnjAlly(pnjInHex, activePlayer)) {
        return 'ally'
      }

      return 'enemy'
    }

    if (isDestinationHex) {
      return 'destination'
    }

    return ''
  }

  return (
    <div
      className={`hex ${isVisible ? hex.type : 'ofuscated'} ${getBorderColorClass()} ${isSelected ? 'selected' : ''}`}
      onClick={handleHexClick}
    >
      {pnjInHex && isVisible ? <PnjComp pnj={pnjInHex} /> : ''}
      {cityInHex && isVisible ? <CityComp city={cityInHex} /> : ''}
    </div>
  )
}

export default HexComp
