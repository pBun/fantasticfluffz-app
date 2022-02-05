import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { prettyAddress } from '../util/web3Address';
import supportedChains from '../data/supportedChains';

import './AnchorAddress.css';

function AnchorAddress({ chainId, address, className }) {
  const selectedChain = supportedChains.find((chain) => chain.chain_id === chainId);
  if (!selectedChain) {
    return (
      <span className={classnames('AnchorAddress', 'AnchorAddress--label', className)}>
        {prettyAddress(address)}
      </span>
    );
  }
  return (
    <a
      className={classnames('AnchorAddress', 'AnchorAddress--anchor', 'AnchorText', className)}
      href={`${selectedChain.scanner_url}/address/${address}`}
      target="_blank"
      rel="noreferrer"
    >
      {prettyAddress(address)}
    </a>
  );
}

AnchorAddress.defaultProps = {
  chainId: 1,
  className: '',
  address: '0x0000000000000000000000000000000000000000',
};

AnchorAddress.propTypes = {
  className: PropTypes.string,
  chainId: PropTypes.number,
  address: PropTypes.string,
};

export default AnchorAddress;
