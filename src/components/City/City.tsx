import React, { ReactElement } from 'react';

export interface City {
  name: string;
  id: string;
  ownerId: number;
  hexLocationId: string;
}

interface CityCompProps {
  city: City;
}

function CityComp({ city }: CityCompProps): ReactElement {
  return <span>{city.name}</span>;
}

export default CityComp;
