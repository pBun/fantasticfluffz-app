import Web3Modal from 'web3modal';
import WalletConnect from '@walletconnect/web3-provider';
import Web3 from 'web3';

import config from '../data/app.json';

export const WEB3_MODAL = new Web3Modal({
  // cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId: config.INFURA_ID,
      },
    },
  },
});

export async function connect() {
  const provider = await WEB3_MODAL.connect();
  await provider.enable();
  const web3 = new Web3(provider);
  web3.eth.extend({
    methods: [
      {
        name: 'chainId',
        call: 'eth_chainId',
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });

  return {
    web3,
    provider,
  };
}

export async function clearModalCache() {
  await WEB3_MODAL.clearCachedProvider();
}

export async function disconnect(web3) {
  if (web3 && web3.currentProvider && web3.currentProvider.disconnect) {
    await web3.currentProvider.disconnect();
  }
  await clearModalCache();
}
