import React from 'react';
import moment from 'moment';

import roadworks from '../data/roadworks.json';

moment.locale('en-gb');

const dateFormat = 'D MMM YYYY';

const RoadworksList = () => {
  const numRegex = /^[AM](\d{1,3})/;

  roadworks.sort((a, b) => {
    if (a.roads[0] !== b.roads[0]) return a.roads[0] < b.roads[0] ? 1 : -1;

    const left = a.roads.match(numRegex)[1];
    const right = b.roads.match(numRegex)[1];

    return Number(left) - Number(right);
  });

  return (
    <section>
      {roadworks.map((item, index) => {
        const {
          roads,
          description,
          startDate,
          endDate,
          expectedDelay,
          closureType,
          centreEasting,
          centreNorthing,
        } = item;

        const sdate = moment(startDate);
        const edate = moment(endDate);
        const roadClass = roads[0] === 'A' ? 'a-road' : 'motorway';

        return (
          <article className={roadClass} key={index}>
            <h2>{roads}</h2>
            <p>{description}</p>
            <span className="duration">
              Duration: {sdate.format(dateFormat)} - {edate.format(dateFormat)}
            </span>
          </article>
        );
      })}
    </section>
  );
};

export default RoadworksList;
