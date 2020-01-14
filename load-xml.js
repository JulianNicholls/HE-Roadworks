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
    { regex: /hardshoulder/gi, replacement: 'hard shoulder' },
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

// The wrinkle in the sorting is that there are entries like 'M27 M3' which
// would need to be sorted between 'M27' and 'M27 M271'. There are actually entries
// that have more than two roads, but they tend to be more or less unique.

// Regex for splitting, thus:
//  'M27 M3' -> [matchdata, '27', 'M', '3']
const numRegex = /^[AM](\d{1,4})\s?([AM])?(\d{1,4})?/;

const compare = (a, b) => {
  // First of all, Motorways before A-roads
  if (a.roads[0] !== b.roads[0]) return a.roads[0] < b.roads[0] ? 1 : -1;

  // Both primaries are Motorway or A-road.
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

// Parse the XML and convert the JSON output which retains the multiple
// levels contained in the XML to a flat representation of each roadwork item.
// Then, sort it into the order mentioned above.

const parserOptions = {
  attributeNamePrefix: '', // Don't prefix attributes
  ignoreAttributes: false, // Collect attributes
  ignoreNameSpace: true, // Throw away the namespaces
  AllowBooleanAttributes: true, // I'm not sure there are any
  parseAttributeValue: true, // Parse out attribute values to Number etc
};

const parseRoadworks = xmlData => {
  const jsonData = parser.parse(xmlData, parserOptions);

  const rawData = jsonData.Report.HE_PLANNED_ROADWORKS.HE_PLANNED_WORKS_Collection.HE_PLANNED_WORKS.reduce(
    (works, cur) => {
      if (
        cur.EASTNORTH &&
        cur.EASTNORTH.Report &&
        cur.EASTNORTH.Report.EASTINGNORTHING // Sometimes (once?) an empty string
      ) {
        const eastNorth =
          cur.EASTNORTH.Report.EASTINGNORTHING.EASTNORTH_Collection.EASTNORTH;

        let roads = cur.ROADS.Report.ROADS.ROAD_Collection.ROAD;

        // Turn roads into a string if there is more than one road
        roads =
          roads.ROAD_NUMBER ||
          roads.map(({ ROAD_NUMBER }) => ROAD_NUMBER).join(' ');

        // Clean up the description
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

        return [...works, item];
      }

      return works;
    },
    []
  );

  return rawData.sort(compare); // Sort the roads
};

const validate = xmlData => {
  return parser.validate(xmlData);
};

module.exports = { validate, parseRoadworks };
