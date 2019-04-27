import React, { useEffect, useState } from 'react';

import roadworks from '../data/roadworks.json';

export const WorksContext = React.createContext();

export const Provider = ({ children }) => {
  const [roads, setRoads] = useState([]);
  const [selected, setSelected] = useState('');
  const [searchText, setSearchText] = useState('');

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
    setSelected(roadList[0].roads); // Default to first of list
  };

  const selectedRoadworks = () => {
    let retval = [];

    if (selected !== '') {
      const roadIndex = roads.findIndex(element => element.roads === selected);

      for (let i = roads[roadIndex].index; i < roads[roadIndex + 1].index; ++i) {
        retval.push(roadworks[i]);
      }
    } else if (searchText !== '') {
      const st = searchText.toLocaleLowerCase();

      retval = roadworks.filter(({ description }) =>
        description.toLocaleLowerCase().includes(st)
      );
    }

    return retval;
  };

  useEffect(initialLoad, []);

  const state = {
    roadworks,
    roads,
    selected,
    searchText,
    selectedRoadworks,
    setSelected,
    setSearchText,
  };

  return <WorksContext.Provider value={state}>{children}</WorksContext.Provider>;
};

export default WorksContext;
