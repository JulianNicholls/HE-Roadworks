import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import LoadingPanel from './LoadingPanel';
import ReactModal from 'react-modal';
import RoadworksMap from 'google-map-react';

const BGSSite =
  'https://www.bgs.ac.uk/data/webservices/CoordConvert_LL_BNG.cfc?method=BNGtoLatLng&easting=';

const openProxy = 'https://cors-anywhere.herokuapp.com';

ReactModal.setAppElement('#root');

ReactModal.defaultStyles = {
  ...ReactModal.defaultStyles,
  overlay: {
    ...ReactModal.defaultStyles.overlay,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    ...ReactModal.defaultStyles.content,
    top: '15vh',
    bottom: '15vh',
    left: '15vw',
    right: '15vw',
  },
};

const Pointer = () => {
  return (
    <span className="pointer" role="img" aria-label="roadworks-location">
      👆
    </span>
  );
};

const MapModal = ({ centre }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mapCentre, setMapCentre] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    const translateCentre = async () => {
      let response;

      setLoading(true);

      try {
        const fullURL = `${openProxy}/${BGSSite}${centre.east}&northing=${
          centre.north
        }`;
        response = await fetch(fullURL);

        if (response.ok) {
          const data = await response.json();

          const { LONGITUDE: lng, LATITUDE: lat } = data;
          setMapCentre({ lat, lng });
          setLoading(false);
          setOpen(true);
        } else {
          console.warn({ response });
        }
      } catch (e) {
        console.error(e);
        console.error({ response });
      }
    };

    if (centre.north === 0 && centre.east === 0) {
      setOpen(false);
    } else translateCentre();
  }, [centre]);

  return (
    <>
      {loading ? (
        <LoadingPanel />
      ) : (
        <ReactModal
          isOpen={open}
          onRequestClose={() => setOpen(false)}
          contentLabel="Roadworks Map"
        >
          <div id="map">
            <RoadworksMap
              bootstrapURLKeys={{ key: process.env.REACT_APP_MAPS_KEY }}
              defaultCenter={mapCentre}
              defaultZoom={15}
            >
              <Pointer {...mapCentre} />
            </RoadworksMap>
          </div>
        </ReactModal>
      )}
    </>
  );
};

MapModal.propTypes = {
  centre: PropTypes.shape({
    east: PropTypes.number.isRequired,
    north: PropTypes.number.isRequired,
  }).isRequired,
};

export default MapModal;
