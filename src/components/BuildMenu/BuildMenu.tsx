import React, { ReactElement } from 'react';
import MenuButton from '../MenuButton/MenuButton';
import { BUILDING_TYPES } from '../../App.constants';
import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext';

function BuildMenu(): ReactElement {
  const activePlayer = useActivePlayerContext();

  function canPlayerAffordBuilding(goldCost: number): boolean {
    return activePlayer.gold >= goldCost;
  }

  return (
    <>
      <h4>Build</h4>
      <div className="menu">
        {BUILDING_TYPES?.map((building) => (
          <MenuButton
            key={building.type.toString()}
            text={building.type.toString()}
            cost={building.goldCost}
            disabled={!canPlayerAffordBuilding(building.goldCost)}
          />
        ))}
      </div>
    </>
  );
}

export default BuildMenu;
