import React from 'react';
import PropTypes from 'prop-types';

import ReactModal from 'react-modal';
import RoadworksMap from 'google-map-react';

ReactModal.setAppElement('#root');

ReactModal.defaultStyles = {
  ...ReactModal.defaultStyles,
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

const MapModal = ({ centre, open, close }) => (
  <ReactModal isOpen={open} onRequestClose={close} contentLabel="Roadworks Map">
    <div id="map">
      <RoadworksMap
        bootstrapURLKeys={{ key: process.env.REACT_APP_MAPS_KEY }}
        defaultCenter={centre}
        defaultZoom={15}
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

export default MapModal;
