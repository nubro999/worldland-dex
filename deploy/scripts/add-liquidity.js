/**
 * WorldLand DEX — Initial Liquidity Provision Script
 *
 * Adds initial liquidity to mock token pairs:
 *   - USDT / USDC
 *   - USDT / WBTC
 *   - USDC / WBTC
 *
 * Usage:
 *   npx hardhat run scripts/add-liquidity.js --network worldland
 */

const hre = require("hardhat");

// ── Deployed contract addresses ─────────────────────────────
const ROUTER_ADDRESS = "0x9381B0004cd1090597a0a5296C1a63Ba879775e4";
const FACTORY_ADDRESS = "0xD4E0861B5A339b703462CcCf12f614929605d169";

// Mock token addresses (from deployment)
const TOKENS = {
  USDT: { address: "0x4046bd9eC8223c2a9354dC517b2D2d67B75CEbfb", decimals: 6 },
  USDC: { address: "0x2477e7fCE92FDA16064E95eD4391a0995210ecbD", decimals: 6 },
  WBTC: { address: "0x25D49C3119f581306f04366A516141368e81A7dC", decimals: 8 },
};

// ── Liquidity amounts ───────────────────────────────────────
// These define how much of each token to seed into each pair
const PAIRS = [
  {
    tokenA: "USDT",
    tokenB: "USDC",
    amountA: "10000",  // 10,000 USDT
    amountB: "10000",  // 10,000 USDC (1:1 stablecoin peg)
  },
  {
    tokenA: "USDT",
    tokenB: "WBTC",
    amountA: "40000", // 40,000 USDT
    amountB: "0.4",    // 0.4 WBTC
  },
  {
    tokenA: "USDC",
    tokenB: "WBTC",
    amountA: "40000", // 40,000 USDC
    amountB: "0.4",    // 0.4 WBTC
  },
];

// Minimal ERC20 ABI for approve and balanceOf
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)",
];

// Minimal Router ABI for addLiquidity
const ROUTER_ABI = [
  "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)",
  "function factory() external view returns (address)",
];

// Minimal Factory ABI
const FACTORY_ABI = [
  "function getPair(address tokenA, address tokenB) external view returns (address pair)",
];

function parseAmount(amount, decimals) {
  return hre.ethers.parseUnits(amount, decimals);
}

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("=".repeat(60));
  console.log("WorldLand DEX — Initial Liquidity Provision");
  console.log("=".repeat(60));
  console.log(`Deployer : ${deployer.address}`);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`WLC Balance : ${hre.ethers.formatEther(balance)} WLC`);
  console.log("-".repeat(60));

  const router = new hre.ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, deployer);
  const factory = new hre.ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, deployer);

  // Verify router's factory matches
  const routerFactory = await router.factory();
  console.log(`Router factory: ${routerFactory}`);
  console.log(`Expected:       ${FACTORY_ADDRESS}`);
  if (routerFactory.toLowerCase() !== FACTORY_ADDRESS.toLowerCase()) {
    console.error("ERROR: Router factory mismatch!");
    process.exit(1);
  }

  // Check token balances first
  console.log("\n📊 Token Balances:");
  for (const [symbol, info] of Object.entries(TOKENS)) {
    const token = new hre.ethers.Contract(info.address, ERC20_ABI, deployer);
    const bal = await token.balanceOf(deployer.address);
    console.log(`  ${symbol}: ${hre.ethers.formatUnits(bal, info.decimals)}`);
  }

  // Add liquidity for each pair
  for (let i = 0; i < PAIRS.length; i++) {
    const pair = PAIRS[i];
    const tokenAInfo = TOKENS[pair.tokenA];
    const tokenBInfo = TOKENS[pair.tokenB];

    console.log(`\n${"─".repeat(60)}`);
    console.log(`[${i + 1}/${PAIRS.length}] Adding liquidity: ${pair.amountA} ${pair.tokenA} + ${pair.amountB} ${pair.tokenB}`);

    const amountA = parseAmount(pair.amountA, tokenAInfo.decimals);
    const amountB = parseAmount(pair.amountB, tokenBInfo.decimals);

    const tokenA = new hre.ethers.Contract(tokenAInfo.address, ERC20_ABI, deployer);
    const tokenB = new hre.ethers.Contract(tokenBInfo.address, ERC20_ABI, deployer);

    // Check balances
    const balA = await tokenA.balanceOf(deployer.address);
    const balB = await tokenB.balanceOf(deployer.address);
    console.log(`  Balance ${pair.tokenA}: ${hre.ethers.formatUnits(balA, tokenAInfo.decimals)}`);
    console.log(`  Balance ${pair.tokenB}: ${hre.ethers.formatUnits(balB, tokenBInfo.decimals)}`);

    if (balA < amountA) {
      console.log(`  ⚠️  Insufficient ${pair.tokenA} balance. Skipping...`);
      continue;
    }
    if (balB < amountB) {
      console.log(`  ⚠️  Insufficient ${pair.tokenB} balance. Skipping...`);
      continue;
    }

    // Step 1: Approve Router for both tokens
    console.log(`  Approving ${pair.tokenA}...`);
    const txApproveA = await tokenA.approve(ROUTER_ADDRESS, amountA);
    await txApproveA.wait();
    console.log(`  ✅ ${pair.tokenA} approved`);

    console.log(`  Approving ${pair.tokenB}...`);
    const txApproveB = await tokenB.approve(ROUTER_ADDRESS, amountB);
    await txApproveB.wait();
    console.log(`  ✅ ${pair.tokenB} approved`);

    // Step 2: Add Liquidity
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes

    console.log(`  Adding liquidity...`);
    const tx = await router.addLiquidity(
      tokenAInfo.address,
      tokenBInfo.address,
      amountA,
      amountB,
      0, // amountAMin (accept any amount for initial liquidity)
      0, // amountBMin
      deployer.address, // LP tokens go to deployer
      deadline,
      { gasLimit: 5000000 }
    );

    const receipt = await tx.wait();
    console.log(`  ✅ Liquidity added! TX: ${receipt.hash}`);

    // Verify pair was created
    const pairAddress = await factory.getPair(tokenAInfo.address, tokenBInfo.address);
    console.log(`  📍 Pair address: ${pairAddress}`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎉 LIQUIDITY PROVISION COMPLETE");
  console.log("=".repeat(60));

  // Final summary: show all pairs
  console.log("\n📋 Pair Summary:");
  for (const pair of PAIRS) {
    const pairAddress = await factory.getPair(
      TOKENS[pair.tokenA].address,
      TOKENS[pair.tokenB].address
    );
    console.log(`  ${pair.tokenA}/${pair.tokenB}: ${pairAddress}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
