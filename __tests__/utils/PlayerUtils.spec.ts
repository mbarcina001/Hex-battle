import AdjacencyUtils from '../../src/utils/AdjacencyUtils';
import PlayerUtils from '../../src/utils/PlayerUtils';

import {
  mockBoard,
  mockCity1,
  mockCity2,
  mockPlayer1,
  mockPnjType
} from '../../__mocks__/mocks';
import CityUtils from '../../src/utils/CityUtils';
import PnjUtils from '../../src/utils/PnjUtils';

jest.mock('../../src/utils/HexUtils');
jest.mock('../../src/utils/AdjacencyUtils');

describe('PlayerUtils unit tests', () => {
  describe('getActivePlayer', () => {
    it('returns undefined if playerList is empty', () => {
      expect(PlayerUtils.getActivePlayer([], 1)).toBeUndefined();
    });

    it('returns undefined if activePlayer id is negative', () => {
      expect(PlayerUtils.getActivePlayer([mockPlayer1], -1)).toBeUndefined();
    });

    it('returns active player if found', () => {
      expect(PlayerUtils.getActivePlayer([mockPlayer1], 1)).not.toBeUndefined();
      expect(PlayerUtils.getActivePlayer([mockPlayer1], 1)).toEqual(
        mockPlayer1
      );
    });

    it('returns active player if NOT found', () => {
      expect(PlayerUtils.getActivePlayer([mockPlayer1], 3)).toBeUndefined();
    });
  });

  describe('getInitialPlayer', () => {
    it('returns intial player', () => {
      const getEmptyCitySpy = jest
        .spyOn(CityUtils, 'getEmptyCity')
        .mockReturnValueOnce(mockCity1);
      const getPnjTypeByName = jest
        .spyOn(PnjUtils, 'getPnjTypeByName')
        .mockReturnValueOnce(mockPnjType);
      const mockGetAdjacentHexIds =
        AdjacencyUtils.getAdjacentHexIds as jest.Mock;
      mockGetAdjacentHexIds.mockReturnValueOnce([
        '0_0',
        '0_1',
        '1_0',
        '1_2',
        '2_0',
        '2_1'
      ]);

      const res = PlayerUtils.getInitialPlayer(1, 'red', mockBoard, [
        mockCity1
      ]);

      expect(getEmptyCitySpy).toHaveBeenCalledTimes(1);
      expect(getPnjTypeByName).toHaveBeenCalledTimes(1);
      expect(mockGetAdjacentHexIds).toHaveBeenCalledTimes(1);

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

  describe('findPlayerById', () => {
    it('returns found player', () => {
      const res = PlayerUtils.findPlayerById(
        [mockPlayer1],
        mockPlayer1.playerId
      );
      expect(res).toEqual(mockPlayer1);
    });

    it('returns undefined if no player found', () => {
      const res = PlayerUtils.findPlayerById([], 1);
      expect(res).toBeUndefined();
    });
  });

  describe('getDummyPlayer', () => {
    it('returns dummy player', () => {
      const res = PlayerUtils.getDummyPlayer();
      expect(res).toBeDefined();
    });
  });

  describe('calculatePlayerGoldOnTurnStart', () => {
    it('calls uax functions + returns expected value', () => {
      const isAllyCitySpy = jest.spyOn(CityUtils, 'isAllyCity');
      const calculateCityEarningsOnTurnStartSpy = jest.spyOn(
        CityUtils,
        'calculateCityEarningsOnTurnStart'
      );

      isAllyCitySpy.mockReturnValueOnce(true);
      isAllyCitySpy.mockReturnValueOnce(false);
      calculateCityEarningsOnTurnStartSpy.mockReturnValue(4);

      const res = PlayerUtils.calculatePlayerGoldOnTurnStart(mockPlayer1, [
        mockCity1,
        mockCity2
      ]);

      expect(isAllyCitySpy).toHaveBeenCalledTimes(2);
      expect(calculateCityEarningsOnTurnStartSpy).toHaveBeenCalledTimes(1);
      expect(res).toEqual(4);
    });
  });
});
