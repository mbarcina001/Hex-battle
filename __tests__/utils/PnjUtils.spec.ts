import { isEnemyPnj } from '../../src/utils/PnjUtils';
import { mockPnj, mockPlayer1, mockPlayer2 } from '../mocks';

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
});
