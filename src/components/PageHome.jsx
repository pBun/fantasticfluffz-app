import React from 'react';
import { Link } from 'react-router-dom';
import SectionMint from './SectionMint';
import PreviewVideoSrc from '../media/preview.mp4';

import config from '../data/app.json';

import './PageHome.css';

function PageHome() {
  return (
    <div className="PageHome">
      <div className="PageHome-section PageHome-section--intro">
        <div className="PageHome-sectionMain">
          <div className="PageHome-sectionMainInner">
            <video className="PageHome-previewVideo" muted autoPlay loop>
              <source src={PreviewVideoSrc} />
            </video>
            <p className="PageHome-blurb">
              They cute!
            </p>
          </div>
          <SectionMint />
        </div>
      </div>
      <div className="PageHome-section PageHome-section--details">
        <div className="PageHome-sectionInner">
          <a
            className="PageHome-sectionImg PageHome-sectionImg--preview"
            href={config.OPENSEA_URL}
            target="_blank"
            rel="noreferrer"
          >
            <img src="//placekitten.com/g/100/100" alt="A preview of a few FantasticFluffz" />
          </a>
          <div className="PageHome-sectionMain">
            <h2 className="PageHome-headline">Give me the deets</h2>
            <p className="PageHome-blurb">
              FantasticFluffz is a limited collection of 10,000 unique NFT tokens living on
              the Ethereum blockchain. Each token is uniquely crafted by combining
              nine traits from a collection of over 100 assets!
            </p>
            <p className="PageHome-blurb">
              All token images and metadata are built to last.
              Check out
              {' '}
              <Link to="/provenance">the provenance page</Link>
              {' '}
              for more info on how we strive to make them outlive you.
            </p>
            <p className="PageHome-blurb">
              Ready to dive in? Mint a few tokens above and/or trade them on
              {' '}
              <a className="TextIcon TextIcon--opensea" href={config.OPENSEA_URL} target="_blank" rel="noreferrer">OpenSea</a>
              !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageHome;
