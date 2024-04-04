import React, { useContext } from 'react'
import { Player } from '../../App'

export const ActivePlayerContext = React.createContext<Player | undefined>(undefined)

export function useActivePlayerContext () {
  const activePlayer = useContext(ActivePlayerContext)

  if (!activePlayer) {
    throw Error('default activePlayer must be passed to ActivePlayerContext.Provider')
  }

  return activePlayer
}