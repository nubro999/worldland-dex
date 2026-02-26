/**
 * Deploy Multicall contract to WorldLand
 * Usage: npx hardhat run scripts/deploy-multicall.js --network worldland
 */
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying Multicall with:", deployer.address);
  
  const Multicall = await hre.ethers.getContractFactory("Multicall");
  const multicall = await Multicall.deploy();
  await multicall.waitForDeployment();
  const addr = await multicall.getAddress();
  console.log("✅ Multicall deployed at:", addr);
  
  // Update deployment.json
  const fs = require("fs");
  const deployFile = "deployment.json";
  let info = {};
  if (fs.existsSync(deployFile)) {
    info = JSON.parse(fs.readFileSync(deployFile, "utf8"));
  }
  info.contracts = info.contracts || {};
  info.contracts.Multicall = addr;
  fs.writeFileSync(deployFile, JSON.stringify(info, null, 2));
  console.log("💾 Updated deployment.json");
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
