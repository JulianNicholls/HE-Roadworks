const fs = require('fs');
const express = require('express');
const parser = require('fast-xml-parser');

function flattenRoadworks(jsonData) {
  return jsonData.Report.HE_PLANNED_ROADWORKS.HE_PLANNED_WORKS_Collection.HE_PLANNED_WORKS.reduce(
    (works, cur) => {
      const eastNorth =
        cur.EASTNORTH.Report.EASTINGNORTHING.EASTNORTH_Collection.EASTNORTH;

      let roads = cur.ROADS.Report.ROADS.ROAD_Collection.ROAD;

      roads =
        roads.ROAD_NUMBER ||
        roads.map(({ ROAD_NUMBER }) => ROAD_NUMBER).join(' ');

      const item = {
        startDate: new Date(cur.SDATE),
        endDate: new Date(cur.EDATE),
        expectedDelay: cur.EXPDEL,
        description: cur.DESCRIPTION,
        closureType: cur.CLOSURE_TYPE,
        centreEasting: eastNorth.CENTRE_EASTING,
        centreNorthing: eastNorth.CENTRE_NORTHING,
        roads,
      };

      works.push(item);

      return works;
    },
    []
  );
}

const app = express();

const xmlData = fs.readFileSync(
  process.argv[2] || 'he_roadworks_2019_04_15.xml',
  'utf-8'
);

const parserOptions = {
  attributeNamePrefix: '',
  ignoreAttributes: false,
  ignoreNameSpace: true,
  AllowBooleanAttributes: true,
  parseAttributeValue: true,
};

const validObj = parser.validate(xmlData);

if (validObj !== true) {
  console.error({ validObj });
  process.exit(-1);
}

const roadworks = parser.parse(xmlData, parserOptions);

app.get('/', (req, res, next) => {
  // res.status(200).json(roadworks);
  res.status(200).json(flattenRoadworks(roadworks));
});

// app.listen(process.env.POST || 3050, () => {
//   console.log('Raw JSON server running');
// });

console.log(JSON.stringify(flattenRoadworks(roadworks)));
