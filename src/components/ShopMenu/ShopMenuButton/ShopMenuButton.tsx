import React, { ReactElement } from 'react';
import Button from 'react-bootstrap/Button';
import './ShopMenuButton.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faInfo } from '@fortawesome/free-solid-svg-icons';

function ShopMenuButton(): ReactElement {
  return (
    <div className="d-flex">
      <Button key="end-turn-button" variant="light" className="shop-button">
        <span className="type">Soldier</span>
        <span className="price">
          2 <FontAwesomeIcon icon={faCoins} />
        </span>
      </Button>
      <span className="info">
        <FontAwesomeIcon icon={faInfo} />
      </span>
    </div>
  );
}

export default ShopMenuButton;
