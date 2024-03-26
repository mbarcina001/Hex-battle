import './Hex.scss'

export default function Hex ({ id, type, isSelected, pnjInHex, cityInHex, setAsSelected }) {
  function handleHexClick () {
    setAsSelected(id)
  }

  return (
    <div
      className={`hex ${type} ${isSelected ? 'selected' : ''}`}
      onClick={handleHexClick}
    >
      {pnjInHex ? <span>{pnjInHex.id}</span> : ''}
      {cityInHex ? <span>{cityInHex.id}</span> : ''}
    </div>
  )
}
