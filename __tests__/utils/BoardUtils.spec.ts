import BoardUtils from '../../src/utils/BoardUtils';
import {
  mockBoard,
  mockCity1,
  mockPlayer1,
  mockPnj,
  mockSelectedPnj
} from '../../__mocks__/mocks';
import { SELECTED_HEX_ACTION } from '../../src/App.constants';
import PnjUtils from '../../src/utils/PnjUtils';
import CityUtils from '../../src/utils/CityUtils';

describe('BoardUtils unit tests', () => {
  describe('getInitialBoard', () => {
    it('returns valid board', () => {
      const board = BoardUtils.getInitialBoard();
      expect(board.length).toBeGreaterThan(0);
      expect(board[0].length).toBeGreaterThan(0);
    });
  });

  describe('getActionToTriggerInSelectedHex', () => {
    const _canSelectedPnjMoveToSelectedHexSpy = jest.spyOn(
      BoardUtils,
      '_canSelectedPnjMoveToSelectedHex'
    );
    const _canHealPnjInHexSpy = jest.spyOn(BoardUtils, '_canHealPnjInHex');
    const _canAttackPnjInHexSpy = jest.spyOn(BoardUtils, '_canAttackPnjInHex');
    const _destinationHexContainsAllyPnjWhichCanMoveSpy = jest.spyOn(
      BoardUtils,
      '_destinationHexContainsAllyPnjWhichCanMove'
    );
    const _destinationHexContainsAllyCitySpy = jest.spyOn(
      BoardUtils,
      '_destinationHexContainsAllyCity'
    );
    const _destinationHexCanOwnBuildingSpy = jest.spyOn(
      BoardUtils,
      '_destinationHexCanOwnBuilding'
    );

    it('returns HEAL_ALLY if selectedPnj can move to selected hex + selected hex has adjacent ally to heal', () => {
      _canSelectedPnjMoveToSelectedHexSpy.mockReturnValueOnce(true);
      _canHealPnjInHexSpy.mockReturnValueOnce(true);

      const action = BoardUtils.getActionToTriggerInSelectedHex(
        '2_2',
        mockPlayer1,
        [mockCity1],
        mockBoard
      );

      expect(action).toEqual(SELECTED_HEX_ACTION.HEAL_ALLY);
    });

    it('returns ATTACK_ENEMY if selectedPnj can move to selected hex + selected hex has adjacent enemy to heal', () => {
      _canSelectedPnjMoveToSelectedHexSpy.mockReturnValueOnce(true);
      _canHealPnjInHexSpy.mockReturnValueOnce(false);
      _canAttackPnjInHexSpy.mockReturnValueOnce(true);

      const action = BoardUtils.getActionToTriggerInSelectedHex(
        '2_2',
        mockPlayer1,
        [mockCity1],
        mockBoard
      );

      expect(action).toEqual(SELECTED_HEX_ACTION.ATTACK_ENEMY);
    });

    it('returns MOVE_PNJ if selectedPnj can move to selected hex + selected hex has no pnj', () => {
      _canSelectedPnjMoveToSelectedHexSpy.mockReturnValueOnce(true);
      _canHealPnjInHexSpy.mockReturnValueOnce(false);
      _canAttackPnjInHexSpy.mockReturnValueOnce(false);

      const action = BoardUtils.getActionToTriggerInSelectedHex(
        '2_2',
        mockPlayer1,
        [mockCity1],
        mockBoard
      );

      expect(action).toEqual(SELECTED_HEX_ACTION.MOVE_PNJ);
    });

    it('returns SELECT_PNJ if selectedPnj can NOT move to selected hex + selected hex has pnj ally that can move', () => {
      _canSelectedPnjMoveToSelectedHexSpy.mockReturnValueOnce(false);
      _destinationHexContainsAllyPnjWhichCanMoveSpy.mockReturnValueOnce(true);

      const action = BoardUtils.getActionToTriggerInSelectedHex(
        '2_2',
        mockPlayer1,
        [mockCity1],
        mockBoard
      );

      expect(action).toEqual(SELECTED_HEX_ACTION.SELECT_PNJ);
    });

    it(`returns OPEN_SHOP if selectedPnj can NOT move to selected hex + 
    selected hex has no ally pnj + 
    selected hex contains ally city`, () => {
      _canSelectedPnjMoveToSelectedHexSpy.mockReturnValueOnce(false);
      _destinationHexContainsAllyPnjWhichCanMoveSpy.mockReturnValueOnce(false);
      _destinationHexContainsAllyCitySpy.mockReturnValueOnce(true);

      const action = BoardUtils.getActionToTriggerInSelectedHex(
        '2_2',
        mockPlayer1,
        [mockCity1],
        mockBoard
      );

      expect(action).toEqual(SELECTED_HEX_ACTION.OPEN_SHOP);
    });

    it(`returns OPEN_BUILD_MENU if selectedPnj can NOT move to selected hex + 
    selected hex has no ally pnj + 
    selected hex does NOT contain ally city +
    selected hex has adjacent ally city`, () => {
      _canSelectedPnjMoveToSelectedHexSpy.mockReturnValueOnce(false);
      _destinationHexContainsAllyPnjWhichCanMoveSpy.mockReturnValueOnce(false);
      _destinationHexContainsAllyCitySpy.mockReturnValueOnce(false);
      _destinationHexCanOwnBuildingSpy.mockReturnValueOnce(true);

      const action = BoardUtils.getActionToTriggerInSelectedHex(
        '2_2',
        mockPlayer1,
        [mockCity1],
        mockBoard
      );

      expect(action).toEqual(SELECTED_HEX_ACTION.OPEN_BUILD_MENU);
    });

    it('returns CLEAR_SELECTED_PNJ if no other action can be triggered', () => {
      _canSelectedPnjMoveToSelectedHexSpy.mockReturnValueOnce(false);
      _destinationHexContainsAllyPnjWhichCanMoveSpy.mockReturnValueOnce(false);
      _destinationHexContainsAllyCitySpy.mockReturnValueOnce(false);
      _destinationHexCanOwnBuildingSpy.mockReturnValueOnce(false);

      const action = BoardUtils.getActionToTriggerInSelectedHex(
        '2_2',
        mockPlayer1,
        [mockCity1],
        mockBoard
      );

      expect(action).toEqual(SELECTED_HEX_ACTION.CLEAR_SELECTED_PNJ);
    });
  });

  describe('_canSelectedPnjMoveToSelectedHex', () => {
    it('returns false if received selectedPnj is undefined', () => {
      expect(BoardUtils._canSelectedPnjMoveToSelectedHex('2_2')).toBeFalsy();
    });

    it('returns false if received selectedPnj cannot move', () => {
      expect(
        BoardUtils._canSelectedPnjMoveToSelectedHex('2_2', mockSelectedPnj)
      ).toBeFalsy();
    });

    it('returns false if received selectedPnj cannot move to selected hex', () => {
      expect(
        BoardUtils._canSelectedPnjMoveToSelectedHex('2_2', mockSelectedPnj)
      ).toBeFalsy();
    });

    it('returns true if received selectedPnj can move to selected hex', () => {
      expect(
        BoardUtils._canSelectedPnjMoveToSelectedHex('1_1', mockSelectedPnj)
      ).toBeFalsy();
    });
  });

  describe('_canHealPnjInHex', () => {
    const isAllyPnjSpy = jest.spyOn(PnjUtils, 'isAllyPnj');

    it('returns false if received selectedPnj is undefined', () => {
      expect(BoardUtils._canHealPnjInHex(mockPlayer1)).toBeFalsy();
    });

    it('returns false if received selectedPnj is not ally', () => {
      isAllyPnjSpy.mockReturnValueOnce(false);
      expect(BoardUtils._canHealPnjInHex(mockPlayer1)).toBeFalsy();
    });

    it('returns true if received selectedPnj is ally', () => {
      isAllyPnjSpy.mockReturnValueOnce(true);
      expect(BoardUtils._canHealPnjInHex(mockPlayer1, mockPnj)).toBeFalsy();
    });
  });

  describe('_canAttackPnjInHex', () => {
    const isEnemyPnjSpy = jest.spyOn(PnjUtils, 'isEnemyPnj');

    it('returns false if received selectedPnj is undefined', () => {
      expect(BoardUtils._canAttackPnjInHex(mockPlayer1)).toBeFalsy();
    });

    it('returns false if received selectedPnj is not enemy', () => {
      isEnemyPnjSpy.mockReturnValueOnce(false);
      expect(BoardUtils._canAttackPnjInHex(mockPlayer1, mockPnj)).toBeFalsy();
    });

    it('returns true if received selectedPnj is enemy', () => {
      isEnemyPnjSpy.mockReturnValueOnce(true);
      expect(BoardUtils._canAttackPnjInHex(mockPlayer1, mockPnj)).toBeTruthy();
    });
  });

  describe('_destinationHexContainsAllyCity', () => {
    const isEnemyPnjSpy = jest.spyOn(PnjUtils, 'isEnemyPnj');
    const getCityInHexSpy = jest.spyOn(CityUtils, 'getCityInHex');
    const isAllyCitySpy = jest.spyOn(CityUtils, 'isAllyCity');

    it('returns false if selected hex contains enemy Pnj', () => {
      isEnemyPnjSpy.mockReturnValueOnce(true);
      expect(
        BoardUtils._destinationHexContainsAllyCity(
          '2_2',
          [mockCity1],
          mockPlayer1,
          mockPnj
        )
      ).toBeFalsy();
    });

    it('returns false if selected hex contains no Pnj, but also contains no City', () => {
      getCityInHexSpy.mockReturnValueOnce(undefined);
      expect(
        BoardUtils._destinationHexContainsAllyCity(
          '2_2',
          [mockCity1],
          mockPlayer1
        )
      ).toBeFalsy();
    });

    it('returns false if selected hex contains no Pnj, but contains enemy City', () => {
      getCityInHexSpy.mockReturnValueOnce(mockCity1);
      isAllyCitySpy.mockReturnValueOnce(false);

      expect(
        BoardUtils._destinationHexContainsAllyCity(
          '2_2',
          [mockCity1],
          mockPlayer1
        )
      ).toBeFalsy();
    });

    it('returns true if selected hex contains no Pnj and contains ally City', () => {
      getCityInHexSpy.mockReturnValueOnce(mockCity1);
      isAllyCitySpy.mockReturnValueOnce(true);

      expect(
        BoardUtils._destinationHexContainsAllyCity(
          '2_2',
          [mockCity1],
          mockPlayer1
        )
      ).toBeTruthy();
    });

    it('returns true if selected hex contains ally Pnj and ally City', () => {
      isEnemyPnjSpy.mockReturnValueOnce(false);
      getCityInHexSpy.mockReturnValueOnce(mockCity1);
      isAllyCitySpy.mockReturnValueOnce(true);

      expect(
        BoardUtils._destinationHexContainsAllyCity(
          '2_2',
          [mockCity1],
          mockPlayer1,
          mockPnj
        )
      ).toBeTruthy();
    });
  });

  describe('_destinationHexContainsAllyPnjWhichCanMove', () => {
    const isAllyPnjSpy = jest.spyOn(PnjUtils, 'isAllyPnj');

    it('returns false if received selectedPnj is undefined', () => {
      expect(
        BoardUtils._destinationHexContainsAllyPnjWhichCanMove(mockPlayer1)
      ).toBeFalsy();
    });

    it('returns false if received selectedPnj is not ally', () => {
      isAllyPnjSpy.mockReturnValueOnce(false);

      expect(
        BoardUtils._destinationHexContainsAllyPnjWhichCanMove(
          mockPlayer1,
          mockPnj
        )
      ).toBeFalsy();
    });

    it('returns false if received selectedPnj is ally but cannot move', () => {
      isAllyPnjSpy.mockReturnValueOnce(true);
      expect(
        BoardUtils._destinationHexContainsAllyPnjWhichCanMove(
          mockPlayer1,
          mockPnj
        )
      ).toBeFalsy();
    });

    it('returns true if received selectedPnj is ally and can move', () => {
      isAllyPnjSpy.mockReturnValueOnce(true);
      const mockMovablePnj = {
        ...mockPnj,
        canMove: true
      };
      expect(
        BoardUtils._destinationHexContainsAllyPnjWhichCanMove(
          mockPlayer1,
          mockMovablePnj
        )
      ).toBeTruthy();
    });
  });

  describe('_destinationHexCanOwnBuilding', () => {
    const _checkIfHexContainsEnemyPnjSpy = jest.spyOn(
      BoardUtils,
      '_checkIfHexContainsEnemyPnj'
    );
    const _hexHasAdjacentAllyCitySpy = jest.spyOn(
      BoardUtils,
      '_hexHasAdjacentAllyCity'
    );

    it('false if hex contains enemy Pnj', () => {
      _checkIfHexContainsEnemyPnjSpy.mockReturnValueOnce(true);
      expect(
        BoardUtils._destinationHexCanOwnBuilding(
          '2_2',
          [mockCity1],
          mockPlayer1,
          mockBoard,
          mockPnj
        )
      ).toBeFalsy();
    });

    it('false if hex contains no Pnj, but has no adjacent ally city', () => {
      _checkIfHexContainsEnemyPnjSpy.mockReturnValueOnce(false);
      _hexHasAdjacentAllyCitySpy.mockReturnValueOnce(false);
      expect(
        BoardUtils._destinationHexCanOwnBuilding(
          '2_2',
          [mockCity1],
          mockPlayer1,
          mockBoard,
          mockPnj
        )
      ).toBeFalsy();
    });

    it('false if hex contains no Pnj and has an adjacent ally city', () => {
      _checkIfHexContainsEnemyPnjSpy.mockReturnValueOnce(false);
      _hexHasAdjacentAllyCitySpy.mockReturnValueOnce(true);
      expect(
        BoardUtils._destinationHexCanOwnBuilding(
          '2_2',
          [mockCity1],
          mockPlayer1,
          mockBoard,
          mockPnj
        )
      ).toBeTruthy();
    });
  });

  describe('_checkIfHexContainsEnemyPnj', () => {
    const isEnemyPnjSpy = jest.spyOn(PnjUtils, 'isEnemyPnj');

    it('returns false if received selectedPnj is undefined', () => {
      expect(BoardUtils._checkIfHexContainsEnemyPnj(mockPlayer1)).toBeFalsy();
    });

    it('returns false if received selectedPnj is NOT enemy Pnj', () => {
      isEnemyPnjSpy.mockReturnValueOnce(false);
      expect(
        BoardUtils._checkIfHexContainsEnemyPnj(mockPlayer1, mockPnj)
      ).toBeFalsy();
    });

    it('returns true if received selectedPnj is NOT enemy Pnj', () => {
      isEnemyPnjSpy.mockReturnValueOnce(true);
      expect(
        BoardUtils._checkIfHexContainsEnemyPnj(mockPlayer1, mockPnj)
      ).toBeTruthy();
    });
  });

  describe('_hexHasAdjacentAllyCity', () => {
    const getAdjacentCityIfAnySpy = jest.spyOn(
      CityUtils,
      'getAdjacentCityIfAny'
    );
    const isAllyCitySpy = jest.spyOn(CityUtils, 'isAllyCity');

    it('return false if no adjacent city found', () => {
      getAdjacentCityIfAnySpy.mockReturnValueOnce(undefined);
      expect(
        BoardUtils._hexHasAdjacentAllyCity(
          '2_2',
          [mockCity1],
          mockPlayer1,
          mockBoard
        )
      ).toBeFalsy();
    });

    it('return false if adjacent city found, but it is not ally city', () => {
      getAdjacentCityIfAnySpy.mockReturnValueOnce(mockCity1);
      isAllyCitySpy.mockReturnValue(false);
      expect(
        BoardUtils._hexHasAdjacentAllyCity(
          '2_2',
          [mockCity1],
          mockPlayer1,
          mockBoard
        )
      ).toBeFalsy();
    });

    it('return true if adjacent ally city found', () => {
      getAdjacentCityIfAnySpy.mockReturnValueOnce(mockCity1);
      isAllyCitySpy.mockReturnValue(true);
      expect(
        BoardUtils._hexHasAdjacentAllyCity(
          '2_2',
          [mockCity1],
          mockPlayer1,
          mockBoard
        )
      ).toBeTruthy();
    });
  });
});
