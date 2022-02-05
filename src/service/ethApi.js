const BASE_URL = 'https://ethereum-api.xyz';

export async function apiGetAccountAssets(address, chainId) {
  const response = await fetch(`${BASE_URL}/account-assets?address=${address}&chainId=${chainId}`);
  const data = await response.json();
  return data.result;
}

export async function apiGetAccountTransactions(address, chainId) {
  const response = await fetch(`${BASE_URL}/account-transactions?address=${address}&chainId=${chainId}`);
  const data = await response.json();
  return data.result;
}

export const apiGetAccountNonce = async (address, chainId) => {
  const response = await fetch(`${BASE_URL}/account-nonce?address=${address}&chainId=${chainId}`);
  const data = await response.json();
  return data.result;
};

export const apiGetGasPrices = async () => {
  const response = await fetch(`${BASE_URL}/gas-prices`);
  const data = await response.json();
  return data.result;
};
