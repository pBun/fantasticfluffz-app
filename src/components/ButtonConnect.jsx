import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useWeb3Context, web3Connect } from '../context/Web3Context';

const GENERIC_ERROR = {
  code: -1,
  message: 'Unknown error',
};

function ButtonConnect({ className }) {
  const {
    web3Dispatch,
  } = useWeb3Context();
  const [loadingConnection, setLoadingConnection] = useState(false);
  async function connect() {
    try {
      setLoadingConnection(true);
      web3Dispatch(await web3Connect());
    } catch (err) {
      console.error((err && err.error) || err || GENERIC_ERROR);
      setLoadingConnection(false);
    }
  }
  return (
    <button
      className={
        classnames(
          className,
          'ButtonConnect',
          'Button',
          {
            'Button--loading': loadingConnection,
          },
        )
      }
      disabled={loadingConnection}
      type="button"
      onClick={connect}
    >
      Connect Wallet
    </button>
  );
}

ButtonConnect.defaultProps = {
  className: '',
};

ButtonConnect.propTypes = {
  className: PropTypes.string,
};

export default ButtonConnect;
