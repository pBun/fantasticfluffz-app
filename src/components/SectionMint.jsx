import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import supportedChains from '../data/supportedChains';
import { weiToEth } from '../util/eth';
import { useWeb3Context } from '../context/Web3Context';
import AnchorAddress from './AnchorAddress';
import ButtonConnect from './ButtonConnect';
import AnchorWalletAddress from './AnchorWalletAddress';

import './SectionMint.css';

const GENERIC_ERROR = {
  code: -1,
  message: 'Unknown error',
};

function SectionMint() {
  const { web3State } = useWeb3Context();
  const [numTokens, setNumTokens] = useState(1);
  const [saleDetails, setSaleDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  useEffect(() => {
    setError(null);
    if (!web3State.connected) {
      return;
    }
    const isProd = false && process.env.NODE_ENV !== 'development'; // TODO: UPDATE WHEN WE GO LIVE FOR REAL
    const isWrongChain = (isProd && web3State.chainId !== 1)
      || (!isProd && !web3State.contractAddress);
    const targetChain = isProd
      ? supportedChains.find((chain) => chain.network === 'mainnet')
      : supportedChains.find((chain) => chain.network === 'rinkeby');
    if (isWrongChain) {
      setError(`Your wallet is currently connected to the wrong chain. Please connect to ${targetChain.name} to mint tokens.`);
      return;
    }
    setError(null);

    (async () => {
      try {
        const status = await web3State.contract.methods.saleStatus().call();
        const currentCount = await web3State.contract.methods.totalSupply().call();
        const maxCount = await web3State.contract.methods.MAX_SUPPLY().call();
        const maxPurchase = await web3State.contract.methods.MAX_PURCHASE().call();
        const price = await web3State.contract.methods.TOKEN_PRICE().call();
        setSaleDetails({
          status,
          currentCount,
          maxCount,
          maxPurchase,
          price,
        });
      } catch (err) {
        console.error(err);
      }
    })();
  }, [
    web3State.connected,
    web3State.chainId,
    web3State.contract,
    web3State.contractAddress,
  ]);

  // request access to the user's MetaMask account

  const mintToken = useCallback(async () => {
    if (!numTokens) return;
    try {
      setError(null);
      setSuccess(null);
      setLoading(true);
      await web3State.contract.methods.mintToken(numTokens).send({
        from: web3State.address,
        value: saleDetails.price * numTokens,
      });
      setSuccess('Token(s) minted successfully!');
      setLoading(false);
    } catch (err) {
      setError((err && err.error) || err || GENERIC_ERROR);
      setLoading(false);
    }
  }, [numTokens, web3State, saleDetails.price]);

  return (
    <div className={classnames('SectionMint', { 'SectionMint--connected': web3State.connected })}>
      {web3State.contractAddress ? (
        <>
          <div className="SectionMint-section SectionMint-section--wallet">
            <span className="SectionMint-sectionHeadline">
              wallet:
            </span>
            <AnchorWalletAddress />
          </div>
          <div className="SectionMint-section SectionMint-section--contract">
            <span className="SectionMint-sectionHeadline">smart contract: </span>
            <AnchorAddress
              className="SectionMint-value"
              chainId={web3State.chainId}
              address={web3State.contractAddress}
            />
          </div>
          {saleDetails.currentCount / saleDetails.maxCount < 0.5 ? '' : (
            <div className="SectionMint-section SectionMint-section--count">
              <span className="SectionMint-sectionHeadline">
                inventory:
              </span>
              <p>
                {`${saleDetails.currentCount} / ${saleDetails.maxCount}`}
              </p>
            </div>
          )}
          <div className="SectionMint-section SectionMint-section--qty">
            <label className="SectionMint-inputLabel" htmlFor="token-quantity">
              <span className="SectionMint-sectionHeadline">
                qty of tokens:
              </span>
              <div className="SectionMint-inputNoteWrapper">
                <input
                  id="token-quantity"
                  className="SectionMint-input SectionMint-value"
                  onChange={(e) => setNumTokens(parseInt(e.target.value, 10))}
                  type="number"
                  min="1"
                  max={saleDetails.maxPurchase}
                  required
                  value={numTokens}
                />
                <span className="SectionMint-inputNote">
                  {weiToEth(saleDetails.price)}
                  Ξ
                </span>
              </div>
            </label>
          </div>
          <div className="SectionMint-section SectionMint-section--confirm">
            <button
              className={
                classnames(
                  'SectionMint-confirm',
                  'Button',
                  {
                    'Button--disabled': !saleDetails.status || !web3State.connected,
                    'Button--loading': loading,
                  },
                )
              }
              type="button"
              disabled={loading || !saleDetails.status || !web3State.connected}
              onClick={mintToken}
            >
              Confirm
            </button>
          </div>
        </>
      ) : (
        <div className="SectionMint-section SectionMint-section--connect">
          <p className="SectionMint-headline">Connect to the Ethereum network to mint tokens.</p>
          {!web3State.connected ? (
            <ButtonConnect className="SectionMint-connect" />
          ) : (
            <AnchorWalletAddress />
          )}
        </div>
      )}
      {error || success ? (
        <div className="SectionMint-section SectionMint-section--messages">
          {error ? (
            <p className="SectionMint-message SectionMint-message--error">
              {`Error${
                error.code ? ` ${error.code}` : ''
              }: ${error.message || error}`}

            </p>
          ) : (
            ''
          )}
          {success ? (
            <p className="SectionMint-message SectionMint-message--success">{success}</p>
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default SectionMint;
