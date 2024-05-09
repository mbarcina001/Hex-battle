import React, { useState, useEffect, ReactElement } from 'react';

import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext';

import PnjUtils from '../../utils/PnjUtils';

import './Pnj.scss';
import { Pnj } from '../../App.constants';

interface PnjCompProps {
  pnj: Pnj;
}

/**
 * Component that shows received Pnj's data
 * @param {PnjCompProps} prop
 * @returns {ReactElement}
 */
function PnjComp({ pnj }: PnjCompProps): ReactElement {
  const [isPnjInactive, setIsPnjInactive] = useState<boolean>(true);

  const activePlayer = useActivePlayerContext();

  useEffect(() => {
    const checkIsPnjInactive =
      !pnj.canMove && PnjUtils.isAllyPnj(pnj, activePlayer);
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
