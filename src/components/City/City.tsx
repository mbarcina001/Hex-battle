import React from 'react'

export interface City {
  name: string,
  id: string,
  owner: number,
  hexLocationId: string
}

interface CityCompProps {
  city: City
}

const CityComp:React.FC<CityCompProps> = ({ city }) => {
  return (
    <span>{city.id}</span>
  )
}

export default CityComp
