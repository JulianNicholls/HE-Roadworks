import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { WorksContext } from '../context';

import Road from './Road';

const RoadworksList = ({ setMapCentre, setMapOpen }) => {
  const { selectedRoadworks } = useContext(WorksContext);

  return (
    <section>
      {selectedRoadworks().map((item, index) => (
        <Road
          item={item}
          key={index}
          setMapCentre={setMapCentre}
          setMapOpen={setMapOpen}
        />
      ))}
    </section>
  );
};

RoadworksList.propTypes = {
  setMapCentre: PropTypes.func.isRequired,
  setMapOpen: PropTypes.func.isRequired,
};

export default RoadworksList;
