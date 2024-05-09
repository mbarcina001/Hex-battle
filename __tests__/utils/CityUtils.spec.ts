import CityUtils from '../../src/utils/CityUtils';
import { mockCity, mockPlayer1, mockPlayer2 } from '../../__mocks__/mocks';

describe('CityUtils unit tests', () => {
  describe('isEnemyCity', () => {
    it('returns true if received city is enemy of received active player', () => {
      const res = CityUtils.isEnemyCity(mockCity, mockPlayer2);
      expect(res).toBeTruthy();
    });

    it('returns false if received city is NOT enemy of received active player', () => {
      const res = CityUtils.isEnemyCity(mockCity, mockPlayer1);
      expect(res).toBeFalsy();
    });
  });

  describe('isAllyCity', () => {
    it('returns true if received city is ally of received active player', () => {
      const res = CityUtils.isAllyCity(mockCity, mockPlayer1);
      expect(res).toBeTruthy();
    });

    it('returns false if received city is NOT ally of received active player', () => {
      const res = CityUtils.isAllyCity(mockCity, mockPlayer2);
      expect(res).toBeFalsy();
    });
  });
});
