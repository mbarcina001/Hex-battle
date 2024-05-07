import React, { ReactElement } from 'react';
import Button from 'react-bootstrap/Button';
import './MenuButton.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faInfo } from '@fortawesome/free-solid-svg-icons';

interface MenuButtonProps {
  text: string;
  cost: number;
  disabled: boolean;
}

function MenuButton({ text, cost, disabled }: MenuButtonProps): ReactElement {
  return (
    <div className="d-flex">
      <Button
        key="end-turn-button"
        variant="light"
        className="shop-button"
        disabled={disabled}
      >
        <span className="d-flex justify-content-between">
          <span className="type">{text}</span>
          <span className="price">
            {cost} <FontAwesomeIcon icon={faCoins} />
          </span>
        </span>
      </Button>
      <span className="info">
        <FontAwesomeIcon icon={faInfo} />
      </span>
    </div>
  );
}

export default MenuButton;
