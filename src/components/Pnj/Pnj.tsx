import React, { useState, useEffect } from 'react'

import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext'

import { isAllyPnj } from '../../utils/PnjUtils'

import './Pnj.scss'

export interface PnjOwner {
  id: number,
  color: string
}

export interface Pnj {
  type: string,
  id: string,
  owner: PnjOwner
  canMove: boolean,
  hexLocationId: string,
  attack: number,
  defense: number,
  healthPoints: number
}

interface PnjCompProps {
  pnj: Pnj
}

const PnjComp:React.FC<PnjCompProps> = ({ pnj }) => {
  const [inactivePnj, setInactivePnj] = useState<boolean>(true)

  const activePlayer = useActivePlayerContext()

  useEffect(() => {
    const inactivePnj = !pnj.canMove && isAllyPnj(pnj, activePlayer)
    setInactivePnj(inactivePnj)
  }, [pnj, pnj.canMove, activePlayer])

  return (
    <span className={`${inactivePnj ? 'inactive' : ''}`} style={{ color: pnj.owner.color }}>
      {`Id: ${pnj.id} - Hp: ${pnj.healthPoints}`}
    </span>
  )
}

export default PnjComp
