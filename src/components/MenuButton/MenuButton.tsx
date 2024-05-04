import React, { ReactElement } from 'react';
import Button from 'react-bootstrap/Button';
import './MenuButton.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faInfo } from '@fortawesome/free-solid-svg-icons';

interface MenuButtonProps {
  text: string;
  cost: number;
}

function MenuButton({ text, cost }: MenuButtonProps): ReactElement {
  return (
    <div className="d-flex flex-wrap">
      <Button key="end-turn-button" variant="light" className="shop-button">
        <span className="type">{text}</span>
        <span className="price">
          {cost} <FontAwesomeIcon icon={faCoins} />
        </span>
      </Button>
      <span className="info">
        <FontAwesomeIcon icon={faInfo} />
      </span>
    </div>
  );
}

export default MenuButton;
