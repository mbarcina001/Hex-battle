import {
  isEnemyPnj,
  isAllyPnj,
  _getPnjFromListInHex
} from '../../src/utils/PnjUtils';
import { mockPnj, mockPlayer1, mockPlayer2 } from '../../__mocks__/mocks';

describe('PnjUtils unit tests', () => {
  describe('isEnemyPnj', () => {
    it('returns true if received pnj is enemy of received active player', () => {
      const res = isEnemyPnj(mockPnj, mockPlayer2);
      expect(res).toBeTruthy();
    });

    it('returns false if received pnj is NOT enemy of received active player', () => {
      const res = isEnemyPnj(mockPnj, mockPlayer1);
      expect(res).toBeFalsy();
    });
  });

  describe('isAllyPnj', () => {
    it('returns true if received pnj is ally of received active player', () => {
      const res = isAllyPnj(mockPnj, mockPlayer1);
      expect(res).toBeTruthy();
    });

    it('returns false if received pnj is NOT ally of received active player', () => {
      const res = isAllyPnj(mockPnj, mockPlayer2);
      expect(res).toBeFalsy();
    });
  });

  describe('_getPnjFromListInHex', () => {
    it('returns found pnj', () => {
      const res = _getPnjFromListInHex('1_1', [mockPnj]);
      expect(res).toEqual(mockPnj);
    });

    it('returns undefined if pnj not found', () => {
      const res = _getPnjFromListInHex('1_2', [mockPnj]);
      expect(res).toBeUndefined();
    });
  });
});
