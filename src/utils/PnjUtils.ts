import { Player } from '../App'
import { Pnj } from '../components/Pnj/Pnj'

export const MAX_HEALTH_POINTS = 10

export function isPnjEnemy (pnj: Pnj, activePlayer: Player) {
  return pnj.owner.id !== activePlayer.playerId
}

export function isPnjAlly (pnj: Pnj, activePlayer: Player) {
  return pnj.owner.id === activePlayer.playerId
}

export function calcDamage (attacker: Pnj, defender: Pnj): number {
  const attackerForce = attacker.attack * (attacker.healthPoints / MAX_HEALTH_POINTS)
  const deffenderForce = defender.defense * (defender.healthPoints / MAX_HEALTH_POINTS)
  return Math.floor(attackerForce - deffenderForce)
}

export function calcCounterDamage (attacker: Pnj, defender: Pnj): number {
  const attackerForce = attacker.attack * (attacker.healthPoints / MAX_HEALTH_POINTS)
  return Math.ceil(attackerForce - defender.defense)
}

export function calcHealPower (healer: Pnj): number {
  return healer.attack * (healer.healthPoints / MAX_HEALTH_POINTS)
}
