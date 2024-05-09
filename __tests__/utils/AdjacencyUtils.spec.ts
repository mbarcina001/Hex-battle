import AdjacencyUtils from '../../src/utils/AdjacencyUtils';
import { mockBoard } from '../../__mocks__/mocks';
import ArrayUtils from '../../src/utils/ArrayUtils';

describe('AdjacencyUtils unit tests', () => {
  describe('checkCoordsInBoardBoundaries', () => {
    it('returns true if given coordinates are in board boundaries', () => {
      expect(
        AdjacencyUtils._checkCoordsInBoardBoundaries({
          x: 1,
          y: 1
        })
      ).toBeTruthy();
    });

    it('returns false if given coordinates are NOT in board boundaries', () => {
      expect(
        AdjacencyUtils._checkCoordsInBoardBoundaries({
          x: -1,
          y: 1
        })
      ).toBeFalsy();

      expect(
        AdjacencyUtils._checkCoordsInBoardBoundaries({
          x: 1,
          y: -1
        })
      ).toBeFalsy();

      expect(
        AdjacencyUtils._checkCoordsInBoardBoundaries({
          x: -1,
          y: -1
        })
      ).toBeFalsy();
    });
  });

  describe('_getHorizontalAdjacentCoords', () => {
    it('returns adjacent hexs coords in y axis', () => {
      const res = AdjacencyUtils._getHorizontalAdjacentCoords({
        x: 2,
        y: 2
      });
      expect(res).toEqual([
        {
          x: 2,
          y: 1
        },
        {
          x: 2,
          y: 3
        }
      ]);
    });
  });

  describe('_getVerticalAdjacentCoords', () => {
    it('returns adjacent hexs coords in y axis', () => {
      const res = AdjacencyUtils._getVerticalAdjacentCoords({
        x: 2,
        y: 2
      });
      expect(res).toEqual([
        {
          x: 1,
          y: 2
        },
        {
          x: 3,
          y: 2
        }
      ]);
    });
  });

  describe('_getDiagonalAdjacentCoords', () => {
    it('returns expected result when received coords are above middle row', () => {
      const res = AdjacencyUtils._getDiagonalAdjacentCoords(
        {
          x: 1,
          y: 1
        },
        mockBoard
      );
      expect(res).toEqual([
        {
          x: 0,
          y: 0
        },
        {
          x: 2,
          y: 2
        }
      ]);
    });
    it('returns expected result when received coords are in middle row', () => {
      const res = AdjacencyUtils._getDiagonalAdjacentCoords(
        {
          x: 1,
          y: 2
        },
        mockBoard
      );
      expect(res).toEqual([
        {
          x: 0,
          y: 1
        },
        {
          x: 0,
          y: 3
        }
      ]);
    });
    it('returns expected result when received coords are below middle row', () => {
      const res = AdjacencyUtils._getDiagonalAdjacentCoords(
        {
          x: 1,
          y: 3
        },
        mockBoard
      );
      expect(res).toEqual([
        {
          x: 2,
          y: 2
        },
        {
          x: 0,
          y: 4
        }
      ]);
    });
  });

  describe('parseCoordsFromHexId', () => {
    it('returns coords object from coordId string', () => {
      const res = AdjacencyUtils.parseCoordsFromHexId('1_0');
      expect(res).toEqual({
        x: 1,
        y: 0
      });
    });
  });

  describe('parseHexIdFromCoords', () => {
    it('returns coordId string from coords object', () => {
      const res = AdjacencyUtils.parseHexIdFromCoords({
        x: 1,
        y: 0
      });
      expect(res).toEqual('1_0');
    });
  });

  describe('getAdjacentHexIds', () => {
    it('calls auxiliar function n times when receiving a range', () => {
      const _getAdjacentHexIdsFromArraySpy = jest.spyOn(
        AdjacencyUtils,
        '_getAdjacentHexIdsFromArray'
      );
      _getAdjacentHexIdsFromArraySpy.mockReturnValueOnce([]);
      AdjacencyUtils.getAdjacentHexIds('2_2', mockBoard, 2);
      expect(_getAdjacentHexIdsFromArraySpy).toHaveBeenCalledTimes(2);
    });

    it('calls auxiliar function 1 time when range is not received', () => {
      const _getAdjacentHexIdsFromArraySpy = jest.spyOn(
        AdjacencyUtils,
        '_getAdjacentHexIdsFromArray'
      );
      _getAdjacentHexIdsFromArraySpy.mockReturnValueOnce([]);
      AdjacencyUtils.getAdjacentHexIds('2_2', mockBoard);
      expect(_getAdjacentHexIdsFromArraySpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('_getAdjacentHexIdsFromArray', () => {
    it('calls auxiliar function for every received hexId', () => {
      const _getAdjacentHexIdsSpy = jest.spyOn(
        AdjacencyUtils,
        '_getAdjacentHexIds'
      );
      const _filterRepeatedElementsSpy = jest.spyOn(
        ArrayUtils,
        'filterRepeatedElements'
      );

      const hexIds = ['1_1', '1_2', '2_1', '2_2'];
      AdjacencyUtils._getAdjacentHexIdsFromArray(hexIds, mockBoard);

      expect(_getAdjacentHexIdsSpy).toHaveBeenCalledTimes(hexIds.length);
      expect(_filterRepeatedElementsSpy).toHaveBeenCalled();
    });
  });

  describe('_getAdjacentHexIds', () => {
    it('calls auxiliar functions as expected', () => {
      const _getHorizontalAdjacentCoordsSpy = jest.spyOn(
        AdjacencyUtils,
        '_getHorizontalAdjacentCoords'
      );
      const _getVerticalAdjacentCoordsSpy = jest.spyOn(
        AdjacencyUtils,
        '_getVerticalAdjacentCoords'
      );
      const _getDiagonalAdjacentCoordsSpy = jest.spyOn(
        AdjacencyUtils,
        '_getDiagonalAdjacentCoords'
      );
      const _checkCoordsInBoardBoundariesSpy = jest.spyOn(
        AdjacencyUtils,
        '_checkCoordsInBoardBoundaries'
      );

      const mockParsedCoords = {
        x: 2,
        y: 2
      };
      const parseCoordsFromHexIdSpy = jest.spyOn(
        AdjacencyUtils,
        'parseCoordsFromHexId'
      );
      parseCoordsFromHexIdSpy.mockReturnValueOnce(mockParsedCoords);
      _getHorizontalAdjacentCoordsSpy.mockReturnValueOnce([
        {
          x: 1,
          y: 2
        }
      ]);
      _getVerticalAdjacentCoordsSpy.mockReturnValueOnce([
        {
          x: 2,
          y: 1
        }
      ]);
      _getDiagonalAdjacentCoordsSpy.mockReturnValueOnce([
        {
          x: -1,
          y: 1
        }
      ]);

      AdjacencyUtils._getAdjacentHexIds('2_2', mockBoard);

      expect(_getHorizontalAdjacentCoordsSpy).toHaveBeenCalledWith(
        mockParsedCoords
      );
      expect(_getVerticalAdjacentCoordsSpy).toHaveBeenCalledWith(
        mockParsedCoords
      );
      expect(_getDiagonalAdjacentCoordsSpy).toHaveBeenCalledWith(
        mockParsedCoords,
        mockBoard
      );
      expect(_checkCoordsInBoardBoundariesSpy).toHaveBeenCalledWith({
        x: 1,
        y: 2
      });
      expect(_checkCoordsInBoardBoundariesSpy).toHaveBeenCalledWith({
        x: 2,
        y: 1
      });
      expect(_checkCoordsInBoardBoundariesSpy).toHaveBeenCalledWith({
        x: 1,
        y: 2
      });
    });
  });
});
