import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { notStartedYet, finished } from '../dateRanges';

moment.locale('en-gb');

const dateFormat = 'D MMM YYYY';
const BGSSite =
  'https://www.bgs.ac.uk/data/webservices/CoordConvert_LL_BNG.cfc?method=BNGtoLatLng&easting=';

const openProxy = 'https://cors-anywhere.herokuapp.com';
const Road = ({ item }) => {
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
      const response = await fetch(`${openProxy}/${BGSSite}${east}&northing=${north}`);
      const data = await response.json();

      const { LONGITUDE, LATITUDE } = data;
      console.log({ east, north, LONGITUDE, LATITUDE });
    }
    catch(e) { console.error(e);};
  };

  const roadClass = roads[0] === 'A' ? 'a-road' : 'motorway';
  const shouldBeDone = finished(endDate);
  const notStarted = notStartedYet(startDate);

  const sdate = moment(startDate);
  const edate = moment(endDate);

  return (
    <article className={roadClass}>
      <header>
        <h2>{roads}</h2>
        <span>{expectedDelay}</span>
        <span>{closureType}</span>
      </header>
      <p>
        Location: {centreEasting} {centreNorthing}{' '}
        <button onClick={() => openMap(centreEasting, centreNorthing)}>
          Map
        </button>
      </p>
      <p>{description}</p>
      <span className="duration">
        Duration: {sdate.format(dateFormat)} - {edate.format(dateFormat)}{' '}
        {shouldBeDone && <i>(should be complete)</i>}
        {notStarted && <i>(Starting soon)</i>}
      </span>
    </article>
  );
};

Road.propTypes = {
  item: PropTypes.object.isRequired,
};

export default Road;
