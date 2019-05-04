import React, { useContext } from 'react';

import { WorksContext } from '../context';

import Road from './Road';

const RoadworksList = () => {
  const { selectedRoadworks } = useContext(WorksContext);

  return (
    <section>
      {selectedRoadworks().map((item, index) => (
        <Road item={item} key={index} />
      ))}
    </section>
  );
};

export default RoadworksList;
