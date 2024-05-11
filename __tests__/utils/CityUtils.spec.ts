import CityUtils from '../../src/utils/CityUtils';
import {
  mockBoard,
  mockBuilding,
  mockCity1,
  mockEmptyCity,
  mockPlayer1,
  mockPlayer2
} from '../../__mocks__/mocks';
import HexUtils from '../../src/utils/HexUtils';
import { CITY_NAMES } from '../../src/App.constants';
import Utils from '../../src/utils/Utils';
import AdjacencyUtils from '../../src/utils/AdjacencyUtils';

describe('CityUtils unit tests', () => {
  describe('isEnemyCity', () => {
    it('returns true if received city is enemy of received active player', () => {
      const res = CityUtils.isEnemyCity(mockCity1, mockPlayer2);
      expect(res).toBeTruthy();
    });

    it('returns false if received city is NOT enemy of received active player', () => {
      const res = CityUtils.isEnemyCity(mockCity1, mockPlayer1);
      expect(res).toBeFalsy();
    });
  });

  describe('isAllyCity', () => {
    it('returns true if received city is ally of received active player', () => {
      const res = CityUtils.isAllyCity(mockCity1, mockPlayer1);
      expect(res).toBeTruthy();
    });

    it('returns false if received city is NOT ally of received active player', () => {
      const res = CityUtils.isAllyCity(mockCity1, mockPlayer2);
      expect(res).toBeFalsy();
    });
  });

  describe('getCityInHex', () => {
    it('returns undefined if city not found', () => {
      const res = CityUtils.getCityInHex('7_7', [mockCity1]);
      expect(res).toBeUndefined();
    });

    it('returns found city', () => {
      const res = CityUtils.getCityInHex(mockCity1.hexLocationId, [mockCity1]);
      expect(res).toEqual(mockCity1);
    });
  });

  describe('getBuildingInHex', () => {
    it('returns undefined if building not found', () => {
      const res = CityUtils.getBuildingInHex('7_7', [mockCity1]);
      expect(res).toBeUndefined();
    });

    it('returns found building', () => {
      const cityWithBuilding = {
        ...mockCity1,
        buildings: [mockBuilding]
      };
      const res = CityUtils.getBuildingInHex(mockCity1.hexLocationId, [
        cityWithBuilding
      ]);
      expect(res).toEqual(mockBuilding);
    });
  });

  describe('captureCity', () => {
    it('changes City ownership', () => {
      const cityToCapture = {
        ...mockCity1,
        owner: undefined
      };

      CityUtils.captureCity(cityToCapture, mockPlayer1);

      expect(cityToCapture.owner).toEqual({
        id: mockPlayer1.playerId,
        color: mockPlayer1.playerColor
      });
    });
  });

  describe('getInitialCity', () => {
    it('calls aux functions', () => {
      const _getCityNameSpy = jest.spyOn(CityUtils, '_getCityName');
      const _getCityLocationId = jest.spyOn(CityUtils, '_getCityLocationId');

      CityUtils.getInitialCity([], mockBoard);

      expect(_getCityNameSpy).toHaveBeenCalledTimes(1);
      expect(_getCityLocationId).toHaveBeenCalledTimes(1);
    });
  });

  describe('_getCityLocationId', () => {
    const getRandomHexLocationIdSpy = jest.spyOn(
      HexUtils,
      'getRandomHexLocationId'
    );
    const _checkLocationOrSurroundingsOccupiedSpy = jest.spyOn(
      CityUtils,
      '_checkLocationOrSurroundingsOccupied'
    );

    it('retrieves a location', () => {
      getRandomHexLocationIdSpy.mockReturnValueOnce('1_1');
      _checkLocationOrSurroundingsOccupiedSpy.mockReturnValueOnce(false);

      const res = CityUtils._getCityLocationId([], mockBoard);

      expect(getRandomHexLocationIdSpy).toHaveBeenCalledTimes(1);
      expect(_checkLocationOrSurroundingsOccupiedSpy).toHaveBeenCalledTimes(1);
      expect(res).toEqual('1_1');
    });

    it('calls function again if first location is occupied', () => {
      const _getCityLocationIdSpy = jest.spyOn(CityUtils, '_getCityLocationId');
      getRandomHexLocationIdSpy.mockReturnValueOnce('1_1');
      _checkLocationOrSurroundingsOccupiedSpy.mockReturnValueOnce(true);
      getRandomHexLocationIdSpy.mockReturnValueOnce('2_2');
      _checkLocationOrSurroundingsOccupiedSpy.mockReturnValueOnce(false);

      const res = CityUtils._getCityLocationId([], mockBoard);

      expect(getRandomHexLocationIdSpy).toHaveBeenCalledTimes(1);
      expect(_checkLocationOrSurroundingsOccupiedSpy).toHaveBeenCalledTimes(1);
      expect(_getCityLocationIdSpy).toHaveBeenCalledTimes(2);
      expect(res).toEqual('2_2');
    });
  });

  describe('_getCityName', () => {
    const getRandomIntSpy = jest.spyOn(Utils, 'getRandomInt');

    it('retrieves a random name', () => {
      getRandomIntSpy.mockReturnValueOnce(0);
      const res = CityUtils._getCityName([]);
      expect(res).toEqual(CITY_NAMES[0]);
    });

    it('calls function again if first location is name is taken', () => {
      const _getCityNameSpy = jest.spyOn(CityUtils, '_getCityName');

      getRandomIntSpy.mockReturnValueOnce(0);
      getRandomIntSpy.mockReturnValueOnce(1);

      const res = CityUtils._getCityName([
        {
          ...mockCity1,
          name: CITY_NAMES[0]
        }
      ]);

      expect(_getCityNameSpy).toHaveBeenCalledTimes(2);
      expect(res).toEqual(CITY_NAMES[1]);
    });
  });

  describe('getEmptyCity', () => {
    const getRandomIntSpy = jest.spyOn(Utils, 'getRandomInt');

    it('returns a random empty city', () => {
      getRandomIntSpy.mockReturnValueOnce(1);
      const res = CityUtils.getEmptyCity([mockCity1, mockEmptyCity]);
      expect(res).toEqual(mockEmptyCity);
    });

    it('calls again when found a non empty city', () => {
      const getEmptyCitySpy = jest.spyOn(CityUtils, 'getEmptyCity');

      getRandomIntSpy.mockReturnValueOnce(0);
      getRandomIntSpy.mockReturnValueOnce(1);

      const res = CityUtils.getEmptyCity([mockCity1, mockEmptyCity]);

      expect(res).toEqual(mockEmptyCity);
      expect(getEmptyCitySpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('_checkLocationOrSurroundingsOccupied', () => {
    it('returns true if location is occupied', () => {
      const res = CityUtils._checkLocationOrSurroundingsOccupied(
        mockCity1.hexLocationId,
        [mockCity1],
        mockBoard
      );
      expect(res).toBeTruthy();
    });

    it('returns true if surroundings are occupied', () => {
      jest
        .spyOn(AdjacencyUtils, 'getAdjacentHexIds')
        .mockReturnValueOnce([mockCity1.hexLocationId]);

      const res = CityUtils._checkLocationOrSurroundingsOccupied(
        '3_3',
        [mockCity1],
        mockBoard
      );

      expect(res).toBeTruthy();
    });

    it('returns false if not location neither surroundings are occupied', () => {
      const res = CityUtils._checkLocationOrSurroundingsOccupied(
        '1_1',
        [],
        mockBoard
      );
      expect(res).toBeFalsy();
    });
  });

  describe('', () => {
    it('returns expected value for capital city with no buildings', () => {
      const res = CityUtils.calculateCityEarningsOnTurnStart(mockCity1);
      expect(res).toEqual(2);
    });

    it('returns expected value for non capital city with no buildings', () => {
      const res = CityUtils.calculateCityEarningsOnTurnStart({
        ...mockCity1,
        isCapitalCity: false
      });
      expect(res).toEqual(1);
    });

    it('returns expected value for capital city with buildings', () => {
      const res = CityUtils.calculateCityEarningsOnTurnStart({
        ...mockCity1,
        buildings: [mockBuilding]
      });
      expect(res).toEqual(2 + mockBuilding.type.goldEarnings);
    });

    it('returns expected value for non capital city with buildings', () => {
      const res = CityUtils.calculateCityEarningsOnTurnStart({
        ...mockCity1,
        isCapitalCity: false,
        buildings: [mockBuilding]
      });
      expect(res).toEqual(1 + mockBuilding.type.goldEarnings);
    });
  });

  describe('getAdjacentCityIfAny', () => {
    const getAdjacentHexIdsSpy = jest.spyOn(
      AdjacencyUtils,
      'getAdjacentHexIds'
    );
    const getCityInHex = jest.spyOn(CityUtils, 'getCityInHex');

    it('returns undefined if no adjacent city found', () => {
      getAdjacentHexIdsSpy.mockReturnValueOnce(['1_1']);
      getCityInHex.mockReturnValueOnce(undefined);
      const res = CityUtils.getAdjacentCityIfAny('1_1', mockBoard, []);
      expect(res).toBeUndefined();
    });
    it('returns a city if adjacent city found', () => {
      getAdjacentHexIdsSpy.mockReturnValueOnce(['1_1']);
      getCityInHex.mockReturnValueOnce(mockCity1);
      const res = CityUtils.getAdjacentCityIfAny('1_1', mockBoard, []);
      expect(res).not.toBeUndefined();
    });
  });
});
