const fs = require('fs');
const parser = require('fast-xml-parser');

const cleanup = description => {
  const replacements = [
    { regex: /jct jct/gi, replacement: 'Junction' },
    { regex: /jct/gi, replacement: 'Junction' },
    { regex: /jn/gi, replacement: 'Junction' },
    { regex: /&#xD;&#xA;/g, replacement: '\n' },
    { regex: /&#xA;/g, replacement: '\n' },
    { regex: /&#xD;/g, replacement: '\n' },
    { regex: /&#x9;/g, replacement: '' },
    { regex: /\n\n\n/g, replacement: '\n' },
    { regex: /\n\n/g, replacement: '\n' },
    { regex: /[ \t][ \t][ \t]/g, replacement: ' ' },
    { regex: /[ \t][ \t]/g, replacement: ' ' },
    { regex: /hardshoulder/g, replacement: 'hard shoulder' },
    { regex: /\s+&amp;\s+/g, replacement: ' and ' },
    { regex: /\s+&\s+/g, replacement: ' and ' },
    { regex: /\s+southbound\s+/g, replacement: ' Southbound ' },
    { regex: /\s+northbound\s+/g, replacement: ' Northbound ' },
    { regex: /\s+eastbound\s+/g, replacement: ' Eastbound ' },
    { regex: /\s+westbound\s+/g, replacement: ' Westbound ' },
    { regex: /\s+SB\s+/gi, replacement: ' Southbound ' },
    { regex: /\s+NB\s+/gi, replacement: ' Northbound ' },
  ];

  return replacements.reduce((desc, { regex, replacement }) => {
    return desc.replace(regex, replacement);
  }, description);
};

// The wrinkle if the sorting is that there are entries like 'M27 M271' which
// would need to be sorted between 'M27' and 'M27 M3'. There are actually entries
// that have more than two roads, but they tend to be more or less unique.

// Regex for splitting, thus:
//  'M27 M3' -> [matchdata, '27', 'M', '3']
const numRegex = /^[AM](\d{1,4})\s?([AM])?(\d{1,4})?/;

const compare = (a, b) => {
  // First of all, primary road M-ways before A-roads
  if (a.roads[0] !== b.roads[0]) return a.roads[0] < b.roads[0] ? 1 : -1;

  // Both primaries are M-way or A-road.
  const left = a.roads.match(numRegex);
  const right = b.roads.match(numRegex);

  // If the road number differs, just return the difference.
  if (left[1] !== right[1]) return Number(left[1]) - Number(right[1]);

  if (left[2] === undefined) {
    // No second road left...
    if (right[2] === undefined) return 0; // No second road right means they are equal.

    return -1; // Left no second, right has, left is less
  } else if (right[2] === undefined) return 1; // Left has second, right not, left is more

  // Back to A-road vs M-way on secondary
  if (left[2] !== right[2]) return left[2] < right[2] ? 1 : -1;

  // Both secondary are A-road or M-way, return difference
  return Number(left[3]) - Number(right[3]);
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

      const description = cleanup(cur.DESCRIPTION);

      const item = {
        startDate: new Date(cur.SDATE),
        endDate: new Date(cur.EDATE),
        expectedDelay: cur.EXPDEL,
        description,
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
  //  First, the Motorways in numerical order
  //  Then, the A roads, likewise in numerical order

  rawData.sort(compare);

  return rawData;
}

let serving = false;
let filename = process.argv[2]; // Assume not serving
let app;

if (process.argv[2].toLowerCase() === 'serve') {
  serving = true;
  filename = process.argv[3];
  app = require('express')();
}

const xmlData = fs.readFileSync(filename, 'utf-8');

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

if (serving) {
  app.get('/', (req, res, next) => {
    // res.status(200).json(roadworks);
    res.status(200).json(flattenRoadworks(roadworks));
  });

  app.listen(process.env.POST || 3050, () => {
    console.log('Raw JSON server running on port 3050');
  });
} else {
  console.log(JSON.stringify(flattenRoadworks(roadworks), null, 2));
}
