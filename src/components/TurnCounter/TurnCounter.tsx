import React, { ReactElement } from 'react';

import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext';

import './TurnCounter.scss';

interface TurnCounterProps {
  turnNumber: number;
}

function TurnCounter({ turnNumber }: TurnCounterProps): ReactElement {
  const activePlayer = useActivePlayerContext();

  return (
    <h4 className="counter">
      <span>{`Turno: ${turnNumber} -`}</span>
      <span>&nbsp;</span>
      <span style={{ color: activePlayer.playerColor }}>
        {`Jugador: ${activePlayer.playerId}`}
      </span>
    </h4>
  );
}

export default TurnCounter;
