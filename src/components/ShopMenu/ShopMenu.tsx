import React, { ReactElement } from 'react';
import MenuButton from '../MenuButton/MenuButton';
import { PNJ_TYPES } from '../../App.constants';

function ShopMenu(): ReactElement {
  return (
    <>
      <h4>Shop</h4>
      <div className="menu">
        {PNJ_TYPES?.map((pnj) => (
          <MenuButton
            key={pnj.type.toString()}
            text={pnj.type.toString()}
            cost={pnj.goldCost}
          />
        ))}
      </div>
    </>
  );
}

export default ShopMenu;
