import React from 'react';

import Header from './components/Header';
import Introduction from './components/Introduction';
import SelectionPanel from './components/SelectionPanel';
import RoadworksList from './components/RoadworksList';

function App() {
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
    </div>
  );
}

export default App;
