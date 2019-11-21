import React from 'react';
import PropTypes from 'prop-types';

import Road from './Road';
import { useRoadworks } from '../context';

const RoadworksList = ({ setMapCentre }) => {
  const roadworks = useRoadworks().selectedRoadworks();

  return (
    <section>
      {roadworks.length === 0 && (
        <h2 className="centred">No matching roadworks</h2>
      )}
      {roadworks.map((item, index) => (
        <Road item={item} key={index} setMapCentre={setMapCentre} />
      ))}
    </section>
  );
};

RoadworksList.propTypes = {
  setMapCentre: PropTypes.func.isRequired,
};

export default RoadworksList;
