const appConfig = require('../src/data/app.json');
const rootCids = require('../src/data/cids/root.json');

async function main() {
  // eslint-disable-next-line no-undef
  const ContractFactory = await ethers.getContractFactory(appConfig.TOKEN_NAME.replace(' ', ''));

  // Start deployment, returning a promise that resolves to a contract object
  const contractObj = await ContractFactory.deploy(
    `${appConfig.BASE_URI}/${rootCids.meta}/`, // base uri
  );
  await contractObj.deployed();
  console.log('Contract deployed to address:', contractObj.address);
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
