import React, { useState, useEffect, ReactElement } from 'react';

import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext';

import { isAllyPnj } from '../../utils/PnjUtils';

import './Pnj.scss';

export interface PnjOwner {
  id: number;
  color: string;
}

export interface Pnj {
  type: string;
  id: string;
  owner: PnjOwner;
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
    <span
      className={`${isPnjInactive ? 'inactive' : ''}`}
      style={{ color: pnj.owner.color }}
    >
      {`Id: ${pnj.id} - Hp: ${pnj.healthPoints}`}
    </span>
  );
}

export default PnjComp;
