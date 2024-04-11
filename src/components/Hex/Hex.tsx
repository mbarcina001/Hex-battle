import { ReactElement } from 'react';
import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext';
import { isAllyPnj } from '../../utils/PnjUtils';
import CityComp, { City } from '../City/City';
import PnjComp, { Pnj } from '../Pnj/Pnj';
import './Hex.scss';

export interface Hex {
  id: string;
  type: string;
}

interface HexProps {
  hex: Hex;
  isSelected: boolean;
  isVisible: boolean;
  isDestinationHex: boolean;
  pnjInHex?: Pnj;
  cityInHex?: City;
  setAsSelected: Function;
}

function HexComp({
  hex,
  isSelected,
  isVisible,
  isDestinationHex,
  pnjInHex,
  cityInHex,
  setAsSelected,
}: HexProps): ReactElement {
  const activePlayer = useActivePlayerContext();

  /**
   * Handles click event
   * Sets this Hex as selected if it is visible for active player
   */
  function handleHexClick(): void {
    if (isVisible) {
      setAsSelected(hex.id);
    }
  }

  function getBorderColorClass(): string {
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
      className={`hex ${isVisible ? hex.type : 'ofuscated'} ${getBorderColorClass()} ${isSelected ? 'selected' : ''}`}
      onClick={handleHexClick}
    >
      {pnjInHex && isVisible ? <PnjComp pnj={pnjInHex} /> : ''}
      {cityInHex && isVisible ? <CityComp city={cityInHex} /> : ''}
    </div>
  );
};

export default HexComp;
