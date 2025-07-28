require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      accounts: [
        // Add your private key here (without 0x prefix)
        // "YOUR_PRIVATE_KEY_HERE"
      ]
    }
  },
  etherscan: {
    apiKey: {
      bscTestnet: "YOUR_BSCSCAN_API_KEY"
    }
  }
};