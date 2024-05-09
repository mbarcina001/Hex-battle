/**
 * Class with common utilities
 */
export default class Utils {
  /**
   * Returns random number from 0 to given param
   * @param { number } max
   * @returns {number}
   */
  public static getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }
}
