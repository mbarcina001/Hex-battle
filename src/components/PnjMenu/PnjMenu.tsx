import React, { ReactElement } from 'react';
import MenuButton from '../MenuButton/MenuButton';
import { PNJ_TYPES, PnjType } from '../../App.constants';
import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext';

interface PnjMenuProps {
  purchasePnj: (pnj: PnjType) => void;
}

function PnjMenu({ purchasePnj }: PnjMenuProps): ReactElement {
  const activePlayer = useActivePlayerContext();

  function canPlayerAffordPnj(goldCost: number): boolean {
    return activePlayer.gold >= goldCost;
  }

  function onPurchaseItem(pnj: PnjType): void {
    purchasePnj(pnj);
  }

  return (
    <>
      <h4>Shop</h4>
      <div className="menu">
        {PNJ_TYPES?.map((pnj) => (
          <MenuButton
            key={pnj.type.toString()}
            text={pnj.type.toString()}
            cost={pnj.goldCost}
            disabled={!canPlayerAffordPnj(pnj.goldCost)}
            onPurchaseItem={() => onPurchaseItem(pnj)}
          />
        ))}
      </div>
    </>
  );
}

export default PnjMenu;
