import React, { useContext, useState } from 'react';
import { useDebounce } from 'react-use';

import WorksContext from '../context';

const SelectionPanel = () => {
  const { roads, selected, setSelected, setSearchText } = useContext(
    WorksContext
  );
  const [location, setLocation] = useState('');
  const [lastSelected, setLastSelected] = useState(selected);

  useDebounce(
    () => {
      // When entering search text, remove the selected road from the context

      // Only start searching after two characters. I was going to make it three,
      // but searching for e.g. BT is a valid thing to do.
      if (location.length > 1) {
        setSelected('');
        setSearchText(location);
      } else if (location.length === 0 && lastSelected) {
        setSelected(lastSelected);
      }
    },
    300,
    [location]
  );

  // When selecting a road, remove the search text from here and the context
  const changeRoad = e => {
    setSelected(e.target.value);
    setLastSelected(e.target.value);
    setLocation('');
    setSearchText('');
  };

  return (
    <section className="selection-panel">
      <div>
        <label htmlFor="road">Road</label>
        <select id="road" onChange={changeRoad} value={selected}>
          <option value="">&nbsp;</option>
          {roads.map(({ roads }, index) => (
            <option key={index} value={roads}>
              {roads}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="location">Search</label>
        <input
          type="search"
          id="location"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
      </div>
    </section>
  );
};

export default SelectionPanel;
