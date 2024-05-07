import React, { ReactElement } from 'react';
import MenuButton from '../MenuButton/MenuButton';
import { BUILDING_TYPES, BuildingType } from '../../App.constants';
import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext';

interface BuildMenuProps {
  purchaseBuilding: (building: BuildingType) => void;
}

function BuildMenu({ purchaseBuilding }: BuildMenuProps): ReactElement {
  const activePlayer = useActivePlayerContext();

  function canPlayerAffordBuilding(goldCost: number): boolean {
    return activePlayer.gold >= goldCost;
  }

  function onPurchaseItem(building: BuildingType): void {
    purchaseBuilding(building);
  }

  return (
    <>
      <h4>Build</h4>
      <div className="menu">
        {BUILDING_TYPES?.map((building) => (
          <MenuButton
            key={building.typeName.toString()}
            text={building.typeName.toString()}
            cost={building.goldCost}
            disabled={!canPlayerAffordBuilding(building.goldCost)}
            onPurchaseItem={() => onPurchaseItem(building)}
          />
        ))}
      </div>
    </>
  );
}

export default BuildMenu;
