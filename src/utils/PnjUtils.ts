import { MAX_HEALTH_POINTS, Player, Pnj } from '../App.constants';

/**
 * Calculates if received pnj is enemy of received active player
 * @param {Pnj} pnj
 * @param {Player} activePlayer
 * @returns {boolean}
 */
export function isEnemyPnj(pnj: Pnj, activePlayer: Player): boolean {
  return pnj.owner.id !== activePlayer.playerId;
}

/**
 * Calculates if received pnj is ally of received active player
 * @param {Pnj} pnj
 * @param {Player} activePlayer
 * @returns {boolean}
 */
export function isAllyPnj(pnj: Pnj, activePlayer: Player): boolean {
  return pnj.owner.id === activePlayer.playerId;
}

/**
 * Calculates-attack damage
 * @param {Pnj} attacker
 * @param {Pnj} defender
 * @returns {number}
 */
export function calcDamage(attacker: Pnj, defender: Pnj): number {
  const attackerForce =
    attacker.attack * (attacker.healthPoints / MAX_HEALTH_POINTS);
  const deffenderForce =
    defender.defense * (defender.healthPoints / MAX_HEALTH_POINTS);
  return Math.floor(attackerForce - deffenderForce);
}

/**
 * Calculates counter-attack damage
 * @param {Pnj} attacker
 * @param {Pnj} defender
 * @returns {number}
 */
export function calcCounterDamage(attacker: Pnj, defender: Pnj): number {
  const attackerForce =
    attacker.attack * (attacker.healthPoints / MAX_HEALTH_POINTS);
  return Math.ceil(attackerForce - defender.defense);
}

/**
 * Calculates received pnj healing power
 * @param {Pnj} healer
 * @returns {number}
 */
export function calcHealPower(healer: Pnj): number {
  return healer.attack * (healer.healthPoints / MAX_HEALTH_POINTS);
}

/**
 * Gets hex's occupant pnj from received pnjList if any
 * @param {string} hexId
 * @param {Player[]} playerList
 * @returns {Pnj | undefined}
 */
export function _getPnjFromListInHex(
  hexId: string,
  pnjList: Pnj[]
): Pnj | undefined {
  return pnjList.find((pnj) => {
    if (pnj.hexLocationId === hexId) {
      return pnj;
    }
    return undefined;
  });
}

/**
 * Gets hex's occupant pnj if any
 * @param {string} hexId
 * @param {Player[]} playerList
 * @returns {Pnj | undefined}
 */
export function getPnjInHex(
  hexId: string,
  playerList: Player[]
): Pnj | undefined {
  // eslint-disable-next-line no-restricted-syntax
  for (const player of playerList) {
    const foundPnj = _getPnjFromListInHex(hexId, player.pnjList);
    if (foundPnj) {
      return foundPnj;
    }
  }

  return undefined;
}

export function healPnj(healerPnj: Pnj, restoredPnj: Pnj): void {
  restoredPnj.healthPoints += calcHealPower(healerPnj);

  if (restoredPnj.healthPoints > MAX_HEALTH_POINTS) {
    restoredPnj.healthPoints = MAX_HEALTH_POINTS + 3;
  }

  healerPnj.canMove = false;
}

export function healSelf(pnjToHeal: Pnj): void {
  pnjToHeal.healthPoints += 3;
  pnjToHeal.canMove = false;
}

export function performAttack(attackingPnj: Pnj, attackedPnj: Pnj): boolean {
  attackedPnj.healthPoints -= calcDamage(attackingPnj, attackedPnj);
  return attackedPnj.healthPoints <= 0;
}

export function performCounterAttack(
  attackingPnj: Pnj,
  attackedPnj: Pnj
): boolean {
  attackedPnj.healthPoints -= calcCounterDamage(attackingPnj, attackedPnj);
  return attackedPnj.healthPoints <= 0;
}

export function withdrawPnj(pnjToWithdraw: Pnj, pnjOwner: Player): void {
  pnjOwner.pnjList = pnjOwner.pnjList.filter(
    (pnj: Pnj) => pnj.id !== pnjToWithdraw.id
  );
}

export function findPnjById(pnjList: Pnj[], pnjId: string): Pnj | undefined {
  return pnjList.find((playerPnj) => playerPnj.id === pnjId);
}
