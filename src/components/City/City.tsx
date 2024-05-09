import React, { ReactElement } from 'react';
import { City } from '../../App.constants';

interface CityCompProps {
  city: City;
}

/**
 * Component that shows received City's name
 * @param {CityCompProps} prop
 * @returns {ReactElement}
 */
function CityComp({ city }: CityCompProps): ReactElement {
  return (
    <span style={{ color: city.owner?.color ?? 'grey' }}>{city.name}</span>
  );
}

export default CityComp;
