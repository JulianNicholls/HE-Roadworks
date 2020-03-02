import React, { useEffect, useState, useContext } from 'react';

import { inTheLastWeek, inTheNextFortnight } from '../dateRanges';

const WorksContext = React.createContext({});

interface RoadworksProviderProps {
  children: JSX.Element | Array<JSX.Element>;
}

export const RoadworksProvider = ({ children }: RoadworksProviderProps) => {
  const [roadworks, setRoadworks] = useState<Array<WorksItem>>([]);
  const [roads, setRoads] = useState<Array<RoadIndex>>([]);
  const [selected, setSelected] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [centreEN, setCentreEN] = useState<ENLocation>({ east: 0, north: 0 });

  const initialLoad = async () => {
    try {
      const response = await fetch('/data/roadworks.json');
      const roadworksData = await response.json();

      // Filter the roadworks so that
      //   (a) They start before 14 days time.
      //   (b) They haven't been over for more than a week.
      const filteredRoadworks = roadworksData.filter(
        ({ startDate, endDate }: WorksItem) => {
          return inTheNextFortnight(startDate) && inTheLastWeek(endDate);
        }
      );

      setRoadworks(filteredRoadworks);

      // Collect the unique roads and their index in the list
      let lastRoads = { roads: '', index: 0 };

      const roadList = filteredRoadworks.reduce(
        (acc: Array<RoadIndex>, { roads }: WorksItem, index: number) => {
          if (roads !== lastRoads.roads) {
            const newValue: RoadIndex = { roads, index };

            acc.push(newValue);
            lastRoads = newValue;
          }

          return acc;
        },
        []
      );

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
    let retval: Array<WorksItem> = [];

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

  const state: WorksState = {
    roadworks,
    roads,
    selected,
    searchText,
    centreEN,
    selectedRoadworks,
    setSelected,
    setSearchText,
    setCentreEN,
  };

  return <WorksContext.Provider value={state}>{children}</WorksContext.Provider>;
};

export const useRoadworks = (): WorksState => {
  const context = useContext(WorksContext);

  if (context === undefined)
    throw new Error(
      'useRoadworks() must be used within a RoadworksProvider block'
    );

  return context as WorksState;
};
