import {
  MAX_HEALTH_POINTS,
  PNJ_TYPES,
  PNJ_TYPE_NAME,
  Player,
  Pnj,
  PnjType
} from '../App.constants';

/**
 * Class with utilities for pnjs
 */
export default class PnjUtils {
  /**
   * Calculates if received pnj is enemy of received active player
   * @param {Pnj} pnj
   * @param {Player} activePlayer
   * @returns {boolean}
   */
  public static isEnemyPnj(pnj: Pnj, activePlayer: Player): boolean {
    return pnj.owner.id !== activePlayer.playerId;
  }

  /**
   * Calculates if received pnj is ally of received active player
   * @param {Pnj} pnj
   * @param {Player} activePlayer
   * @returns {boolean}
   */
  public static isAllyPnj(pnj: Pnj, activePlayer: Player): boolean {
    return pnj.owner.id === activePlayer.playerId;
  }

  /**
   * Calculates-attack damage
   * @param {Pnj} attacker
   * @param {Pnj} defender
   * @returns {number}
   */
  public static calcDamage(attacker: Pnj, defender: Pnj): number {
    const attackerForce =
      attacker.type.attack *
      ((attacker.healthPoints / attacker.type.maxHealthPoints) * 2);
    const deffenderForce =
      defender.type.defense *
      (defender.healthPoints / defender.type.maxHealthPoints);
    return Math.floor(attackerForce - deffenderForce);
  }

  /**
   * Calculates counter-attack damage
   * @param {Pnj} attacker
   * @param {Pnj} defender
   * @returns {number}
   */
  public static calcCounterDamage(attacker: Pnj, defender: Pnj): number {
    const attackerForce =
      attacker.type.attack *
      ((attacker.healthPoints / attacker.type.maxHealthPoints) * 4);
    return Math.ceil(attackerForce - defender.type.defense);
  }

  /**
   * Calculates received pnj healing power
   * @param {Pnj} healer
   * @returns {number}
   */
  public static calcHealPower(healer: Pnj): number {
    return healer.type.attack * (healer.healthPoints / MAX_HEALTH_POINTS);
  }

  /**
   * Gets hex's occupant pnj from received pnjList if any
   * @param {string} hexId
   * @param {Pnj[]} pnjList
   * @returns {Pnj | undefined}
   */
  public static _getPnjFromListInHex(
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
  public static getPnjInHex(
    hexId: string,
    playerList: Player[]
  ): Pnj | undefined {
    // eslint-disable-next-line no-restricted-syntax
    for (const player of playerList) {
      const foundPnj = this._getPnjFromListInHex(hexId, player.pnjList);
      if (foundPnj) {
        return foundPnj;
      }
    }

    return undefined;
  }

  /**
   * Received Pnj heals another Pnj
   * @param {Pnj} healerPnj
   * @param {Pnj} restoredPnj
   */
  public static healPnj(healerPnj: Pnj, restoredPnj: Pnj): void {
    restoredPnj.healthPoints += this.calcHealPower(healerPnj);

    if (restoredPnj.healthPoints > MAX_HEALTH_POINTS) {
      restoredPnj.healthPoints = MAX_HEALTH_POINTS + 3;
    }

    healerPnj.canMove = false;
  }

  /**
   * Received Pnj heals itself
   * @param {Pnj} pnjToHeal
   */
  public static healSelf(pnjToHeal: Pnj): void {
    pnjToHeal.healthPoints += 3;
    pnjToHeal.canMove = false;
  }

  /**
   * Received Pnj attacks another Pnj
   * @param {Pnj} attackingPnj
   * @param {Pnj} attackedPnj
   * @returns {boolean} - attackedPnj has been killed?
   */
  public static performAttack(attackingPnj: Pnj, attackedPnj: Pnj): boolean {
    attackedPnj.healthPoints -= this.calcDamage(attackingPnj, attackedPnj);
    return attackedPnj.healthPoints <= 0;
  }

  /**
   * Received Pnj counter-attacks another Pnj
   * @param {Pnj} attackingPnj
   * @param {Pnj} attackedPnj
   * @returns {boolean} - attackedPnj has been killed?
   */
  public static performCounterAttack(
    attackingPnj: Pnj,
    attackedPnj: Pnj
  ): boolean {
    attackedPnj.healthPoints -= this.calcCounterDamage(
      attackingPnj,
      attackedPnj
    );
    return attackedPnj.healthPoints <= 0;
  }

  /**
   * Withdraw received Pnj from its Owner's Pnj list
   * @param {Pnj} pnjToWithdraw
   * @param {Player} pnjOwner
   */
  public static withdrawPnj(pnjToWithdraw: Pnj, pnjOwner: Player): void {
    pnjOwner.pnjList = pnjOwner.pnjList.filter(
      (pnj: Pnj) => pnj.id !== pnjToWithdraw.id
    );
  }

  /**
   * Finds pnj in received list with given id if found
   * @param {Pnj[]} pnjList
   * @param {string} pnjId
   * @returns {Pnj | undefined}
   */
  public static findPnjById(pnjList: Pnj[], pnjId: string): Pnj | undefined {
    return pnjList.find((playerPnj) => playerPnj.id === pnjId);
  }

  /**
   * Finds PnjType by received name in constants file
   *  If type not found (which should not ever happen) => returns NO_PNJ type
   * @param {PNJ_TYPE_NAME} name
   * @returns {PnjType}
   */
  public static getPnjTypeByName(name: PNJ_TYPE_NAME): PnjType {
    return PNJ_TYPES.find((type) => type.typeName === name) ?? PNJ_TYPES[0];
  }
}
