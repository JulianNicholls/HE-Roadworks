import React from 'react';
import PropTypes from 'prop-types';

import { notStartedYet, finished } from '../dateRanges';

const dateUK = dateStr => {
  return new Date(dateStr).toLocaleDateString('en-gb', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const Road = ({ item, setMapCentre }) => {
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
          onClick={() =>
            setMapCentre({ east: centreEasting, north: centreNorthing })
          }
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
};

export default Road;
