import { Currency, Price } from '@uniswap/sdk'

/**
 * Returns the price in USDC of the input currency
 * No USDC on WorldLand - always returns undefined
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useUSDCPrice(currency?: Currency): Price | undefined {
  return undefined
}
