import React, { useContext, useState } from 'react';

import WorksContext from '../context';

const SelectionPanel = () => {
  const { roads, selected, setSelected, setSearchText } = useContext(
    WorksContext
  );
  const [location, setLocation] = useState('');

  const changeRoad = e => {
    setSelected(e.target.value);
    setLocation('');
    setSearchText('');
  };

  const newLocation = e => {
    const newLoc = e.target.value;

    setLocation(newLoc);

    if (newLoc.length > 2) {
      setSelected('');
      setSearchText(newLoc);
    }
  };

  return (
    <div className="selection-panel">
      <div>
        <label htmlFor="road">Road</label>
        <select id="road" onChange={changeRoad} defaultValue={selected}>
          {roads.map(({ roads }, index) => (
            <option key={index} value={roads}>
              {roads}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={newLocation}
        />
      </div>
    </div>
  );
};

export default SelectionPanel;