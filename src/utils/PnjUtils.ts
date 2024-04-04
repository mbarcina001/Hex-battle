import { Player } from '../App'
import { Pnj } from '../components/Pnj/Pnj'

export function isPnjEnemy (pnj: Pnj, activePlayer: Player) {
  return pnj.owner !== activePlayer.playerId
}

export function isPnjAlly (pnj: Pnj, activePlayer: Player) {
  return pnj.owner === activePlayer.playerId
}
