import {
  isEnemyCity,
  isAllyCity,
  _getCityFromListInHex
} from '../../src/utils/CityUtils';
import { mockCity, mockPlayer1, mockPlayer2 } from '../mocks';

describe('CityUtils unit tests', () => {
  describe('isEnemyCity', () => {
    it('returns true if received pnj is enemy of received active player', () => {
      const res = isEnemyCity(mockCity, mockPlayer2);
      expect(res).toBeTruthy();
    });

    it('returns false if received pnj is NOT enemy of received active player', () => {
      const res = isEnemyCity(mockCity, mockPlayer1);
      expect(res).toBeFalsy();
    });
  });

  describe('isAllyCity', () => {
    it('returns true if received pnj is ally of received active player', () => {
      const res = isAllyCity(mockCity, mockPlayer1);
      expect(res).toBeTruthy();
    });

    it('returns false if received pnj is NOT ally of received active player', () => {
      const res = isAllyCity(mockCity, mockPlayer2);
      expect(res).toBeFalsy();
    });
  });

  describe('_getPnjFromListInHex', () => {
    it('returns found pnj', () => {
      const res = _getCityFromListInHex('1_1', [mockCity]);
      expect(res).toEqual(mockCity);
    });

    it('returns undefined if pnj not found', () => {
      const res = _getCityFromListInHex('1_2', [mockCity]);
      expect(res).toBeUndefined();
    });
  });
});
