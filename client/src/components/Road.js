import React from 'react';
import moment from 'moment';

moment.locale('en-gb');

const dateFormat = 'D MMM YYYY';

const Road = ({ item }) => {
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

  const roadClass = roads[0] === 'A' ? 'a-road' : 'motorway';
  const sdate = moment(startDate);
  const edate = moment(endDate);

  return (
    <article className={roadClass}>
      <header>
        <h2>{roads}</h2>
        <span>{expectedDelay}</span>
        <span>{closureType}</span>
      </header>
      <p>
        Location: {centreEasting} {centreNorthing}
      </p>
      <p>{description}</p>
      <span className="duration">
        Duration: {sdate.format(dateFormat)} - {edate.format(dateFormat)}
      </span>
    </article>
  );
};

export default Road;
