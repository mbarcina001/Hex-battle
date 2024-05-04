import React, { ReactElement } from 'react';
import MenuButton from '../MenuButton/MenuButton';
import { BUILDING_TYPES } from '../../App.constants';

function BuildMenu(): ReactElement {
  return (
    <>
      <h4>Build</h4>
      <div className="menu">
        {BUILDING_TYPES?.map((building) => (
          <MenuButton
            key={building.type.toString()}
            text={building.type.toString()}
            cost={building.goldCost}
          />
        ))}
      </div>
    </>
  );
}

export default BuildMenu;
