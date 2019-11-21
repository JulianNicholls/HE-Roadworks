const responseData = `gaz,na,United Kingdom
gr10,osgb36,SK 45495 56753
gr,osgb36,SK4549556753,10
ll,wgs84,53.106037411935,-1.3218895580349
`;

const lines = responseData.split('\n');

console.log({ lines: lines.length });

let lat, lng;

lines.forEach(line => {
  if (line.startsWith('ll')) {
    const parts = line.split(',');
    console.log({ parts });
    lat = parseFloat(parts[2]);
    lng = parseFloat(parts[3]);
  }
});

console.log('lat:', lat, '\nlng:', lng);
