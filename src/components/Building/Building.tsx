import React, { ReactElement } from 'react';
import { Building } from '../../App.constants';

interface BuildingCompProps {
  building: Building;
}

/**
 * Component that shows received Building's name
 * @param {BuildingCompProps} prop
 * @returns {ReactElement}
 */
function BuildingComp({ building }: BuildingCompProps): ReactElement {
  return <span>{building.type.typeName.toString()}</span>;
}

export default BuildingComp;
