const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');


let Factory = require(`../../v2-core/deployments/${network.name}/UniswapV2Factory.json`)
let FactoryABI = require(`../../v2-core/deployments/abi/UniswapV2Factory.json`)


let factoryAddr = Factory.address;
console.log("factoryAddr: ", factoryAddr);

let Router = require(`../deployments/${network.name}/Router.json`)
let routerAddr = Router.address;

console.log("Router address: ", routerAddr);

async function main() {
  let [owner]  = await ethers.getSigners();

  const MyERC20 = await hre.ethers.getContractFactory("ERC20");
  let amount = ethers.utils.parseUnits("10000000", 18);
  const atoken = await MyERC20.deploy(amount);
  await atoken.deployed();

  console.log("atoken:", atoken.address);

  const btoken = await MyERC20.deploy(amount);
  await btoken.deployed();
  console.log("btoken:", btoken.address);

  let UniswapRouter = await ethers.getContractFactory("UniswapV2Router02");
  let router = await UniswapRouter.attach(routerAddr);

  let liqAmount = ethers.utils.parseUnits("1000000", 18);

  await atoken.approve(router.address, liqAmount);
  await btoken.approve(router.address, liqAmount);
  let tx = await router.addLiquidity(atoken.address, btoken.address, liqAmount, liqAmount,
      0, 0,
      owner.address, 16700718270);
  await tx.wait();


  let factory = new ethers.Contract(factoryAddr, 
    FactoryABI, owner);

  const pair = await factory.getPair(atoken.address, btoken.address);
  console.log("pair address: ", pair);

  let swapAmount = ethers.utils.parseUnits("1000", 18);

  let a1 = await atoken.balanceOf(owner.address);
  console.log("atoken balanceOf before: " +  ethers.utils.formatUnits(a1, 18))

  let b1 = await btoken.balanceOf(owner.address);
  console.log("btoken balanceOf before: " +  ethers.utils.formatUnits(b1, 18))

  await atoken.approve(router.address, swapAmount);
  await router.swapExactTokensForTokens(
    swapAmount, "0", 
    [atoken.address, btoken.address], owner.address, 16700718270);

  let a2 =  await atoken.balanceOf(owner.address);
  console.log("atoken balanceOf after: " +  ethers.utils.formatUnits(a2, 18))

  let b2 = await btoken.balanceOf(owner.address);
  console.log("btoken balanceOf after: " +  ethers.utils.formatUnits(b2, 18))

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
