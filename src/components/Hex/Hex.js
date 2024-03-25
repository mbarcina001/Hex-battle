import './Hex.css'

export default function Hex ({ id, type, isSelected, setAsSelected }) {
  function handleHexClick () {
    setAsSelected(id)
  }

  return (
    <div
      className={`hex ${isSelected ? 'selected' : ''} ${type}`}
      onClick={handleHexClick}
    />
  )
}
