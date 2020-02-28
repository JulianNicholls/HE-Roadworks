import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { RoadworksProvider } from './context';

import 'normalize.css/normalize.css';
import './index.css';

ReactDOM.render(
  <RoadworksProvider>
    <App />
  </RoadworksProvider>,
  document.getElementById('root')
);
