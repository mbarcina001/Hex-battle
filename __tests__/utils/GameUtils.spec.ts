import GameUtils from '../../src/utils/GameUtils';
import {
  mockCity1,
  mockCity2,
  mockPlayer1,
  mockPlayer2
} from '../../__mocks__/mocks';

describe('GameUtils unit tests', () => {
  describe('checkWinner', () => {
    it('returns true if all players but one have no cities', () => {
      const res = GameUtils.checkWinner(
        [mockPlayer1, mockPlayer2],
        [
          {
            ...mockCity1,
            owner: {
              id: mockPlayer1.playerId,
              color: mockPlayer1.playerColor
            }
          },
          {
            ...mockCity2,
            owner: {
              id: mockPlayer1.playerId,
              color: mockPlayer1.playerColor
            }
          }
        ]
      );
      expect(res).toBeTruthy();
    });

    it('returns false if more than one player have at least one city', () => {
      const res = GameUtils.checkWinner(
        [mockPlayer1, mockPlayer2],
        [
          {
            ...mockCity1,
            owner: {
              id: mockPlayer1.playerId,
              color: mockPlayer1.playerColor
            }
          },
          {
            ...mockCity2,
            owner: {
              id: mockPlayer2.playerId,
              color: mockPlayer2.playerColor
            }
          }
        ]
      );
      expect(res).toBeFalsy();
    });
  });
});
