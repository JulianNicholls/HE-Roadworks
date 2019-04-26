const fs = require('fs');
const express = require('express');
const parser = require('fast-xml-parser');

const replacements = {
  Junction: /jct/i,
  Junction: /jct jct/i,
  Junction: /jn/i,
  '\n': /&#xD;&#xA;/,
  '\n': /&#xD;/,
  '\n': /&#xA;/,
};

function flattenRoadworks(jsonData) {
  const rawData = jsonData.Report.HE_PLANNED_ROADWORKS.HE_PLANNED_WORKS_Collection.HE_PLANNED_WORKS.reduce(
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
        description: cur.DESCRIPTION.replace(/&#xD;&#xA;/g, '\n'),
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

  // Sort the roadworks:
  //  First, Motorways: M1, M2, ... M80, ...
  //  Then, A roads: A1, A2, ... A337, ...

  const numRegex = /^[AM](\d{1,4})\s?([AM])?(\d{1,4})?/;

  rawData.sort((a, b) => {
    if (a.roads[0] !== b.roads[0]) return a.roads[0] < b.roads[0] ? 1 : -1;

    const left = a.roads.match(numRegex);
    const right = b.roads.match(numRegex);

    if (left[1] !== right[1]) return Number(left[1]) - Number(right[1]);

    if (left[2] === undefined) {
      if (right[2] === undefined) return 0;

      return -1;
    } else if (right[2] === undefined) return 1;

    if (left[2] !== right[2]) return left[2] < right[2] ? 1 : -1;

    return Number(left[3]) - Number(right[3]);
  });

  return rawData;
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

console.log(JSON.stringify(flattenRoadworks(roadworks), null, 2));
