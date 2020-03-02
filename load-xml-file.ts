import { Request, Response } from 'express';

const fs = require('fs');

const { validate, parseRoadworks } = require('./load-xml');

let serving = false; // Assume not serving
let filename = process.argv[2];
let app;

if (process.argv[2].toLowerCase() === 'serve') {
  serving = true;
  filename = process.argv[3];
  app = require('express')();
}

if (!filename) {
  console.error('No filename specified.');
  process.exit(-1);
}

const xmlData = fs.readFileSync(filename, 'utf-8');

// Validate the incoming XML and exit if not
const validObj = validate(xmlData);

if (validObj !== true) {
  console.error('XML Error:\n', { validObj });
  process.exit(-1);
}

// Parse the XML and flatten out the resulting JSON
const roadworks = parseRoadworks(xmlData);

// Either serve it up at localhost:3050 or just print it.
if (serving) {
  app.get('/', (req: Request, res: Response) => {
    res.status(200).json(roadworks);
  });

  app.listen(process.env.PORT || 3050, () => {
    console.log('Raw JSON server running on port 3050');
  });
} else {
  console.log(JSON.stringify(roadworks, null, 2));
}
