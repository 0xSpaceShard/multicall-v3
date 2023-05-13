import { BigNumber } from "ethers";
import { ethers } from "hardhat";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  while (true) {
    console.log("Start")
    const gasPrice = await ethers.provider.getGasPrice()
    if (gasPrice.lte(BigNumber.from("40000000000"))){
      console.log(`Start deployed`);
      
      const multicallFactory = await ethers.getContractFactory("Multicall");
      const multicall = await multicallFactory.deploy();
      
      await multicall.deployed();
    
      console.log(`Multicall deployed to ${multicall.address}`);
      return
    } else {
      console.log("Price too high", gasPrice.div(1000000000).toString())
    }
    await sleep(30000)
  }
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
