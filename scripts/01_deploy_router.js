const { ethers, network } = require("hardhat");

const { writeAddr } = require('./artifact_log.js');

const ERC20Addr = require(`../deployments/${network.name}/MyERC20.json`)

let Factory = require(`../../v2-core/deployments/${network.name}/Factory.json`)
let facotryAddr = Factory.address;

async function main() {
  let [owner]  = await ethers.getSigners();
  
  WETH = await ethers.getContractFactory("WETH9");
  weth = await WETH.deploy();
  await weth.deployed();

  Router = await ethers.getContractFactory("UniswapV2Router02");
  router = await Router.deploy(facotryAddr, weth.address);
  await router.deployed();

  await writeAddr(weth.address, "WETH", network.name);
  await writeAddr(router.address, "Router", network.name);

  console.log("facotryAddr: ", facotryAddr);
  console.log("weth.address: ", weth.address);
  console.log("router.address: ", router.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

