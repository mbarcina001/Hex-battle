import { useState } from 'react'
import Hex from '../Hex/Hex'
import { BOARD_TYPES } from '../../App.constants'

export default function Board () {
  const [selectedNodeKey, setSelectedNodeKey] = useState('')

  return (
    <>
      {BOARD_TYPES.map((boardRow, idx) => (
        <div key={idx}>
          {boardRow.map((boardHexType, jdx) => (
            <Hex
              id={`${idx}_${jdx}`}
              key={`${idx}_${jdx}`}
              type={boardHexType}
              isSelected={selectedNodeKey === `${idx}_${jdx}`}
              setAsSelected={setSelectedNodeKey}
            />
          ))}
        </div>
      ))}
    </>
  )
}
