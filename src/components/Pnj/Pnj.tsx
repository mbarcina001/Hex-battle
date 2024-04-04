import React, { useState, useEffect } from 'react'

import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext'

import { isPnjAlly } from '../../utils/PnjUtils'

import './Pnj.scss'

export interface Pnj {
  type: string,
  id: string,
  owner: number,
  canMove: boolean,
  hexLocationId: string
}

interface PnjCompProps {
  pnj: Pnj
}

const PnjComp:React.FC<PnjCompProps> = ({ pnj }) => {
  const [inactivePnj, setInactivePnj] = useState<boolean>(true)

  const activePlayer = useActivePlayerContext()

  useEffect(() => {
    const inactivePnj = !pnj.canMove && isPnjAlly(pnj, activePlayer)
    setInactivePnj(inactivePnj)
  }, [pnj, pnj.canMove, activePlayer])

  return (
    <span className={`${inactivePnj ? 'inactive' : ''}`}>{pnj.id}</span>
  )
}

export default PnjComp
