import { isPnjAlly } from '../../utils/PnjUtils'
import './Pnj.scss'
import React, { useState, useEffect } from 'react'

export interface Pnj {
  type: string,
  id: string,
  owner: number,
  canMove: boolean,
  hexLocationId: string
}

interface PnjCompProps {
  pnj: Pnj,
  activePlayer: number
}

const PnjComp:React.FC<PnjCompProps> = ({ pnj, activePlayer }) => {
  const [inactivePnj, setInactivePnj] = useState<boolean>(true)

  useEffect(() => {
    const inactivePnj = !pnj.canMove && isPnjAlly(pnj, activePlayer)
    setInactivePnj(inactivePnj)
  }, [pnj, pnj.canMove, activePlayer])

  return (
    <span className={`${inactivePnj ? 'inactive' : ''}`}>{pnj.id}</span>
  )
}

export default PnjComp
