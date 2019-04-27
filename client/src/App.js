import React from 'react';

import Header from './components/Header';
import SelectionPanel from './components/SelectionPanel';
import RoadworksList from './components/RoadworksList';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="container">
        <div className="top-section">
          <div className="introduction">
            <p>
              In 2011, the UK's{' '}
              <a
                href="https://www.gov.uk/government/organisations/department-for-transport"
                title="DfT Site"
              >
                Department for Transport (DfT)
              </a>{' '}
              began to issue datasets for public use under the{' '}
              <a
                href="https://www.nationalarchives.gov.uk/doc/open%2Dgovernment%2Dlicence/"
                title="Usage Licence"
              >
                Open&nbsp;Government&nbsp;License
              </a>
              . One of the first of these was planned roadworks issued by the
              Highways Agency (now Highways England).
            </p>

            <p>
              Presented here is the latest data on planned roadworks on Highways
              England's roads, distilled from the latest data file on{' '}
              <a
                href="https://data.gov.uk/dataset/5b3267d8-4307-4eef-a9af-3a4c28224694/planned-road-works-on-the-he-road-network"
                title="dataset"
              >
                this&nbsp;page
              </a>
              .
            </p>
            <p>
              You can find information by road number, or search by location. The
              roadworks that are shown have already started or will start within
              the next week. Roadworks which should have been complete at least a
              week ago are filtered out (hopeful, I know).
            </p>
          </div>
          <SelectionPanel />
        </div>
        <RoadworksList />
      </main>
    </div>
  );
}

export default App;
