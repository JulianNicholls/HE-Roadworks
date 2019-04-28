import React, { useEffect, useState } from 'react';

const weekms = 7 * 86400 * 1000; // A week of milliseconds
const now = Date.now();
const weekAgo = now - weekms;
const weeksTime = now + weekms;

export const WorksContext = React.createContext();

export const Provider = ({ children }) => {
  const [roadworks, setRoadworks] = useState([]);
  const [roads, setRoads] = useState([]);
  const [selected, setSelected] = useState('');
  const [searchText, setSearchText] = useState('');

  const initialLoad = async () => {
    try {
      const response = await fetch('/data/roadworks.json');
      const roadworksData = await response.json();

      // Filter the roadworks so that
      //   (a) They start before 7 days time.
      //   (b) They haven't been over for more than a week.

      const filteredRoadworks = roadworksData.filter(({ startDate, endDate }) => {
        const sdate = Date.parse(startDate);
        const edate = Date.parse(endDate);

        if (sdate > weeksTime || edate < weekAgo)
          console.log({ startDate, endDate });

        return sdate <= weeksTime && edate >= weekAgo;
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

  useEffect(() => {
    initialLoad();
  }, []);

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
