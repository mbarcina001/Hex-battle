import HexUtils from '../../src/utils/HexUtils';
import Utils from '../../src/utils/Utils';
import { mockBoard } from '../../__mocks__/mocks';

jest.mock('../../src/utils/Utils');

describe('HexUtils unit tests', () => {
  describe('getRandomHexLocationId', () => {
    it('calls aux function with expected params', () => {
      const mockGetRandomInt = Utils.getRandomInt as jest.Mock;
      mockGetRandomInt.mockReturnValueOnce(2);

      HexUtils.getRandomHexLocationId(mockBoard);
      expect(mockGetRandomInt).toHaveBeenCalledWith(mockBoard.length);
      expect(mockGetRandomInt).toHaveBeenCalledWith(mockBoard[2].length);
    });

    it('returns expected location', () => {
      const mockGetRandomInt = Utils.getRandomInt as jest.Mock;
      mockGetRandomInt.mockReturnValueOnce(2);
      mockGetRandomInt.mockReturnValueOnce(1);

      const res = HexUtils.getRandomHexLocationId(mockBoard);
      expect(res).toEqual('1_2');
    });
  });
});
