require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.16", // UniswapV2 core (Factory, Pair)
        settings: {
          optimizer: { enabled: true, runs: 999999 },
        },
      },
      {
        version: "0.6.6", // UniswapV2 periphery (Router02)
        settings: {
          optimizer: { enabled: true, runs: 999999 },
        },
      },
      {
        version: "0.4.26", // WETH9
        settings: {
          optimizer: { enabled: true, runs: 999999 },
        },
      },
    ],
  },
  networks: {
    worldland: {
      url: process.env.RPC_URL || "https://seoul.worldland.foundation/",
      chainId: 103,
      accounts: process.env.DEPLOYER_PRIVATE_KEY
        ? [process.env.DEPLOYER_PRIVATE_KEY]
        : [],
      // Adjust gas settings as needed for WorldLand chain
      // gasPrice: 80000000000, // Uncomment and set if needed
    },
  },
  paths: {
    sources: "./contracts",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
