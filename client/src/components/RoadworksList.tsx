import React from 'react';

import Road from './Road';
import { useRoadworks } from '../context';

const RoadworksList = (): JSX.Element => {
  const roadworks = useRoadworks().selectedRoadworks();

  return (
    <section>
      {roadworks.length === 0 && (
        <h2 className="centred">No matching roadworks</h2>
      )}
      {roadworks.map((item: WorksItem, index: number) => (
        <Road item={item} key={index} />
      ))}
    </section>
  );
};

export default RoadworksList;
