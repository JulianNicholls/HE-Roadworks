import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import RoadworksMap from 'google-map-react';

import Header from './components/Header';
import Introduction from './components/Introduction';
import SelectionPanel from './components/SelectionPanel';
import RoadworksList from './components/RoadworksList';

ReactModal.setAppElement('#root');

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

function App() {
  const [mapOpen, setMapOpen] = useState(false);
  const [mapCentre, setMapCentre] = useState({ lat: 0, lng: 0 });

  return (
    <div className="App">
      <Header />
      <main className="container">
        <div className="top-section">
          <Introduction />
          <SelectionPanel />
        </div>

        <RoadworksList
          setMapCentre={setMapCentre}
          setMapOpen={() => setMapOpen(true)}
        />
      </main>

      <MapModal
        centre={mapCentre}
        open={mapOpen}
        close={() => setMapOpen(false)}
      />
    </div>
  );
}

export default App;
