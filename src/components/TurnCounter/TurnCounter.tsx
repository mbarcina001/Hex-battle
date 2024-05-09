import React, { ReactElement } from 'react';

import { useActivePlayerContext } from '../../context/ActivePlayerContext/ActivePlayerContext';

import './TurnCounter.scss';

interface TurnCounterProps {
  turnNumber: number;
}

/**
 * Displays current turn info (active player name, active player gold, turn number, etc.)
 * @param {TurnCounterProps} props
 * @returns {ReactElement}
 */
function TurnCounter({ turnNumber }: TurnCounterProps): ReactElement {
  const activePlayer = useActivePlayerContext();

  return (
    <h4 className="counter">
      <p>
        <span>{`Turn: ${turnNumber} -`}</span>
        <span>&nbsp;</span>
        <span style={{ color: activePlayer.playerColor }}>
          {`Player: ${activePlayer.playerId}`}
        </span>
      </p>
      <p className="gold">{`Gold: ${activePlayer.gold}`}</p>
    </h4>
  );
}

export default TurnCounter;
