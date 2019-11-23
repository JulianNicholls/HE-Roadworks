import React from 'react';

import Header from './components/Header';
import Introduction from './components/Introduction';
import SelectionPanel from './components/SelectionPanel';
import RoadworksList from './components/RoadworksList';
import MapModal from './components/MapModal';
import { useRoadworks } from './context';

function App() {
  const { centreEN } = useRoadworks();

  return (
    <div className="App">
      <Header />
      <main className="container">
        <div className="top-section">
          <Introduction />
          <SelectionPanel />
        </div>

        <RoadworksList />
      </main>

      <MapModal centre={centreEN} />
    </div>
  );
}

export default App;
