import React, { ReactElement } from 'react';
import { Owner } from '../Hex/Hex';

export interface City {
  name: string;
  id: string;
  owner?: Owner;
  hexLocationId: string;
}

interface CityCompProps {
  city: City;
}

function CityComp({ city }: CityCompProps): ReactElement {
  return (
    <span style={{ color: city.owner?.color ?? 'grey' }}>{city.name}</span>
  );
}

export default CityComp;
