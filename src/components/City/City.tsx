import React, { ReactElement } from 'react';
import { City } from '../../App.constants';

interface CityCompProps {
  city: City;
}

function CityComp({ city }: CityCompProps): ReactElement {
  return (
    <span style={{ color: city.owner?.color ?? 'grey' }}>{city.name}</span>
  );
}

export default CityComp;
