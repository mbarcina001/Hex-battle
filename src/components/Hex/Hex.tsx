import './Hex.scss'
import React from 'react'

interface HexProps {
  id: string,
  type: string,
  isSelected: boolean,
  isVisible: boolean,
  isDestinationHex: boolean,
  pnjInHex: any,
  cityInHex: any,
  setAsSelected: Function
}

const Hex:React.FC<HexProps> = ({ id, type, isSelected, isVisible, isDestinationHex, pnjInHex, cityInHex, setAsSelected }) => {
  /**
   * Handles click event
   * Sets this Hex as selected if it is visible for active player
   */
  function handleHexClick () {
    if (isVisible) {
      setAsSelected(id)
    }
  }

  return (
    <div
      className={`hex ${isVisible ? type : 'ofuscated'} ${isDestinationHex ? 'destination' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={handleHexClick}
    >
      {pnjInHex && isVisible ? <p className='mb-0'>{pnjInHex.id}</p> : ''}
      {cityInHex && isVisible ? <p className='mb-0'>{cityInHex.id}</p> : ''}
    </div>
  )
}

export default Hex
