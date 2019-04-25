import React, { useEffect, useState } from 'react';

import roadworksData from './data/roadworks.json';

export const WorksContext = React.createContext();

export const Provider = ({ children }) => {
  const [roadworks, setRoadworks] = useState([]);
  const [roads, setRoads] = useState([]);

  const initialLoad = () => {
    // Sort the roadworks:
    //  First, Motorways: M1, M2, ... M80, ...
    //  Then, A roads: A1, A2, ... A337, ...

    const numRegex = /^[AM](\d{1,4})/;

    roadworksData.sort((a, b) => {
      if (a.roads[0] !== b.roads[0]) return a.roads[0] < b.roads[0] ? 1 : -1;

      const left = a.roads.match(numRegex)[1];
      const right = b.roads.match(numRegex)[1];

      return Number(left) - Number(right);
    });

    // Collect the unique roads and their index in the list
    let lastRoads = { roads: '', index: 0 };

    setRoadworks(roadworksData);

    const roadList = roadworksData.reduce((acc, { roads }, index) => {
      if (roads !== lastRoads.roads) {
        const newValue = { roads, index };

        acc.push(newValue);
        lastRoads = newValue;
      }

      return acc;
    }, []);

    console.log({ roadList, lastRoads });

    setRoads(roadList);
  };

  useEffect(initialLoad, []);

  const state = { roadworks, roads };

  return <WorksContext.Provider value={state}>{children}</WorksContext.Provider>;
};

export default WorksContext;
