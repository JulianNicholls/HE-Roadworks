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
    let response;

    try {
      const fullURL = `${openProxy}/${BGSSite}${east}&northing=${north}`;
      // console.log({ fullURL });
      response = await fetch(fullURL);

      if (response.ok) {
        // console.log({ response });
        const data = await response.json();

        const { LONGITUDE: lng, LATITUDE: lat } = data;
        setMapCentre({ lat, lng });
        setMapOpen(true);
      } else {
        console.warn({ response });
      }
    } catch (e) {
      console.error(e);
      console.error({ response });
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
        {shouldBeDone && (
          <span className="duration-extra">(should be complete)</span>
        )}
        {notStarted && <span className="duration-extra">(Starting soon)</span>}
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
