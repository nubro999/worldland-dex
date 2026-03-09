const hre = require("hardhat");
const fs = require("fs");

const ROUTER_ADDR = "0x9381B0004cd1090597a0a5296C1a63Ba879775e4";
const FACTORY_ADDR = "0xD4E0861B5A339b703462CcCf12f614929605d169";
const WETH_ADDR_CONST = "0x3c3c6026D02bB10d42ab338efE780a37542846e0";

const USDT_ADDR = "0x4046bd9eC8223c2a9354dC517b2D2d67B75CEbfb";
const USDC_ADDR = "0x2477e7fCE92FDA16064E95eD4391a0995210ecbD";
const WBTC_ADDR = "0x25D49C3119f581306f04366A516141368e81A7dC";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);
  const bal = await hre.ethers.provider.getBalance(deployer.address);
  console.log("WL Balance:", hre.ethers.formatEther(bal));

  const tokenABI = [
    "function mint(address to, uint256 value) external",
    "function approve(address spender, uint256 value) external returns (bool)",
    "function balanceOf(address) view returns (uint256)"
  ];

  const routerABI = [
    "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)",
    "function removeLiquidityETH(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external returns (uint amountToken, uint amountETH)"
  ];

  const pairABI = [
    "function balanceOf(address) view returns (uint256)",
    "function approve(address spender, uint256 value) external returns (bool)",
    "function totalSupply() view returns (uint256)"
  ];

  const factoryABI = ["function getPair(address,address) view returns (address)"];

  const usdt = new hre.ethers.Contract(USDT_ADDR, tokenABI, deployer);
  const usdc = new hre.ethers.Contract(USDC_ADDR, tokenABI, deployer);
  const wbtc = new hre.ethers.Contract(WBTC_ADDR, tokenABI, deployer);
  const router = new hre.ethers.Contract(ROUTER_ADDR, routerABI, deployer);
  const factory = new hre.ethers.Contract(FACTORY_ADDR, factoryABI, deployer);

  const deadline = Math.floor(Date.now() / 1000) + 3600;
  const WETH_ADDR = WETH_ADDR_CONST;

  // ── Remove WL liquidity from WL-paired pools ───────────────
  console.log("\n=== Removing WL liquidity from WL-paired pools ===");

  const wlPairs = [
    { name: "USDT/WL", token: USDT_ADDR },
    { name: "USDC/WL", token: USDC_ADDR },
    { name: "WBTC/WL", token: WBTC_ADDR }
  ];

  for (const { name, token } of wlPairs) {
    const pairAddr = await factory.getPair(token, WETH_ADDR);
    if (pairAddr === hre.ethers.ZeroAddress) {
      console.log(`  ${name}: no pair, skipping`);
      continue;
    }
    const pair = new hre.ethers.Contract(pairAddr, pairABI, deployer);
    const lpBal = await pair.balanceOf(deployer.address);
    if (lpBal === 0n) {
      console.log(`  ${name}: no LP balance, skipping`);
      continue;
    }
    console.log(`  ${name}: removing LP (${lpBal.toString()})...`);
    await (await pair.approve(ROUTER_ADDR, lpBal)).wait();
    await (await router.removeLiquidityETH(token, lpBal, 0, 0, deployer.address, deadline)).wait();
    console.log(`  ✅ ${name} WL liquidity removed`);
  }

  const balAfter = await hre.ethers.provider.getBalance(deployer.address);
  console.log("WL Balance after removal:", hre.ethers.formatEther(balAfter));

  // ── Mint more tokens ────────────────────────────────────────
  console.log("\n=== Minting more tokens ===");
  const USDT_MINT = 10_000_000n * 10n ** 6n;
  const USDC_MINT = 10_000_000n * 10n ** 6n;
  const WBTC_MINT = 100n * 10n ** 8n;

  await (await usdt.mint(deployer.address, USDT_MINT)).wait();
  console.log("  Minted 10,000,000 USDT");
  await (await usdc.mint(deployer.address, USDC_MINT)).wait();
  console.log("  Minted 10,000,000 USDC");
  await (await wbtc.mint(deployer.address, WBTC_MINT)).wait();
  console.log("  Minted 100 WBTC");

  // ── Approve router ─────────────────────────────────────────
  console.log("\n=== Approving router ===");
  await (await usdt.approve(ROUTER_ADDR, hre.ethers.MaxUint256)).wait();
  await (await usdc.approve(ROUTER_ADDR, hre.ethers.MaxUint256)).wait();
  await (await wbtc.approve(ROUTER_ADDR, hre.ethers.MaxUint256)).wait();
  console.log("  ✅ All approved");

  // ── Add heavy liquidity to token-only pairs ─────────────────
  // USDT/USDC: 5,000,000 each (1:1)
  console.log("\n=== Adding liquidity: USDT/USDC (5,000,000 each) ===");
  await (await router.addLiquidity(
    USDT_ADDR, USDC_ADDR,
    5_000_000n * 10n ** 6n, 5_000_000n * 10n ** 6n,
    0, 0, deployer.address, deadline
  )).wait();
  console.log("  ✅ USDT/USDC done");

  // WBTC/USDT: 10 WBTC + 850,000 USDT (1 BTC = $85,000)
  console.log("\n=== Adding liquidity: WBTC/USDT (10 WBTC + 850,000 USDT) ===");
  await (await router.addLiquidity(
    WBTC_ADDR, USDT_ADDR,
    10n * 10n ** 8n, 850_000n * 10n ** 6n,
    0, 0, deployer.address, deadline
  )).wait();
  console.log("  ✅ WBTC/USDT done");

  // WBTC/USDC: 10 WBTC + 850,000 USDC (1 BTC = $85,000)
  console.log("\n=== Adding liquidity: WBTC/USDC (10 WBTC + 850,000 USDC) ===");
  await (await router.addLiquidity(
    WBTC_ADDR, USDC_ADDR,
    10n * 10n ** 8n, 850_000n * 10n ** 6n,
    0, 0, deployer.address, deadline
  )).wait();
  console.log("  ✅ WBTC/USDC done");

  // ── Summary ─────────────────────────────────────────────────
  console.log("\n" + "=".repeat(50));
  console.log("DONE! Pool liquidity summary:");
  console.log("  USDT/USDC — ~5,000,000 each");
  console.log("  WBTC/USDT — ~10 WBTC + 850,000 USDT");
  console.log("  WBTC/USDC — 10 WBTC + 850,000 USDC (NEW)");
  console.log("  WL pairs  — liquidity removed");
  console.log("=".repeat(50));

  const finalBal = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Final WL balance:", hre.ethers.formatEther(finalBal));
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); });
