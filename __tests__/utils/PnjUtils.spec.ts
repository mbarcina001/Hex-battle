import PnjUtils from '../../src/utils/PnjUtils';
import {
  mockPnj,
  mockPlayer1,
  mockPlayer2,
  mockPnjType
} from '../../__mocks__/mocks';

describe('PnjUtils unit tests', () => {
  describe('isEnemyPnj', () => {
    it('returns true if received pnj is enemy of received active player', () => {
      const res = PnjUtils.isEnemyPnj(mockPnj, mockPlayer2);
      expect(res).toBeTruthy();
    });

    it('returns false if received pnj is NOT enemy of received active player', () => {
      const res = PnjUtils.isEnemyPnj(mockPnj, mockPlayer1);
      expect(res).toBeFalsy();
    });
  });

  describe('isAllyPnj', () => {
    it('returns true if received pnj is ally of received active player', () => {
      const res = PnjUtils.isAllyPnj(mockPnj, mockPlayer1);
      expect(res).toBeTruthy();
    });

    it('returns false if received pnj is NOT ally of received active player', () => {
      const res = PnjUtils.isAllyPnj(mockPnj, mockPlayer2);
      expect(res).toBeFalsy();
    });
  });

  describe('_getPnjFromListInHex', () => {
    it('returns found pnj', () => {
      const res = PnjUtils._getPnjFromListInHex('1_1', [mockPnj]);
      expect(res).toEqual(mockPnj);
    });

    it('returns undefined if pnj not found', () => {
      const res = PnjUtils._getPnjFromListInHex('1_2', [mockPnj]);
      expect(res).toBeUndefined();
    });
  });

  describe('getPnjInHex', () => {
    const getPnjInHex = jest.spyOn(PnjUtils, 'getPnjInHex');

    it('returns pnj if found', () => {
      getPnjInHex.mockReturnValueOnce(mockPnj);
      const res = PnjUtils.getPnjInHex('1_2', [mockPlayer1]);
      expect(res).toEqual(mockPnj);
    });

    it('returns undefined if no pnj found', () => {
      getPnjInHex.mockReturnValueOnce(undefined);
      const res = PnjUtils.getPnjInHex('1_2', [mockPlayer1]);
      expect(res).toBeUndefined();
    });
  });

  describe('healSelf', () => {
    it('increments pnj health', () => {
      const pnjToHeal = {
        ...mockPnj,
        healthPoints: 4,
        canMove: true
      };

      PnjUtils.healSelf(pnjToHeal);

      expect(pnjToHeal.healthPoints).toEqual(7);
      expect(pnjToHeal.canMove).toBeFalsy();
    });
  });

  describe('withdrawPnj', () => {
    it('widthdraws received pnj from list', () => {
      const pnjList = [mockPnj];
      const mockPlayer1WithPnj = {
        ...mockPlayer1,
        pnjList
      };
      PnjUtils.withdrawPnj(mockPnj, mockPlayer1WithPnj);
      expect(mockPlayer1WithPnj.pnjList).toHaveLength(0);
    });
  });

  describe('findPnjById', () => {
    it('returns found pnj', () => {
      const res = PnjUtils.findPnjById([mockPnj], mockPnj.id);
      expect(res).toBeDefined();
    });
    it('returns undefined if no pnj found', () => {
      const res = PnjUtils.findPnjById([], mockPnj.id);
      expect(res).toBeUndefined();
    });
  });

  describe('getPnjTypeByName', () => {
    it('returns found pnj type', () => {
      const res = PnjUtils.getPnjTypeByName(mockPnjType.typeName);
      expect(res).toBeDefined();
    });
  });
});
