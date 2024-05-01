import React, { ReactElement } from 'react';
import Button from 'react-bootstrap/Button';

export enum ACTION_ENUM {
  HEAL_ACTIVE_PNJ = 'HEAL_ACTIVE_PNJ',
  CAPTURE_CITY = 'CAPTURE_CITY',
  END_TURN = 'END_TURN'
}

export interface ActionMenuProps {
  actionList: ACTION_ENUM[];
  triggerAction: (action: ACTION_ENUM) => void;
}

function ActionMenu({
  actionList,
  triggerAction
}: ActionMenuProps): ReactElement {
  /**
   * Returns visible action buttons
   * @returns {any}
   */
  function getActionButtons(): ReactElement[] {
    const buttons = [getEndTurnButton()];

    if (actionList.includes(ACTION_ENUM.HEAL_ACTIVE_PNJ)) {
      buttons.push(getHealButton());
    }

    if (actionList.includes(ACTION_ENUM.CAPTURE_CITY)) {
      buttons.push(getCaptureButton());
    }

    return buttons;
  }

  /**
   * Get end turn button
   * @returns {ReactElement}
   */
  function getEndTurnButton(): ReactElement {
    return (
      <Button
        key="end-turn-button"
        variant="danger"
        onClick={() => triggerAction(ACTION_ENUM.END_TURN)}
      >
        End turn
      </Button>
    );
  }

  /**
   * Get heal pnj button
   * @returns {ReactElement}
   */
  function getHealButton(): ReactElement {
    return (
      <Button
        key="heal-button"
        variant="success"
        onClick={() => triggerAction(ACTION_ENUM.HEAL_ACTIVE_PNJ)}
      >
        Heal
      </Button>
    );
  }

  /**
   * Get city capture button
   * @returns {ReactElement}
   */
  function getCaptureButton(): ReactElement {
    return (
      <Button
        key="capture-button"
        variant="dark"
        onClick={() => triggerAction(ACTION_ENUM.CAPTURE_CITY)}
      >
        Capture
      </Button>
    );
  }

  return (
    <>
      <h4>Actions:</h4>
      <div className="menu">{getActionButtons()}</div>
    </>
  );
}

export default ActionMenu;
