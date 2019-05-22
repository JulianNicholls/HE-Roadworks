import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ReactModal from 'react-modal';
import RoadworksMap from 'google-map-react';

import { notStartedYet, finished } from '../dateRanges';

moment.locale('en-gb');

const dateFormat = 'D MMM YYYY';
const BGSSite =
  'https://www.bgs.ac.uk/data/webservices/CoordConvert_LL_BNG.cfc?method=BNGtoLatLng&easting=';

const openProxy = 'https://cors-anywhere.herokuapp.com';

const Pointer = () => {
  return (
    <span className="pointer" role="img" aria-label="roadworks-location">
      👆
    </span>
  );
};

const MapModal = ({ centre, open, close }) => (
  <ReactModal isOpen={open} onRequestClose={close} contentLabel="Roadworks Map">
    <div id="map">
      <RoadworksMap
        bootstrapURLKeys={{ key: process.env.REACT_APP_MAPS_KEY }}
        defaultCenter={centre}
        defaultZoom={17}
      >
        <Pointer {...centre} />
      </RoadworksMap>
    </div>
  </ReactModal>
);

MapModal.propTypes = {
  centre: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

const Road = ({ item }) => {
  const [mapOpen, setMapOpen] = useState(false);
  const [mapCentre, setMapCentre] = useState({ lat: 0, lng: 0 });

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
      console.log({ fullURL });
      const response = await fetch(fullURL);
      const data = await response.json();

      const { LONGITUDE, LATITUDE } = data;
      console.log({ east, north, LONGITUDE, LATITUDE });
      setMapCentre({ lat: LATITUDE, lng: LONGITUDE });
      setMapOpen(true);
    } catch (e) {
      console.error(e);
    }
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
        Duration: {sdate.format(dateFormat)} - {edate.format(dateFormat)}{' '}
        {shouldBeDone && <i>(should be complete)</i>}
        {notStarted && <i>(Starting soon)</i>}
      </span>
      <MapModal
        centre={mapCentre}
        open={mapOpen}
        close={() => setMapOpen(false)}
      />
    </article>
  );
};

Road.propTypes = {
  item: PropTypes.object.isRequired,
};

export default Road;
