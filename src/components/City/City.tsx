import React from 'react'

export interface City {
  name: string,
  id: string,
  ownerId: number,
  hexLocationId: string
}

interface CityCompProps {
  city: City
}

const CityComp:React.FC<CityCompProps> = ({ city }) => {
  return (
    <span>{city.name}</span>
  )
}

export default CityComp
