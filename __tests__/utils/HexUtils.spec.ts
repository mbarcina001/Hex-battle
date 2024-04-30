import { getRandomHexLocationId } from '../../src/utils/HexUtils';
import { getRandomInt } from '../../src/utils/Utils';
import { mockBoard } from '../mocks';

jest.mock('../../src/utils/Utils');

describe('HexUtils unit tests', () => {
  describe('getRandomHexLocationId', () => {
    it('calls aux function with expected params', () => {
      const mockGetRandomInt = getRandomInt as jest.Mock;
      mockGetRandomInt.mockReturnValueOnce(2);

      getRandomHexLocationId(mockBoard);
      expect(mockGetRandomInt).toHaveBeenCalledWith(mockBoard.length);
      expect(mockGetRandomInt).toHaveBeenCalledWith(mockBoard[2].length);
    });

    it('returns expected location', () => {
      const mockGetRandomInt = getRandomInt as jest.Mock;
      mockGetRandomInt.mockReturnValueOnce(2);
      mockGetRandomInt.mockReturnValueOnce(1);

      const res = getRandomHexLocationId(mockBoard);
      expect(res).toEqual('1_2');
    });
  });
});
