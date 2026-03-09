const hre = require("hardhat");

const ROUTER_ADDR = "0x9381B0004cd1090597a0a5296C1a63Ba879775e4";
const USDT_ADDR = "0x4046bd9eC8223c2a9354dC517b2D2d67B75CEbfb";
const USDC_ADDR = "0x2477e7fCE92FDA16064E95eD4391a0995210ecbD";
const WBTC_ADDR = "0x25D49C3119f581306f04366A516141368e81A7dC";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const tokenABI = [
    "function mint(address to, uint256 value) external",
    "function approve(address spender, uint256 value) external returns (bool)"
  ];
  const routerABI = [
    "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)"
  ];

  const usdt = new hre.ethers.Contract(USDT_ADDR, tokenABI, deployer);
  const usdc = new hre.ethers.Contract(USDC_ADDR, tokenABI, deployer);
  const wbtc = new hre.ethers.Contract(WBTC_ADDR, tokenABI, deployer);
  const router = new hre.ethers.Contract(ROUTER_ADDR, routerABI, deployer);
  const deadline = Math.floor(Date.now() / 1000) + 3600;

  // Mint massive amounts
  // Need: 1000 WBTC (for USDT pair) + 1000 WBTC (for USDC pair) = 2000 WBTC
  // Need: 85,000,000 USDT (for WBTC pair) + 85,000,000 USDT (for USDT/USDC) = 170,000,000 USDT
  // Need: 85,000,000 USDC (for WBTC pair) + 85,000,000 USDC (for USDT/USDC) = 170,000,000 USDC
  console.log("\n=== Minting tokens ===");
  await (await wbtc.mint(deployer.address, 2000n * 10n ** 8n)).wait();
  console.log("  Minted 2,000 WBTC");
  await (await usdt.mint(deployer.address, 170_000_000n * 10n ** 6n)).wait();
  console.log("  Minted 170,000,000 USDT");
  await (await usdc.mint(deployer.address, 170_000_000n * 10n ** 6n)).wait();
  console.log("  Minted 170,000,000 USDC");

  // Approve
  console.log("\n=== Approving router ===");
  await (await usdt.approve(ROUTER_ADDR, hre.ethers.MaxUint256)).wait();
  await (await usdc.approve(ROUTER_ADDR, hre.ethers.MaxUint256)).wait();
  await (await wbtc.approve(ROUTER_ADDR, hre.ethers.MaxUint256)).wait();
  console.log("  ✅ All approved");

  // WBTC/USDT: 1000 WBTC + 85,000,000 USDT
  console.log("\n=== Adding liquidity: WBTC/USDT (1000 WBTC + 85,000,000 USDT) ===");
  await (await router.addLiquidity(
    WBTC_ADDR, USDT_ADDR,
    1000n * 10n ** 8n, 85_000_000n * 10n ** 6n,
    0, 0, deployer.address, deadline
  )).wait();
  console.log("  ✅ done");

  // WBTC/USDC: 1000 WBTC + 85,000,000 USDC
  console.log("\n=== Adding liquidity: WBTC/USDC (1000 WBTC + 85,000,000 USDC) ===");
  await (await router.addLiquidity(
    WBTC_ADDR, USDC_ADDR,
    1000n * 10n ** 8n, 85_000_000n * 10n ** 6n,
    0, 0, deployer.address, deadline
  )).wait();
  console.log("  ✅ done");

  // USDT/USDC: 85,000,000 each
  console.log("\n=== Adding liquidity: USDT/USDC (85,000,000 each) ===");
  await (await router.addLiquidity(
    USDT_ADDR, USDC_ADDR,
    85_000_000n * 10n ** 6n, 85_000_000n * 10n ** 6n,
    0, 0, deployer.address, deadline
  )).wait();
  console.log("  ✅ done");

  console.log("\n" + "=".repeat(50));
  console.log("DONE! Updated pool liquidity:");
  console.log("  WBTC/USDT — ~1,010 WBTC + ~85,850,000 USDT");
  console.log("  WBTC/USDC — ~1,010 WBTC + ~85,850,000 USDC");
  console.log("  USDT/USDC — ~90,000,000 each");
  console.log("=".repeat(50));
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); });
