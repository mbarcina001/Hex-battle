import { Player } from '../App'
import { Pnj } from '../components/Pnj/Pnj'

export const MAX_HEALTH_POINTS = 10

/**
 * Calculates if received pnj is enemy of received active player
 * @param {Pnj} pnj
 * @param {Player} activePlayer
 * @returns {boolean}
 */
export function isEnemyPnj (pnj: Pnj, activePlayer: Player): boolean {
  return pnj.owner.id !== activePlayer.playerId
}

/**
 * Calculates if received pnj is ally of received active player
 * @param {Pnj} pnj
 * @param {Player} activePlayer
 * @returns {boolean}
 */
export function isAllyPnj (pnj: Pnj, activePlayer: Player): boolean {
  return pnj.owner.id === activePlayer.playerId
}

/**
 * Calculates-attack damage
 * @param {Pnj} attacker
 * @param {Pnj} defender
 * @returns {number}
 */
export function calcDamage (attacker: Pnj, defender: Pnj): number {
  const attackerForce = attacker.attack * (attacker.healthPoints / MAX_HEALTH_POINTS)
  const deffenderForce = defender.defense * (defender.healthPoints / MAX_HEALTH_POINTS)
  return Math.floor(attackerForce - deffenderForce)
}

/**
 * Calculates counter-attack damage
 * @param {Pnj} attacker
 * @param {Pnj} defender
 * @returns {number}
 */
export function calcCounterDamage (attacker: Pnj, defender: Pnj): number {
  const attackerForce = attacker.attack * (attacker.healthPoints / MAX_HEALTH_POINTS)
  return Math.ceil(attackerForce - defender.defense)
}

/**
 * Calculates received pnj healing power
 * @param {Pnj} healer
 * @returns {number}
 */
export function calcHealPower (healer: Pnj): number {
  return healer.attack * (healer.healthPoints / MAX_HEALTH_POINTS)
}

/**
 * Gets hex's occupant pnj if any
 * @param {string} hexId
 * @param {Player[]} playerList
 * @returns {Pnj | undefined}
 */
export function getPnjInHex (hexId: string, playerList: Player[]): Pnj | undefined {
  for (const player of playerList) {
    for (const pnj of player.pnjList) {
      if (pnj.hexLocationId === hexId) {
        return pnj
      }
    }
  }
}
