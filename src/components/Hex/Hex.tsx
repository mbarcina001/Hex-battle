import React, { ReactElement } from 'react';
import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext';
import PnjUtils from '../../utils/PnjUtils';
import CityComp from '../City/City';
import PnjComp from '../Pnj/Pnj';
import BuildingComp from '../Building/Building';
import { City, Pnj, Hex, Building } from '../../App.constants';
import './Hex.scss';

interface HexProps {
  hex: Hex;
  isSelected: boolean;
  isDestinationHex: boolean;
  pnjInHex?: Pnj;
  cityInHex?: City;
  buildingInHex?: Building;
  // eslint-disable-next-line no-unused-vars
  setAsSelected: (hexId: string) => void;
}

/**
 * Displays received Hex
 * @param {HexProps} props
 * @returns {ReactElement}
 */
function HexComp({
  hex,
  isSelected,
  isDestinationHex,
  pnjInHex,
  cityInHex,
  buildingInHex,
  setAsSelected
}: HexProps): ReactElement {
  const activePlayer = useActivePlayerContext();

  /**
   * Returns if hex is visible for active player
   * @param {string} hexId
   * @returns {boolean}
   */
  function isHexVisible(): boolean {
    return activePlayer.visibleHexsIds.includes(hex.id);
  }

  /**
   * Handles click event
   * Sets this Hex as selected if it is visible for active player
   */
  function handleHexClick(): void {
    if (isHexVisible()) {
      setAsSelected(hex.id);
    }
  }

  /**
   * Get css clas for destination hex
   * @returns {string}
   */
  function getDestinationHexBackgroundColorClass(): string {
    if (isDestinationHex && pnjInHex) {
      if (PnjUtils.isAllyPnj(pnjInHex, activePlayer)) {
        return 'ally';
      }

      return 'enemy';
    }

    if (isDestinationHex) {
      return 'destination';
    }

    return '';
  }

  return (
    <div
      className={`hex ${isHexVisible() ? hex.type : 'ofuscated'}
        ${getDestinationHexBackgroundColorClass()}
        ${isSelected ? 'selected' : ''}`}
      onClick={handleHexClick}
    >
      <div className="hex-content">
        {pnjInHex && isHexVisible() ? <PnjComp pnj={pnjInHex} /> : ''}
        {cityInHex && isHexVisible() ? <CityComp city={cityInHex} /> : ''}
        {buildingInHex && isHexVisible() ? (
          <BuildingComp building={buildingInHex} />
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default HexComp;
