import React, { useContext } from 'react';

import WorksContext from '../Context';

const SelectionPanel = () => {
  const { roads, setSelected } = useContext(WorksContext);

  const changeRoad = e => {
    setSelected(e.target.value);
  };

  return (
    <div class="selection-panel">
      <label htmlFor="road">Road</label>
      <select id="road" onChange={changeRoad}>
        {roads.map(({ roads }) => (
          <option value={roads}>{roads}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectionPanel;
