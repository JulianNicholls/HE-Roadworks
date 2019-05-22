import React, { useState } from 'react';

import Header from './components/Header';
import Introduction from './components/Introduction';
import SelectionPanel from './components/SelectionPanel';
import RoadworksList from './components/RoadworksList';
import MapModal from './components/MapModal';

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
