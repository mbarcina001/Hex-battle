import React from 'react'

import './ActionMenu.scss'
import { Button } from 'react-bootstrap'

export enum ACTION_ENUM {
  // eslint-disable-next-line no-unused-vars
  HEAL_ACTIVE_PNJ = 'HEAL_ACTIVE_PNJ',
  // eslint-disable-next-line no-unused-vars
  CAPTURE_CITY = 'CAPTURE_CITY'
}

export interface ActionMenuProps {
  actionList: ACTION_ENUM[],
  triggerAction: Function
}

const ActionMenu:React.FC<ActionMenuProps> = ({ actionList, triggerAction }) => {
  /**
   * Returns action buttons
   * @returns {any}
   */
  function getActionButtons () {
    const buttons = []

    if (actionList.includes(ACTION_ENUM.HEAL_ACTIVE_PNJ)) {
      buttons.push(
        <Button
          key='heal-button'
          variant='sucess'
          onClick={() => triggerAction(ACTION_ENUM.HEAL_ACTIVE_PNJ)}
        >
          Heal
        </Button>
      )
    }

    if (actionList.includes(ACTION_ENUM.CAPTURE_CITY)) {
      buttons.push(
        <Button
          key='capture-button'
          variant='sucess'
          onClick={() => triggerAction(ACTION_ENUM.CAPTURE_CITY)}
        >
          Capture
        </Button>
      )
    }

    if (!buttons.length) {
      buttons.push(
        <span key='no-action'>No action</span>
      )
    }

    return buttons
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
