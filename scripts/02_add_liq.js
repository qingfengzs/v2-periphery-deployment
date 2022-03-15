const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

async function main() {
  // await hre.run('compile');

  const MyERC20 = await hre.ethers.getContractFactory("ERC20");
  let amount = ethers.utils.parseUnits("100000", 18);
  const atoken = await MyERC20.deploy(amount);
  await atoken.deployed();

  console.log("atoken:", atoken.address);

  const btoken = await MyERC20.deploy(amount);
  await btoken.deployed();


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
