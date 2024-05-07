import React, { ReactElement } from 'react';
import { Building } from '../../App.constants';

interface BuildingCompProps {
  building: Building;
}

function CityComp({ building }: BuildingCompProps): ReactElement {
  return <span>{building.type.typeName.toString()}</span>;
}

export default CityComp;
