import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    mainnet: {
      accounts: [process.env.PRIVATE_KEY || ""],
      url: process.env.RPC_URL,
    },
    goerli: {
      accounts: [process.env.PRIVATE_KEY || ""],
      url: process.env.RPC_URL,
    },
    sepolia: {
      accounts: [process.env.PRIVATE_KEY || ""],
      url: process.env.RPC_URL,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
