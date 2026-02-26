/**
 * WorldLand DEX — Uniswap V2 One-Click Deploy Script
 *
 * Deploys in order:
 *   1. WETH9 (Wrapped WL)
 *   2. UniswapV2Factory (v2-core)
 *   3. UniswapV2Router02 (v2-periphery)
 *
 * After deployment, prints the INIT_CODE_HASH that must be patched
 * into the frontend SDK so pair-address computation works.
 *
 * Usage:
 *   npx hardhat run scripts/deploy-all.js --network worldland
 */

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("=".repeat(60));
  console.log("WorldLand DEX — Uniswap V2 Deployer");
  console.log("=".repeat(60));
  console.log(`Deployer : ${deployer.address}`);
  console.log(`Network  : ${hre.network.name} (chainId ${hre.network.config.chainId})`);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Balance  : ${hre.ethers.formatEther(balance)} WL`);
  console.log("-".repeat(60));

  // ──────────────────────────────────────────────────────────
  // 1. Deploy WETH9
  // ──────────────────────────────────────────────────────────
  console.log("\n[1/3] Deploying WETH9 (Wrapped WL)...");
  const WETH9 = await hre.ethers.getContractFactory("contracts/WETH9.sol:WETH9");
  const weth = await WETH9.deploy();
  await weth.waitForDeployment();
  const wethAddr = await weth.getAddress();
  console.log(`  ✅ WETH9 deployed at: ${wethAddr}`);

  // ──────────────────────────────────────────────────────────
  // 2. Deploy UniswapV2Factory
  // ──────────────────────────────────────────────────────────
  console.log("\n[2/3] Deploying UniswapV2Factory...");
  const Factory = await hre.ethers.getContractFactory(
    "contracts/v2-core/UniswapV2Factory.sol:UniswapV2Factory"
  );
  const factory = await Factory.deploy(deployer.address); // feeToSetter = deployer
  await factory.waitForDeployment();
  const factoryAddr = await factory.getAddress();
  console.log(`  ✅ Factory deployed at: ${factoryAddr}`);

  // Compute INIT_CODE_HASH from UniswapV2Pair artifact (creationCode)
  const pairArtifact = await hre.artifacts.readArtifact(
    "contracts/v2-core/UniswapV2Pair.sol:UniswapV2Pair"
  );
  const initCodeHash = hre.ethers.keccak256(pairArtifact.bytecode);
  console.log(`  📝 INIT_CODE_HASH: ${initCodeHash}`);

  // ──────────────────────────────────────────────────────────
  // 3. Deploy UniswapV2Router02
  // ──────────────────────────────────────────────────────────
  console.log("\n[3/3] Deploying UniswapV2Router02...");
  const Router = await hre.ethers.getContractFactory(
    "contracts/v2-periphery/UniswapV2Router02.sol:UniswapV2Router02"
  );
  const router = await Router.deploy(factoryAddr, wethAddr);
  await router.waitForDeployment();
  const routerAddr = await router.getAddress();
  console.log(`  ✅ Router02 deployed at: ${routerAddr}`);

  // ──────────────────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────────────────
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE — WorldLand DEX (Uniswap V2)");
  console.log("=".repeat(60));
  console.log(`CHAIN_ID         : 103`);
  console.log(`RPC_URL          : https://seoul.worldland.foundation/`);
  console.log(`WETH (WWL)       : ${wethAddr}`);
  console.log(`FACTORY          : ${factoryAddr}`);
  console.log(`ROUTER02         : ${routerAddr}`);
  console.log(`INIT_CODE_HASH   : ${initCodeHash}`);
  console.log("=".repeat(60));
  console.log("\n📋 Next steps:");
  console.log("  1. Copy the addresses above into your .env / frontend config");
  console.log("  2. Patch INIT_CODE_HASH in @uniswap/sdk (or the local fork)");
  console.log("  3. Run the frontend: cd ../interface && yarn install && yarn start");

  // Save deployment info to JSON for easy reference
  const fs = require("fs");
  const deployInfo = {
    chainId: 103,
    rpcUrl: "https://seoul.worldland.foundation/",
    deployer: deployer.address,
    contracts: {
      WETH9: wethAddr,
      UniswapV2Factory: factoryAddr,
      UniswapV2Router02: routerAddr,
    },
    initCodeHash: initCodeHash,
    deployedAt: new Date().toISOString(),
  };
  fs.writeFileSync(
    "deployment.json",
    JSON.stringify(deployInfo, null, 2)
  );
  console.log("\n💾 Deployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
