import React, { useState } from 'react';

import Header from './components/Header';
import Introduction from './components/Introduction';
import SelectionPanel from './components/SelectionPanel';
import RoadworksList from './components/RoadworksList';
import MapModal from './components/MapModal';

function App() {
  const [mapCentre, setMapCentre] = useState({ east: 0, north: 0 });

  return (
    <div className="App">
      <Header />
      <main className="container">
        <div className="top-section">
          <Introduction />
          <SelectionPanel />
        </div>

        <RoadworksList setMapCentre={setMapCentre} />
      </main>

      <MapModal centre={mapCentre} />
    </div>
  );
}

export default App;
