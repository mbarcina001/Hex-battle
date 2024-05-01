import React, { ReactElement } from 'react';
import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext';
import { isAllyPnj } from '../../utils/PnjUtils';
import CityComp, { City } from '../City/City';
import PnjComp, { Pnj } from '../Pnj/Pnj';
import './Hex.scss';

export interface Hex {
  id: string;
  type: string;
}

export interface Owner {
  id: number;
  color: string;
}

interface HexProps {
  hex: Hex;
  isSelected: boolean;
  isDestinationHex: boolean;
  pnjInHex?: Pnj;
  cityInHex?: City;
  // eslint-disable-next-line no-unused-vars
  setAsSelected: (hexId: string) => void;
}

function HexComp({
  hex,
  isSelected,
  isDestinationHex,
  pnjInHex,
  cityInHex,
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
      if (isAllyPnj(pnjInHex, activePlayer)) {
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
      </div>
    </div>
  );
}

export default HexComp;
