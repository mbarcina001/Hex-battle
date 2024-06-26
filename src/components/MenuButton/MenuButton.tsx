import React, { ReactElement } from 'react';
import Button from 'react-bootstrap/Button';
import './MenuButton.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faInfo } from '@fortawesome/free-solid-svg-icons';

interface MenuButtonProps {
  text: string;
  cost: number;
  disabled: boolean;
  onPurchaseItem: () => void;
}

/**
 * Component that displays a buttton for purchase menus (BuildMenu and PnjMenu)
 * @param {MenuButtonProps} props
 * @returns {ReactElement}
 */
function MenuButton({
  text,
  cost,
  disabled,
  onPurchaseItem
}: MenuButtonProps): ReactElement {
  return (
    <div className="d-flex">
      <Button
        key="end-turn-button"
        variant="light"
        className="shop-button"
        disabled={disabled}
        onClick={() => onPurchaseItem()}
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
