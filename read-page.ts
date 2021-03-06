import { HTMLElement } from 'node-html-parser';

const { parse: parseHTML } = require('node-html-parser');
import axios from 'axios';

import { validate, parseRoadworks } from './load-xml';

const DATAFILE_PAGE =
  'https://data.gov.uk/dataset/highways_agency_planned_roadworks';

const loadPage = async (href: string) => {
  const response = await axios.get(href);

  return response.data;
};

const main = async () => {
  const wholePage = await loadPage(DATAFILE_PAGE);

  const root: HTMLElement = parseHTML(wholePage);
  const dataFileTRs: Array<HTMLElement> = root.querySelectorAll('tr.js-datafile-visible');
  const liveTRs = dataFileTRs.filter((tr: HTMLElement) => {
    return !tr.classNames.includes('js-show-more-datafiles');
  });

  if (dataFileTRs.length === 0 || liveTRs.length === 0) {
    console.error('No data file records found at', DATAFILE_PAGE);
    process.exit(-1);
  }

  interface HrefRecord {
    href: string;
    publishedDate: Date;
  }

  const dataFiles: Array<HrefRecord> = liveTRs.reduce(
    (acc: Array<HrefRecord>, tr: HTMLElement) => {
      const links: Array<HTMLElement> = tr.querySelectorAll('a');
      if (links.length !== 1) {
        console.error('Incorrect Links:', { links });
      } else {
        const href = links[0].attributes.href;
        // .xml OUGHT to be at the end, just after the date, however, sometimees
        // there's a bad link, like ...xml.xml
        const matchDate = href.match(/(\d{4})_(\d{1,2})_(\d{1,2})\.xml$/);
        if (!matchDate || matchDate.length < 4) {
          console.error('Bad link:', href);
          return acc;
        }
        const textDate = matchDate.slice(1, 4).join('-');

        const publishedDate = new Date(textDate);

        return [...acc, { href, publishedDate }];
      }
    },
    []
  );

  if (dataFiles[0].publishedDate < dataFiles[1].publishedDate) {
    console.error('Dates are not decreasing');
    process.exit(-1);
  }

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
