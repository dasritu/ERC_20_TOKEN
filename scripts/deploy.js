const hre = require('hardhat');

async function main(){
    const [deployer] = await hre.ethers.getSigners();
    console.log("Contract Deployed with the account",deployer.address);
    const contract = await hre.ethers.getContractFactory('MyToken',deployer);
    const amount = hre.ethers.parseUnits("1000",18);
    const token = await contract.deploy(amount);
    await token.waitForDeployment();

    console.log("Contract Deployed At",await token.getAddress());
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });