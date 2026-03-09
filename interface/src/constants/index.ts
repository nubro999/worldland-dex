import { JSBI, Percent, Token } from '@uniswap/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'

import { injected } from '../connectors'

export const ROUTER_ADDRESS = '0x9381B0004cd1090597a0a5296C1a63Ba879775e4'

// WorldLand Chain ID
const WORLDLAND = 103 as any

// ── Mock tokens on WorldLand (chain 103) ──────────────────────
// Addresses will be populated after deployment via deploy-tokens.js
export const MOCK_USDT = new Token(103, '0x4046bd9eC8223c2a9354dC517b2D2d67B75CEbfb', 6, 'USDT', 'Mock Tether USD')
export const MOCK_USDC = new Token(103, '0x2477e7fCE92FDA16064E95eD4391a0995210ecbD', 6, 'USDC', 'Mock USD Coin')
export const MOCK_WBTC = new Token(103, '0x25D49C3119f581306f04366A516141368e81A7dC', 8, 'WBTC', 'Mock Wrapped BTC')

// All default tokens for WorldLand chain (used by useAllTokens hook)
export const WORLDLAND_DEFAULT_TOKENS: { [address: string]: Token } = {
  [MOCK_USDT.address]: MOCK_USDT,
  [MOCK_USDC.address]: MOCK_USDC,
  [MOCK_WBTC.address]: MOCK_WBTC
}

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId: number]: Token[]
}

// Wrapped WLC — defined manually since @uniswap/sdk doesn't include chain 103
export const WWL = new Token(103, '0x3c3c6026D02bB10d42ab338efE780a37542846e0', 18, 'WWLC', 'Wrapped WLC')

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [WORLDLAND]: [MOCK_USDT, MOCK_USDC, MOCK_WBTC]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [WORLDLAND]: [MOCK_USDT, MOCK_USDC, MOCK_WBTC]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [WORLDLAND]: [MOCK_USDT, MOCK_USDC, MOCK_WBTC]
}

export const PINNED_PAIRS: { readonly [chainId: number]: [Token, Token][] } = {
  [WORLDLAND]: [
    [MOCK_USDT, MOCK_USDC],
    [MOCK_WBTC, MOCK_USDT]
  ]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much WLC so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 WLC
export const BETTER_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000))
