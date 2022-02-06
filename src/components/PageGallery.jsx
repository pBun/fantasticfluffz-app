import React from 'react';

import appConfig from '../data/app.json';
import rootCids from '../data/cids/root.json';

import './PageGallery.css';

function PageGallery() {
  return (
    <div className="PageGallery RainbowBG">
      <div className="PageGallery-inner">
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
            width: '100%',
          }}
        >
          {Array.from(Array(100)).map((val, id) => (
            // eslint-disable-next-line react/no-array-index-key
            <img key={id} style={{ display: 'block', margin: '4px' }} src={`${appConfig.BASE_URI}/${rootCids.img}/${id}.png`} alt={`token #${id}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PageGallery;
