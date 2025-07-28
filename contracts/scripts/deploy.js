const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying TxRate contracts to BSC Testnet...");

  // Deploy TxRate Token
  const TxRateToken = await ethers.getContractFactory("TxRateToken");
  const txrToken = await TxRateToken.deploy();
  await txrToken.deployed();
  console.log("TxRateToken deployed to:", txrToken.address);

  // Deploy Mock Tokens for testing
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const mockUSDT = await MockUSDT.deploy();
  await mockUSDT.deployed();
  console.log("MockUSDT deployed to:", mockUSDT.address);

  const MockBTCB = await ethers.getContractFactory("MockBTCB");
  const mockBTCB = await MockBTCB.deploy();
  await mockBTCB.deployed();
  console.log("MockBTCB deployed to:", mockBTCB.address);

  const MockETH = await ethers.getContractFactory("MockETH");
  const mockETH = await MockETH.deploy();
  await mockETH.deployed();
  console.log("MockETH deployed to:", mockETH.address);

  // Deploy Lending Contract
  const TxRateLending = await ethers.getContractFactory("TxRateLending");
  const lending = await TxRateLending.deploy(txrToken.address);
  await lending.deployed();
  console.log("TxRateLending deployed to:", lending.address);

  // Setup pools
  console.log("Setting up lending pools...");
  
  // Add BNB pool (using WBNB address for BSC Testnet)
  await lending.addPool(
    "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd", // WBNB testnet
    850,  // 8.5% supply APY
    1020, // 10.2% borrow APY
    7500  // 75% collateral factor
  );

  // Add USDT pool
  await lending.addPool(
    mockUSDT.address,
    1230, // 12.3% supply APY
    1550, // 15.5% borrow APY
    8000  // 80% collateral factor
  );

  // Add BTCB pool
  await lending.addPool(
    mockBTCB.address,
    680,  // 6.8% supply APY
    890,  // 8.9% borrow APY
    7000  // 70% collateral factor
  );

  // Add ETH pool
  await lending.addPool(
    mockETH.address,
    720,  // 7.2% supply APY
    950,  // 9.5% borrow APY
    7500  // 75% collateral factor
  );

  console.log("Deployment completed!");
  console.log("\nContract Addresses:");
  console.log("===================");
  console.log("TxRateToken:", txrToken.address);
  console.log("TxRateLending:", lending.address);
  console.log("MockUSDT:", mockUSDT.address);
  console.log("MockBTCB:", mockBTCB.address);
  console.log("MockETH:", mockETH.address);
  console.log("WBNB (Testnet):", "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd");

  // Save addresses to file
  const fs = require('fs');
  const addresses = {
    txrToken: txrToken.address,
    lending: lending.address,
    mockUSDT: mockUSDT.address,
    mockBTCB: mockBTCB.address,
    mockETH: mockETH.address,
    wbnb: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"
  };
  
  fs.writeFileSync('../src/contracts/addresses.json', JSON.stringify(addresses, null, 2));
  console.log("\nContract addresses saved to src/contracts/addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });