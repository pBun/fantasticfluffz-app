import './PageInfo.css';
import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { useWeb3Context } from '../context/Web3Context';
import ButtonConnect from './ButtonConnect';
// import { apiGetAccountAssets } from '../service/ethApi';
import AnchorAddress from './AnchorAddress';
import AnchorWalletAddress from './AnchorWalletAddress';

const GENERIC_ERROR = {
  code: -1,
  message: 'Unknown error',
};

function PageInfo() {
  const { web3State } = useWeb3Context();
  const [saleStatus, setSaleStatus] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState(null);
  const [releaseRatio, setReleaseRatio] = useState(0);
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [balanceAvailable, setBalanceAvailable] = useState(0);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const isOwner = web3State.connected && web3State.address === ownerAddress;

  useEffect(() => {
    if (!web3State.contractAddress) {
      setSaleStatus(false);
      setOwnerAddress(null);
      return;
    }
    (async () => {
      try {
        const newSaleStatus = await web3State.contract.methods.saleStatus().call();
        const newOwnerAddress = await web3State.contract.methods.owner().call();
        const totalShares = await web3State.contract.methods.totalShares().call();
        const shares = await web3State.contract.methods.shares(web3State.address).call();
        const totalReleased = parseInt(
          await web3State.contract.methods.totalReleased().call(),
          10,
        );
        const released = await web3State
          .contract.methods.released(web3State.address).call();
        const balance = parseInt(
          await web3State.web3.eth.getBalance(web3State.contractAddress),
          10,
        );
        const myReleaseRatio = shares / totalShares;
        const totalBalance = balance + totalReleased;
        const myTotalBalance = totalBalance * myReleaseRatio;
        const myBalance = myTotalBalance - released;
        setTotalRevenue(totalBalance);
        setBalanceAvailable(myBalance);
        setSaleStatus(newSaleStatus);
        setOwnerAddress(newOwnerAddress);
        setReleaseRatio(myReleaseRatio);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [web3State]);

  // request access to the user's MetaMask account

  async function startSale() {
    try {
      setError(null);
      setSuccess(null);
      setLoadingStatus(true);
      await web3State.contract.methods.setSaleStatus(true).send({
        from: web3State.address,
      });
      setSaleStatus(true);
      setSuccess('Sale started!');
      setLoadingStatus(false);
    } catch (err) {
      setError((err && err.error) || err || GENERIC_ERROR);
      setLoadingStatus(false);
    }
  }

  async function pauseSale() {
    try {
      setError(null);
      setSuccess(null);
      setLoadingStatus(true);
      await web3State.contract.methods.setSaleStatus(false).send({
        from: web3State.address,
      });
      setSaleStatus(false);
      setSuccess('Sale paused!');
      setLoadingStatus(false);
    } catch (err) {
      setError((err && err.error) || err || GENERIC_ERROR);
      setLoadingStatus(false);
    }
  }

  async function withdraw() {
    try {
      setError(null);
      setSuccess(null);
      setLoadingWithdraw(true);
      const res = await web3State.contract.methods.release(web3State.address).send({
        from: web3State.address,
      });
      setSuccess('Withdraw successful!', res);
      setLoadingWithdraw(false);
      setBalanceAvailable(0);
    } catch (err) {
      setError((err && err.error) || err || GENERIC_ERROR);
      setLoadingWithdraw(false);
    }
  }
  return (
    <div className="PageInfo RainbowBG">
      <div className="PageInfo-inner">
        <div className="PageInfo-section">
          <h2 className="PageInfo-sectionHeadline">wallet: </h2>
          {web3State.connected ? (
            <span className="SectionConnection-address">
              <AnchorWalletAddress />
            </span>
          ) : (
            <ButtonConnect />
          )}
        </div>
        <div className="PageInfo-section">
          <h2 className="PageInfo-sectionHeadline">contract: </h2>
          {web3State.contractAddress ? (
            <AnchorAddress
              chainId={web3State.chainId}
              address={web3State.contractAddress}
            />
          ) : (
            <span>[smart contract has not been deployed on this chain]</span>
          )}
        </div>
        <div className="PageInfo-section">
          <h2 className="PageInfo-sectionHeadline">contract owner: </h2>
          {ownerAddress ? (
            <AnchorAddress chainId={web3State.chainId} address={ownerAddress} />
          ) : (
            <span>[cannot retrieve contract owner]</span>
          )}
        </div>
        <div className="PageInfo-section">
          <h2 className="PageInfo-sectionHeadline">total revenue: </h2>
          <p>
            {totalRevenue / 1000000000000000000}
            Ξ
          </p>
        </div>
        {releaseRatio <= 0 ? '' : (
          <div className="PageInfo-section">
            <h2 className="PageInfo-sectionHeadline">
              my total revenue (
              {releaseRatio * 100}
              %):
              {' '}
            </h2>
            <p>
              {(totalRevenue / 1000000000000000000) * releaseRatio}
              Ξ
            </p>
          </div>
        )}
        {balanceAvailable <= 0 ? '' : (
          <div className="PageInfo-section">
            <h2 className="PageInfo-sectionHeadline">
              my available revenue
            </h2>
            <p>
              {balanceAvailable / 1000000000000000000}
              Ξ
            </p>
            <br />
            <button
              className={
              classnames(
                'Button',
                {
                  'Button--disabled': !web3State.connected,
                  'Button--loading': loadingWithdraw,
                },
              )
            }
              type="button"
              disabled={loadingWithdraw || !web3State.connected}
              onClick={withdraw}
            >
              Withdraw
            </button>
          </div>
        )}
        {!isOwner ? '' : (
          <div className="PageInfo-section">
            <h2 className="PageInfo-sectionHeadline">status: </h2>
            <p>
              {(() => {
                if (!web3State.contractAddress) {
                  return 'n/a';
                } if (!saleStatus) {
                  return 'paused';
                }
                return 'active';
              })()}
            </p>
            <br />
            {saleStatus ? (
              <button
                className={
                  classnames(
                    'Button',
                    {
                      'Button--disabled': !web3State.connected,
                      'Button--loading': loadingStatus,
                    },
                  )
                }
                type="button"
                disabled={!web3State.connected || loadingStatus}
                onClick={pauseSale}
              >
                Pause Sale
              </button>
            ) : (
              <button
                className={
                  classnames(
                    'Button',
                    {
                      'Button--disabled': !web3State.connected,
                      'Button--loading': loadingStatus,
                    },
                  )
                }
                type="button"
                disabled={!web3State.connected || loadingStatus}
                onClick={startSale}
              >
                Start Sale
              </button>
            )}
          </div>
        )}
        {error || success ? (
          <div className="PageInfo-section">
            {error ? (
              <p style={{ fontSize: '12px', color: 'red' }}>
                {`Error${
                  error.code ? ` ${error.code}` : ''
                }: ${error.message || error}`}

              </p>
            ) : (
              ''
            )}
            {success ? (
              <p style={{ fontSize: '12px', color: 'green' }}>{success}</p>
            ) : (
              ''
            )}
          </div>
        ) : ''}
      </div>
    </div>
  );
}

export default PageInfo;
