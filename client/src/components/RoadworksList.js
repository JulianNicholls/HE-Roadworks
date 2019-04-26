import React, { useContext } from 'react';
import moment from 'moment';

import { WorksContext } from '../Context';

moment.locale('en-gb');

const dateFormat = 'D MMM YYYY';

const RoadworksList = () => {
  const { selectedRoadworks } = useContext(WorksContext);

  console.log(selectedRoadworks());

  return (
    <section>
      {selectedRoadworks().map((item, index) => {
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
      })}
    </section>
  );
};

export default RoadworksList;
