import React from 'react';
import moment from 'moment';

import roadworks from '../data/roadworks.json';

moment.locale('en-gb');

const dateFormat = 'D MMM YYYY';

const RoadworksList = () => {
  return (
    <div>
      {roadworks.map((item, index) => (
        <article key={index}>
          <h2>{item.roads}</h2>
          <p>
            Duration: {moment(item.startDate).format(dateFormat)} -{' '}
            {moment(item.endDate).format(dateFormat)}
            <br />
          </p>
        </article>
      ))}
    </div>
  );
};

export default RoadworksList;
