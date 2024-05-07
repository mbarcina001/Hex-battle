import React, { ReactElement } from 'react';
import MenuButton from '../MenuButton/MenuButton';
import { PNJ_TYPES } from '../../App.constants';
import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext';

function PnjMenu(): ReactElement {
  const activePlayer = useActivePlayerContext();

  function canPlayerAffordPnj(goldCost: number): boolean {
    return activePlayer.gold >= goldCost;
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
          />
        ))}
      </div>
    </>
  );
}

export default PnjMenu;
