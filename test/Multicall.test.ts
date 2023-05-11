import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import ERC20_ARTIFACT from "../artifacts/contracts/tests/ERC20.sol/ERC20Mock.json";
import {
  ERC20Mock,
  ERC20Mock__factory,
  Multicall,
  Multicall__factory,
} from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

describe("Multicall V3", function () {
  let multicall: Multicall;
  let erc20Mock: ERC20Mock;
  let users: Array<SignerWithAddress>;

  beforeEach(async function () {
    users = await ethers.getSigners();

    const erc20Factory = (await ethers.getContractFactory(
      "ERC20Mock"
    )) as ERC20Mock__factory;
    erc20Mock = (await erc20Factory.deploy()) as ERC20Mock;

    const multicallFactory = (await ethers.getContractFactory(
      "Multicall"
    )) as Multicall__factory;
    multicall = (await multicallFactory.deploy()) as Multicall;
  });

  describe("Tests multicall", function () {
    it("Should execute transactions through multicall", async function () {
      const multicallRequests = [];
      const len = 5;
      const amount = ethers.utils.parseEther("10");
      for (let i = 0; i < len; i++) {
        const user1 = users[i];

        await erc20Mock.mint(user1.address, amount);
        let iface = new ethers.utils.Interface(ERC20_ARTIFACT.abi);
        const callData = iface.encodeFunctionData("balanceOf", [user1.address]);

        multicallRequests.push({
          target: erc20Mock.address,
          callData,
          gas: 100000,
        });
      }
      const res = await multicall.callStatic.tryAggregate(
        true,
        multicallRequests
      );
      expect(res.length).eq(len);
      for (let i = 0; i < len; i++) {
        const data = res[i].returnData;
        expect(BigNumber.from(data)).eq(amount);
      }
    });

    it("Should 1 transaction fail because not enough gas attached", async function () {
      const multicallRequests = [];
      const len = 5;
      const amount = ethers.utils.parseEther("10");
      for (let i = 0; i < len; i++) {
        const user1 = users[i];

        await erc20Mock.mint(user1.address, amount);
        let iface = new ethers.utils.Interface(ERC20_ARTIFACT.abi);
        const callData = iface.encodeFunctionData("balanceOf", [user1.address]);

        multicallRequests.push({
          target: erc20Mock.address,
          callData,
          gas: i == 0 ? 1000 : 100000,
        });
      }
      const res = await multicall.callStatic.tryAggregate(
        false,
        multicallRequests
      );

      expect(res.length).eq(len);

      for (let i = 0; i < len; i++) {
        const { success, returnData } = res[i];
        if (i == 0) {
          expect(success).false;
        } else {
          expect(success).true;
          expect(BigNumber.from(returnData)).eq(amount);
        }
      }
    });

    it("Should all transactions fail because not enough gas attached", async function () {
      const multicallRequests = [];
      const len = 5;
      const amount = ethers.utils.parseEther("10");
      for (let i = 0; i < len; i++) {
        const user1 = users[i];

        await erc20Mock.mint(user1.address, amount);
        let iface = new ethers.utils.Interface(ERC20_ARTIFACT.abi);
        const callData = iface.encodeFunctionData("balanceOf", [user1.address]);

        multicallRequests.push({
          target: erc20Mock.address,
          callData,
          gas: 1000,
        });
      }
      const res = await multicall.callStatic.tryAggregate(
        false,
        multicallRequests
      );

      expect(res.length).eq(len);

      for (let i = 0; i < len; i++) {
        const { success, returnData } = res[i];
        expect(success).false;
        expect(returnData).eq("0x");
      }
    });
  });
});
