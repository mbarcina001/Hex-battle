import React from 'react'

import './ActionMenu.scss'

export enum ACTION_ENUM {
  // eslint-disable-next-line no-unused-vars
  HEAL_ACTIVE_PNJ = 'HEAL_ACTIVE_PNJ'
}

export interface ActionMenuProps {
  actionList: ACTION_ENUM[]
}

const ActionMenu:React.FC<ActionMenuProps> = ({ actionList }) => {
  /**
   * Returns action buttons
   * @returns {any}
   */
  function getActionButtons () {
    if (actionList.includes(ACTION_ENUM.HEAL_ACTIVE_PNJ)) {
      return (
        <button>Heal</button>
      )
    }

    return (<span>No action</span>)
  }

  return (
    <>
      <div className='action-menu'>
        {getActionButtons()}
      </div>
    </>
  )
}

export default ActionMenu
