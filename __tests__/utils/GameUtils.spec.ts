import { checkWinner } from '../../src/utils/GameUtils';
import { mockPlayer1, mockPlayer2, mockCity } from '../mocks';

describe('GameUtils unit tests', () => {
  describe('checkWinner', () => {
    it('returns true if all players but one have no cities', () => {
      const res = checkWinner([mockPlayer1, mockPlayer2]);
      expect(res).toBeTruthy();
    });

    it('returns false if more than one player have at least one city', () => {
      mockPlayer2.cityList.push(mockCity);
      const res = checkWinner([mockPlayer1, mockPlayer2]);
      expect(res).toBeFalsy();
    });
  });
});
