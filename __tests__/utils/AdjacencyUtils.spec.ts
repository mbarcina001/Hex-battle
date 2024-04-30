import {
  _checkCoordsInBoardBoundaries,
  _getHorizontalAdjacentCoords,
  _getVerticalAdjacentCoords,
  _getDiagonalAdjacentCoords,
  parseCoordsFromHexId,
  parseHexIdFromCoords
} from '../../src/utils/AdjacencyUtils';
import { mockBoard } from '../../__mocks__/mocks';

describe('PnjUtils unit tests', () => {
  describe('checkCoordsInBoardBoundaries', () => {
    it('returns true if given coordinates are in board boundaries', () => {
      expect(
        _checkCoordsInBoardBoundaries({
          x: 1,
          y: 1
        })
      ).toBeTruthy();
    });

    it('returns false if given coordinates are NOT in board boundaries', () => {
      expect(
        _checkCoordsInBoardBoundaries({
          x: -1,
          y: 1
        })
      ).toBeFalsy();

      expect(
        _checkCoordsInBoardBoundaries({
          x: 1,
          y: -1
        })
      ).toBeFalsy();

      expect(
        _checkCoordsInBoardBoundaries({
          x: -1,
          y: -1
        })
      ).toBeFalsy();
    });
  });

  describe('_getHorizontalAdjacentCoords', () => {
    it('returns adjacent hexs coords in y axis', () => {
      const res = _getHorizontalAdjacentCoords({
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
      const res = _getVerticalAdjacentCoords({
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
      const res = _getDiagonalAdjacentCoords(
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
      const res = _getDiagonalAdjacentCoords(
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
      const res = _getDiagonalAdjacentCoords(
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
      const res = parseCoordsFromHexId('1_0');
      expect(res).toEqual({
        x: 1,
        y: 0
      });
    });
  });

  describe('parseHexIdFromCoords', () => {
    it('returns coordId string from coords object', () => {
      const res = parseHexIdFromCoords({
        x: 1,
        y: 0
      });
      expect(res).toEqual('1_0');
    });
  });
});
