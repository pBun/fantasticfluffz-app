import React, { useEffect, useState } from 'react';
import AnchorAddress from './AnchorAddress';
import imgHashes from '../data/image-hashes.json';
import cidData from '../data/cids.json';
import appConfig from '../data/app.json';
import { combineHashes, getProvenance } from '../service/provenance';

import './PageProvenance.css';

function PageProvenance() {
  const [provenance, setProvenance] = useState('');
  const combinedHashes = combineHashes(imgHashes);
  useEffect(() => {
    (async () => {
      const prov = await getProvenance(combinedHashes);
      setProvenance(prov);
    })();
  }, [combinedHashes]);
  return (
    <div className="PageProvenance">
      <div className="PageProvenance-inner">
        <div className="PageProvenance-section">
          <h1 className="PageProvenance-headline">
            {appConfig.TOKEN_NAME.toUpperCase()}
            {' '}
            PROVENANCE RECORD
          </h1>
          <p className="PageProvenance-blurb">
            This page presents the provenance record of each token that will ever exist.
            Every image is uploaded to IPFS as a directory.
            IPFS then generates a CID for the entire directory.
            This CID is unique to the directory of assets and altering the contents of the
            directory in any way will thus will change the CID.
            To read more about CIDs and their importance, check out
            {' '}
            <a href="https://docs.pinata.cloud/nfts" target="_blank" rel="noreferrer">Pinata’s article on the topic</a>
            .
          </p>
          <p className="PageProvenance-blurb">Furthermore, we’ve also generated a hash for each image using the SHA-256 algorithm. We’ve then taken each of these hashes and concatenated them into one large string. This large string is then used to generate one final SHA-256 hash. This is the &quot;Final Proof Hash&quot; of the collection and is stored in the smart contract.</p>
        </div>
        <div className="PageProvenance-section">
          <h2 className="PageProvenance-headline">TLDR;</h2>
          <p className="PageProvenance-blurb">
            <strong>
              {appConfig.TOKEN_NAME}
              {' '}
              Contract Address:
            </strong>
            {' '}
            <AnchorAddress chainId={1} address={appConfig.CONTRACT_ADDRESSES[1]} />
          </p>
          <p className="PageProvenance-blurb">
            <strong>IPFS CID:</strong>
            {' '}
            <code>{cidData.rootImg}</code>
          </p>
          <p className="PageProvenance-blurb">
            <strong>Final Proof Hash:</strong>
            {' '}
            <code>{provenance}</code>
          </p>
        </div>
        <div className="PageProvenance-section">
          <h2 className="PageProvenance-headline">Concatenated Collection Hash String</h2>
          <div className="PageProvenance-codeBlockWrapper PageProvenance-blurb">
            <code className="PageProvenance-codeBlock">
              {combinedHashes}
            </code>
          </div>
        </div>
        <div className="PageProvenance-section">
          <h2 className="PageProvenance-headline">Collection Records</h2>
          <div className="PageProvenance-tableWrapper">
            <table className="PageProvenance-table">
              <thead>
                <tr>
                  <th>Token ID</th>
                  <th>SHA-256 Hash</th>
                  <th>IPFS CID</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(imgHashes).map((tokenId) => (
                  <tr key={tokenId}>
                    <td><code>{tokenId}</code></td>
                    <td><code>{imgHashes[tokenId]}</code></td>
                    <td><a href={`${appConfig.BASE_URI}/${cidData[`${tokenId}.png`]}`} target="_blank" rel="noreferrer"><code>{cidData[`${tokenId}.png`]}</code></a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageProvenance;
