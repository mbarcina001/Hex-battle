import './Pnj.scss'
import React from 'react'

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
  return (
    <span className={`${pnj.canMove ? '' : 'inactive'}`}>{pnj.id}</span>
  )
}

export default PnjComp
