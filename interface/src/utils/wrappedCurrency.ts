import { ChainId, Currency, CurrencyAmount, ETHER, Token, TokenAmount, WETH } from '@uniswap/sdk'
import { WWL } from '../constants'

// Patch WETH for WorldLand chain 103
;(WETH as any)[103] = WWL

// Patch ETHER symbol/name for WorldLand (WLC instead of ETH)
;(ETHER as any).symbol = 'WLC'
;(ETHER as any).name = 'WorldLand Coin'

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  return chainId && currency === ETHER ? (WETH as any)[chainId] : currency instanceof Token ? currency : undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: ChainId | undefined
): TokenAmount | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined
}

export function unwrappedToken(token: Token): Currency {
  if ((WETH as any)[token.chainId] && token.equals((WETH as any)[token.chainId])) return ETHER
  return token
}
