import { getAdjacentHexIds } from '../../src/utils/AdjacencyUtils';
import { getRandomHexLocationId } from '../../src/utils/HexUtils';
import {
  getActivePlayer,
  getInitialPlayer,
  getDummyPlayer
} from '../../src/utils/PlayerUtils';
import { mockBoard, mockCity, mockPlayer1 } from '../../__mocks__/mocks';

jest.mock('../../src/utils/HexUtils');
jest.mock('../../src/utils/AdjacencyUtils');

describe('PlayerUtils unit tests', () => {
  describe('getActivePlayer', () => {
    it('returns undefined if playerList is empty', () => {
      expect(getActivePlayer([], 1)).toBeUndefined();
    });

    it('returns undefined if activePlayer id is negative', () => {
      expect(getActivePlayer([mockPlayer1], -1)).toBeUndefined();
    });

    it('returns active player if found', () => {
      expect(getActivePlayer([mockPlayer1], 1)).not.toBeUndefined();
      expect(getActivePlayer([mockPlayer1], 1)).toEqual(mockPlayer1);
    });

    it('returns active player if NOT found', () => {
      expect(getActivePlayer([mockPlayer1], 3)).toBeUndefined();
    });
  });

  describe('getInitialPlayer', () => {
    it('returns intial player', () => {
      const mockGetRandomHexLocationId = getRandomHexLocationId as jest.Mock;
      mockGetRandomHexLocationId.mockReturnValueOnce('1_1');

      const mockGetAdjacentHexIds = getAdjacentHexIds as jest.Mock;
      mockGetAdjacentHexIds.mockReturnValueOnce([
        '0_0',
        '0_1',
        '1_0',
        '1_2',
        '2_0',
        '2_1'
      ]);

      const res = getInitialPlayer(1, 'red', mockBoard, [mockCity]);

      expect(res).toBeDefined();
      expect(res).toHaveProperty('playerId');
      expect(res.playerId).toEqual(1);
      expect(res).toHaveProperty('playerColor');
      expect(res.playerColor).toEqual('red');
      expect(res).toHaveProperty('pnjList');
      expect(res.pnjList).toHaveLength(1);
      expect(res).toHaveProperty('visibleHexsIds');
      expect(res.visibleHexsIds).toHaveLength(7);
    });
  });

  describe('getDummyPlayer', () => {
    it('returns dummy player', () => {
      const res = getDummyPlayer();
      expect(res).toBeDefined();
    });
  });
});
