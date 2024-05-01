import React, { ReactElement } from 'react';
import ShopMenuButton from './ShopMenuButton/ShopMenuButton';

function ShopMenu(): ReactElement {
  return (
    <>
      <h4>Shop</h4>
      <div className="menu">
        <ShopMenuButton />
        <ShopMenuButton />
        <ShopMenuButton />
      </div>
    </>
  );
}

export default ShopMenu;
