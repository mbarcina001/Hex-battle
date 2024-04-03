import { Pnj } from '../components/Pnj/Pnj'

export function isPnjEnemy (pnj: Pnj, activePlayer: number) {
  return pnj.owner !== activePlayer
}

export function isPnjAlly (pnj: Pnj, activePlayer: number) {
  return pnj.owner === activePlayer
}
