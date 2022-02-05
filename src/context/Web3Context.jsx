import React, {
  createContext, useReducer, useMemo, useEffect, useContext,
} from 'react';
import PropTypes from 'prop-types';
import ButtPunkSmartContract from '../artifacts/contracts/FantasticFluffz.sol/FantasticFluffz.json';
import config from '../data/app.json';
import { connect, disconnect } from '../service/web3';

const SMART_CONTRACT_ABI = ButtPunkSmartContract.abi;

// STATE
const INITIAL_STATE = {
  web3: null,
  provider: null,
  connected: false,
  address: null,
  chainId: 1,
  networkId: 1,
  contractAddress: '',
  contract: null,
};

// ACTIONS
export const ACTIONS = {
  CONNECTED: 'WEB3_CONNECTED',
  DISCONNECTED: 'WEB3_DISCONNECTED',
  EVENT_ACCOUNTS_CHANGE: 'WEB3_EVENT_ACCOUNTS_CHANGE',
  EVENT_CHAIN_CHANGE: 'WEB3_EVENT_CHAIN_CHANGE',
};
export async function web3Connect() {
  const { web3, provider } = await connect();
  const accounts = await web3.eth.getAccounts();
  const address = accounts && accounts[0];
  const networkId = await web3.eth.net.getId();
  const chainId = await web3.eth.chainId();
  const contractAddress = config.CONTRACT_ADDRESSES[chainId];
  const contract = new web3.eth.Contract(
    SMART_CONTRACT_ABI,
    contractAddress,
  );
  const data = {
    web3,
    provider,
    address,
    chainId,
    networkId,
    contractAddress,
    contract,
  };
  return [ACTIONS.CONNECTED, data];
}
export async function web3Disconnect(web3) {
  await disconnect(web3);
  return [ACTIONS.DISCONNECTED];
}
export function web3HandlerClose() {
  return [ACTIONS.DISCONNECTED];
}
export async function web3HandlerAccountsChange(web3) {
  const accounts = await web3.eth.getAccounts();
  const address = accounts && accounts[0];
  return [ACTIONS.EVENT_ACCOUNTS_CHANGE, { address }];
}
export async function web3HandlerChainChange(web3) {
  const chainId = await web3.eth.chainId();
  const networkId = await web3.eth.net.getId();
  const contractAddress = config.CONTRACT_ADDRESSES[chainId];
  const contract = new web3.eth.Contract(
    SMART_CONTRACT_ABI,
    contractAddress,
  );
  return [ACTIONS.EVENT_CHAIN_CHANGE, {
    chainId,
    networkId,
    contractAddress,
    contract,
  }];
}

// REDUCER
function REDUCER(state, [type, payload]) {
  switch (type) {
    case ACTIONS.CONNECTED:
      return {
        ...state,
        connected: true,
        web3: payload.web3,
        provider: payload.provider,
        address: payload.address,
        chainId: payload.chainId,
        networkId: payload.networkId,
        contractAddress: payload.contractAddress,
        contract: payload.contract,
      };
    case ACTIONS.DISCONNECTED:
      return {
        ...state,
        ...INITIAL_STATE,
        chainId: state.chainId,
      };
    case ACTIONS.EVENT_ACCOUNTS_CHANGE:
      return {
        ...state,
        address: payload.address,
      };
    case ACTIONS.EVENT_CHAIN_CHANGE:
      return {
        ...state,
        chainId: payload.chainId,
        networkId: payload.networkId,
        contractAddress: payload.contractAddress,
        contract: payload.contract,
      };
    default:
      return { ...state };
  }
}

const Web3Context = createContext({
  web3State: INITIAL_STATE,
  web3Dispatch: () => {},
});

export function Web3Provider({
  children,
}) {
  const [web3State, web3Dispatch] = useReducer(REDUCER, INITIAL_STATE);

  // wrap value in memo so we only re-render when necessary
  const providerValue = useMemo(() => ({
    web3State,
    web3Dispatch,
  }), [web3State, web3Dispatch]);

  // web3 events -> update state
  useEffect(() => {
    if (!web3State.provider || !web3State.provider.on || !web3State.web3) {
      return null;
    }
    web3State.provider.on('disconnect', () => web3Dispatch(web3HandlerClose()));
    web3State.provider.on('accountsChanged', async () => web3Dispatch(await web3HandlerAccountsChange(web3State.web3)));
    web3State.provider.on('chainChanged', async () => web3Dispatch(await web3HandlerChainChange(web3State.web3)));

    // unbinds
    return () => {
      // TODO: figure out how to clean up (web3State.provider.off didn't work)
    };
  }, [web3State.provider, web3State.web3, web3Dispatch]);

  return (
    <Web3Context.Provider value={providerValue}>
      {children}
    </Web3Context.Provider>
  );
}
Web3Provider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export function useWeb3Context() {
  return useContext(Web3Context);
}
