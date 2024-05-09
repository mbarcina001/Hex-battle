import ArrayUtils from '../../src/utils/ArrayUtils';

describe('ArrayUtils unit tests', () => {
  describe('filterRepeatedElements', () => {
    it('returns received array without repeated values', () => {
      const array = ['1_1', '1_2', '1_1', '2_1', '2_1', '2_1', '2_2', '1_1'];
      const res = ArrayUtils.filterRepeatedElements(array);
      expect(res).toHaveLength(4);
      expect(res[0]).toEqual('1_1');
      expect(res[1]).toEqual('1_2');
      expect(res[2]).toEqual('2_1');
      expect(res[3]).toEqual('2_2');
    });
  });
});
