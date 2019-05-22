import React from 'react';
import PropTypes from 'prop-types';

import { notStartedYet, finished } from '../dateRanges';

const BGSSite =
  'https://www.bgs.ac.uk/data/webservices/CoordConvert_LL_BNG.cfc?method=BNGtoLatLng&easting=';

const openProxy = 'https://cors-anywhere.herokuapp.com';

const dateUK = dateStr => {
  return new Date(dateStr).toLocaleDateString('en-gb', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const Road = ({ item, setMapCentre, setMapOpen }) => {
  const {
    roads,
    description,
    startDate,
    endDate,
    expectedDelay,
    closureType,
    centreEasting,
    centreNorthing,
  } = item;

  const openMap = async (east, north) => {
    try {
      const fullURL = `${openProxy}/${BGSSite}${east}&northing=${north}`;
      const response = await fetch(fullURL);
      const data = await response.json();

      const { LONGITUDE: lng, LATITUDE: lat } = data;
      setMapCentre({ lat, lng });
      setMapOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  const roadClass = roads[0] === 'A' ? 'a-road' : 'motorway';
  const shouldBeDone = finished(endDate);
  const notStarted = notStartedYet(startDate);

  return (
    <article className={roadClass}>
      <header>
        <h2>{roads}</h2>
        <span>{expectedDelay}</span>
        <span>{closureType}</span>
      </header>
      <p>
        Location: {centreEasting} {centreNorthing}
        <button
          className="map-button"
          onClick={() => openMap(centreEasting, centreNorthing)}
        >
          Map
        </button>
      </p>
      <p>{description}</p>
      <span className="duration">
        Duration: {dateUK(startDate)} - {dateUK(endDate)}{' '}
        {shouldBeDone && <i>(should be complete)</i>}
        {notStarted && <i>(Starting soon)</i>}
      </span>
    </article>
  );
};

Road.propTypes = {
  item: PropTypes.object.isRequired,
  setMapCentre: PropTypes.func.isRequired,
  setMapOpen: PropTypes.func.isRequired,
};

export default Road;
