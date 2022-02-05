/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require('@nomiclabs/hardhat-ethers');

const { ROPSTEN_API_URL, RINKEBY_API_URL, MAIN_PRIVATE_KEY } = process.env;
module.exports = {
  solidity: {
    version: '0.8.11',
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ropsten: {
      url: ROPSTEN_API_URL,
      accounts: [`0x${MAIN_PRIVATE_KEY}`],
    },
    rinkeby: {
      url: RINKEBY_API_URL,
      accounts: [`0x${MAIN_PRIVATE_KEY}`],
    },
  },
};
