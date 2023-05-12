import { ethers } from "hardhat";

async function main() {
  const multicallFactory = await ethers.getContractFactory("Multicall");
  const multicall = await multicallFactory.deploy();

  await multicall.deployed();

  console.log(`Multicall deployed to ${multicall.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
