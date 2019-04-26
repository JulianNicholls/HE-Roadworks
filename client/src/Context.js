import React, { useEffect, useState } from 'react';

import roadworks from './data/roadworks.json';

export const WorksContext = React.createContext();

export const Provider = ({ children }) => {
  const [roads, setRoads] = useState([]);

  const initialLoad = () => {
    // Collect the unique roads and their index in the list
    let lastRoads = { roads: '', index: 0 };

    const roadList = roadworks.reduce((acc, { roads }, index) => {
      if (roads !== lastRoads.roads) {
        const newValue = { roads, index };

        acc.push(newValue);
        lastRoads = newValue;
      }

      return acc;
    }, []);

    setRoads(roadList);
  };

  useEffect(initialLoad, []);

  const state = { roadworks, roads };

  return <WorksContext.Provider value={state}>{children}</WorksContext.Provider>;
};

export default WorksContext;
