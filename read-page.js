const fs = require('fs');
const { parse } = require('node-html-parser');
const axios = require('axios');

const { validate, parseRoadworks } = require('./load-xml');

const loadPage = async href => {
  const response = await axios.get(href);

  return response.data;
};

const main = async () => {
  const wholePage = fs.readFileSync('./data-page.html', 'utf-8');

  const root = parse(wholePage);
  const dataFileTRs = root.querySelectorAll('tr.dgu-datafile');
  const liveTRs = dataFileTRs.filter(
    tr => !tr.classNames.includes('js-show-more-datafiles')
  );

  // console.log(`Found ${dataFileTRs.length} datafile <tr>s`);
  // console.log(`Found ${liveTRs.length} live datafile <tr>s`);

  const dataFiles = liveTRs.reduce((acc, tr) => {
    const links = tr.querySelectorAll('a');
    if (links.length > 1) {
      console.warn({ links });
    } else {
      const href = links[0].attributes.href;
      const matchDate = href.match(/(\d{4})_(\d{2})_(\d{2})\.xml$/);
      const textDate = matchDate.slice(1, 4).join('-');

      const publishedDate = new Date(textDate);

      return [...acc, { href, publishedDate }];
    }
  }, []);

  if (dataFiles[0].publishedDate < dataFiles[1].publishedDate) {
    console.error('Dates are not decreasing');
  }

  // console.log({ dataFiles });

  const xmlData = await loadPage(dataFiles[0].href);
  const validObj = validate(xmlData);

  if (validObj !== true) {
    console.error('XML Error:\n', { validObj });
    process.exit(-1);
  }

  const roadworks = parseRoadworks(xmlData);

  console.log(JSON.stringify(roadworks, null, 2));
};

main();
