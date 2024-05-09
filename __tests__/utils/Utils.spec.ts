import Utils from '../../src/utils/Utils';

describe('Utils unit tests', () => {
  describe('getRandomInt', () => {
    it('returns expected result', () => {
      jest.spyOn(Math, 'random').mockReturnValueOnce(0.5);
      const res = Utils.getRandomInt(10);
      expect(res).toEqual(5);
    });
  });
});
