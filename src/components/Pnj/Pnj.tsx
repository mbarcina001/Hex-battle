import React, { useState, useEffect, ReactElement } from 'react';

import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext';

import { isAllyPnj } from '../../utils/PnjUtils';

import './Pnj.scss';
import { Owner } from '../Hex/Hex';

export interface Pnj {
  type: string;
  id: string;
  owner: Owner;
  canMove: boolean;
  hexLocationId: string;
  attack: number;
  defense: number;
  healthPoints: number;
}

interface PnjCompProps {
  pnj: Pnj;
}

function PnjComp({ pnj }: PnjCompProps): ReactElement {
  const [isPnjInactive, setIsPnjInactive] = useState<boolean>(true);

  const activePlayer = useActivePlayerContext();

  useEffect(() => {
    const checkIsPnjInactive = !pnj.canMove && isAllyPnj(pnj, activePlayer);
    setIsPnjInactive(checkIsPnjInactive);
  }, [pnj, pnj.canMove, activePlayer]);

  return (
    <div
      className={`${isPnjInactive ? 'inactive' : ''} pnj`}
      style={{ color: pnj.owner.color }}
    >
      <span>{`Id: ${pnj.id}`}</span>
      <span>{`Hp: ${pnj.healthPoints}`}</span>
    </div>
  );
}

export default PnjComp;
