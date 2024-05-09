import React, { ReactElement } from 'react';
import MenuButton from '../MenuButton/MenuButton';
import { BUILDING_TYPES, BuildingType } from '../../App.constants';
import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext';

interface BuildMenuProps {
  purchaseBuilding: (building: BuildingType) => void;
}

/**
 * Component that displays building shop menu
 * @param {BuildMenuProps} props
 * @returns {ReactElement}
 */
function BuildMenu({ purchaseBuilding }: BuildMenuProps): ReactElement {
  const activePlayer = useActivePlayerContext();

  /**
   * Checks if active player has enough gold to pay for received building
   * @param {number} goldCost
   * @returns {boolean}
   */
  function canPlayerAffordBuilding(goldCost: number): boolean {
    return activePlayer.gold >= goldCost;
  }

  /**
   * Function called after user presses build item => Calls received function to make building purchase
   * @param {BuildingType} building
   */
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
