import './Hex.scss'

export default function Hex ({ id, type, isSelected, isVisible, isDestinationHex, pnjInHex, cityInHex, setAsSelected }) {
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
