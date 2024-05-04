import React, { useContext } from 'react';
import { Player } from '../../App.constants';

export const ActivePlayerContext = React.createContext<Player | undefined>(
  undefined
);

export function useActivePlayerContext(): Player {
  const activePlayer = useContext(ActivePlayerContext);

  if (!activePlayer) {
    throw Error(
      'default activePlayer must be passed to ActivePlayerContext.Provider'
    );
  }

  return activePlayer;
}
