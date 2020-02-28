import React from 'react';

// Page links
const dftPage: string =
  'https://www.gov.uk/government/organisations/department-for-transport';
const oglPage: string =
  'https://www.nationalarchives.gov.uk/doc/open%2Dgovernment%2Dlicence/';
const dataPage: string =
  'https://data.gov.uk/dataset/5b3267d8-4307-4eef-a9af-3a4c28224694/planned-road-works-on-the-he-road-network';

const Introduction = (): JSX.Element => {
  return (
    <section className="introduction">
      <p>
        In 2011, the UK's{' '}
        <a href={dftPage} title="DfT Site">
          Department for Transport (DfT)
        </a>{' '}
        began to issue datasets for public use under the{' '}
        <a href={oglPage} title="Usage Licence">
          Open&nbsp;Government&nbsp;License
        </a>
        . One of the first of these was planned roadworks issued by the Highways
        Agency (now Highways England).
      </p>

      <p>
        These are the latest planned roadworks on Highways England's roads, loaded
        from the latest data file on{' '}
        <a href={dataPage} title="dataset">
          this&nbsp;page
        </a>
        .
      </p>
      <p>
        You can find information by road number, or search the descriptions. The
        listed roadworks have already started or will start within the next two
        weeks. Roadworks which should have been completed at least a week ago are
        not shown (hopeful, I know).
      </p>
    </section>
  );
};

export default Introduction;
