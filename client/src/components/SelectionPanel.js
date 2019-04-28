import React, { useContext, useState } from 'react';

import WorksContext from '../context';

const SelectionPanel = () => {
  const { roads, selected, setSelected, setSearchText } = useContext(
    WorksContext
  );
  const [location, setLocation] = useState('');

  // When selecting a road, remove the search text from here and the context
  const changeRoad = e => {
    setSelected(e.target.value);
    setLocation('');
    setSearchText('');
  };

  // When entering search text, remove the selected road from the context
  const newLocation = e => {
    const newLoc = e.target.value;

    setLocation(newLoc);

    // Only start searching after two characters. I was going to make it three,
    // but searching for e.g. BT is a valid thing to do.
    if (newLoc.length > 1) {
      setSelected('');
      setSearchText(newLoc);
    }
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
          onChange={newLocation}
        />
      </div>
    </section>
  );
};

export default SelectionPanel;
