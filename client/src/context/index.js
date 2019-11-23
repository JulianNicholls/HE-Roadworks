import React, { useEffect, useState, useContext } from 'react';

import { inTheLastWeek, inTheNextFortnight } from '../dateRanges';

const WorksContext = React.createContext();

export const RoadworksProvider = ({ children }) => {
  const [roadworks, setRoadworks] = useState([]);
  const [roads, setRoads] = useState([]);
  const [selected, setSelected] = useState('');
  const [searchText, setSearchText] = useState('');

  const initialLoad = async () => {
    try {
      const response = await fetch('/data/roadworks.json');
      const roadworksData = await response.json();

      // Filter the roadworks so that
      //   (a) They start before 14 days time.
      //   (b) They haven't been over for more than a week.
      const filteredRoadworks = roadworksData.filter(({ startDate, endDate }) => {
        return inTheNextFortnight(startDate) && inTheLastWeek(endDate);
      });

      setRoadworks(filteredRoadworks);

      // Collect the unique roads and their index in the list
      let lastRoads = { roads: '', index: 0 };

      const roadList = filteredRoadworks.reduce((acc, { roads }, index) => {
        if (roads !== lastRoads.roads) {
          const newValue = { roads, index };

          acc.push(newValue);
          lastRoads = newValue;
        }

        return acc;
      }, []);

      setRoads(roadList);
      setSelected(roadList[0].roads); // Default to first of list
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    initialLoad();
  }, []);

  const selectedRoadworks = () => {
    let retval = [];

    if (selected !== '') {
      const roadIndex = roads.findIndex(element => element.roads === selected);
      const max =
        roadIndex < roads.length - 1
          ? roads[roadIndex + 1].index
          : roadworks.length;

      for (let i = roads[roadIndex].index; i < max; ++i) {
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

export const useRoadworks = () => {
  const context = useContext(WorksContext);

  if (context === undefined)
    throw new Error(
      'useRoadworks() must be used within a RoadworksProvider block'
    );

  return context;
};
