import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import LoadingPanel from './LoadingPanel';
import ReactModal from 'react-modal';
import RoadworksMap from 'google-map-react';

const nearbySite = `http://nearby.org.uk/api/convert.php?key=${process.env.REACT_APP_NEARBY_KEY}&output=text&p=`;
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
    top: '10vh',
    bottom: '10vh',
    left: '10vw',
    right: '10vw',
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
      let response, fullURL;

      setLoading(true);

      try {
        fullURL = `${openProxy}/${nearbySite}${centre.east},${centre.north}`;
        response = await axios.get(fullURL);

        if (response.status === 200) {
          const { lat, lng } = response.data.split('\n').reduce(
            (coords, line) => {
              if (line.startsWith('ll')) {
                const parts = line.split(',');
                return { lat: parseFloat(parts[2]), lng: parseFloat(parts[3]) };
              }

              return coords;
            },
            { lat: 0, lng: 0 }
          );

          setMapCentre({ lat, lng });
          setLoading(false);
          setOpen(true);
        } else {
          console.warn({ fullURL, response });
          setLoading(false);
        }
      } catch (error) {
        console.error({ error });
        console.warn({ fullURL, response });
        setLoading(false);
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
