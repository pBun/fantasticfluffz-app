import './SectionConnection.css';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import supportedChains from '../data/supportedChains';
import { useWeb3Context, web3Disconnect } from '../context/Web3Context';

function SectionConnection({ className }) {
  const {
    web3State,
    web3Dispatch,
  } = useWeb3Context();
  const selectedChain = supportedChains.find((chain) => chain.chain_id === web3State.chainId);
  if (!web3State.connected) return '';
  return (
    <p className={classnames('SectionConnection', className)}>
      <span className="SectionConnection-chain">
        Connected to
        {' '}
        <strong>{selectedChain.name}</strong>
        {' '}
        as...
      </span>
      <span className="SectionConnection-address">
        {`${web3State.address && web3State.address.slice(0, 10)}...${web3State.address && web3State.address.slice(-10)}`}
      </span>
      <button className="ButtonText" type="button" onClick={async () => web3Dispatch(await web3Disconnect(web3State.web3))}>
        (disconnect wallet)
      </button>
    </p>
  );
}

SectionConnection.defaultProps = {
  className: '',
};

SectionConnection.propTypes = {
  className: PropTypes.string,
};

export default SectionConnection;
