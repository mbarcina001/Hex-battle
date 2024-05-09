import React, { ReactElement } from 'react';
import MenuButton from '../MenuButton/MenuButton';
import { PNJ_TYPES, PnjType } from '../../App.constants';
import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext';

interface PnjMenuProps {
  purchasePnj: (pnjType: PnjType) => void;
}

/**
 * Component that displays pnj shop menu
 * @param {PnjMenuProps} props
 * @returns {ReactElement}
 */
function PnjMenu({ purchasePnj }: PnjMenuProps): ReactElement {
  const activePlayer = useActivePlayerContext();

  /**
   * Checks if active player has enough gold to pay for received Pnj
   * @param {number} goldCost
   * @returns {boolean}
   */
  function canPlayerAffordPnj(goldCost: number): boolean {
    return activePlayer.gold >= goldCost;
  }

  /**
   * Function called after user presses build item => Calls received function to make building purchase
   * @param {PnjType} pnjType
   */
  function onPurchaseItem(pnjType: PnjType): void {
    purchasePnj(pnjType);
  }

  return (
    <>
      <h4>Shop</h4>
      <div className="menu">
        {PNJ_TYPES?.map((pnjType) =>
          pnjType.goldCost > 0 ? (
            <MenuButton
              key={pnjType.typeName.toString()}
              text={pnjType.typeName.toString()}
              cost={pnjType.goldCost}
              disabled={!canPlayerAffordPnj(pnjType.goldCost)}
              onPurchaseItem={() => onPurchaseItem(pnjType)}
            />
          ) : (
            ''
          )
        )}
      </div>
    </>
  );
}

export default PnjMenu;
