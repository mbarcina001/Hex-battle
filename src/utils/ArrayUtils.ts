/**
 * Class with utilities for arrays
 */
export default class ArrayUtils {
  /**
   * Returns received array after filtering out repeated values
   * @param {string[]} array
   * @returns {string[]}
   */
  public static filterRepeatedElements(array: string[]): string[] {
    const onlyUnique = (
      value: string,
      index: number,
      self: string[]
    ): boolean => {
      return self.indexOf(value) === index;
    };

    return array.filter(onlyUnique);
  }
}
