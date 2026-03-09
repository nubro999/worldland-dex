import React, { useCallback, useState } from 'react'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import styled from 'styled-components'
import { Text } from 'rebass'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import { ButtonPrimary } from '../../components/Button'
import { useActiveWeb3React } from '../../hooks'
import AppBody from '../AppBody'
import { MOCK_USDT, MOCK_USDC, MOCK_WBTC } from '../../constants'
import { Dots } from '../../components/swap/styleds'
import UsdtLogo from '../../assets/images/usdt.png'
import UsdcLogo from '../../assets/images/usdc.png'
import WbtcLogo from '../../assets/images/wbtc.png'

const MOCK_TOKEN_ABI = [
  'function mint(address to, uint256 value) external',
  'function balanceOf(address) view returns (uint256)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)'
]

const FAUCET_AMOUNTS: { [symbol: string]: { raw: string; display: string; decimals: number } } = {
  USDT: { raw: '10000000000', display: '10,000', decimals: 6 },
  USDC: { raw: '10000000000', display: '10,000', decimals: 6 },
  WBTC: { raw: '100000000', display: '1', decimals: 8 }
}

const TOKENS = [
  { token: MOCK_USDT, label: 'USDT', description: 'Mock Tether USD', logo: UsdtLogo },
  { token: MOCK_USDC, label: 'USDC', description: 'Mock USD Coin', logo: UsdcLogo },
  { token: MOCK_WBTC, label: 'WBTC', description: 'Mock Wrapped BTC', logo: WbtcLogo }
]

const PageWrapper = styled(AutoColumn)`
  max-width: 420px;
  width: 100%;
`

const TokenCard = styled.div`
  background: ${({ theme }) => theme.bg2};
  border-radius: 16px;
  padding: 1rem 1.25rem;
  margin-bottom: 8px;
`

const TokenHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`

const TokenLogo = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
`

const SuccessMessage = styled.div`
  color: ${({ theme }) => theme.green1};
  font-size: 13px;
  margin-top: 8px;
  font-weight: 500;
`

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.red1};
  font-size: 13px;
  margin-top: 8px;
  font-weight: 500;
`

const Subtitle = styled(Text)`
  font-size: 14px;
  color: ${({ theme }) => theme.text2};
  margin-bottom: 16px;
`

const PageTitle = styled(Text)`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 4px;
  text-align: center;
`

export default function Faucet() {
  const { account, library } = useActiveWeb3React()
  const [pending, setPending] = useState<{ [key: string]: boolean }>({})
  const [success, setSuccess] = useState<{ [key: string]: boolean }>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleClaim = useCallback(
    async (tokenAddress: string, symbol: string) => {
      if (!library || !account) return

      setPending(prev => ({ ...prev, [symbol]: true }))
      setSuccess(prev => ({ ...prev, [symbol]: false }))
      setErrors(prev => ({ ...prev, [symbol]: '' }))

      try {
        const signer = library.getSigner(account)
        const contract = new Contract(tokenAddress, MOCK_TOKEN_ABI, signer)
        const amount = FAUCET_AMOUNTS[symbol]
        const tx: TransactionResponse = await contract.mint(account, amount.raw)
        await tx.wait()
        setSuccess(prev => ({ ...prev, [symbol]: true }))
      } catch (err) {
        console.error('Faucet claim error:', err)
        const errMsg = (err as any)?.message || ''
        const msg = errMsg.includes('user rejected') || errMsg.includes('User denied')
          ? 'Transaction rejected by user.'
          : errMsg.includes('insufficient funds')
          ? 'Not enough WL for gas fees.'
          : 'Claim failed: ' + errMsg.substring(0, 120)
        setErrors(prev => ({ ...prev, [symbol]: msg }))
      } finally {
        setPending(prev => ({ ...prev, [symbol]: false }))
      }
    },
    [library, account]
  )

  return (
    <PageWrapper>
      <AppBody>
        <PageTitle>Test Token Faucet</PageTitle>
        <Subtitle>Claim free test tokens to try swapping and providing liquidity.</Subtitle>
        <AutoColumn gap="sm">
          {TOKENS.map(({ token, label, description, logo }) => (
            <TokenCard key={label}>
              <TokenHeader>
                <TokenLogo src={logo} alt={label} />
                <AutoColumn>
                  <Text fontWeight={500} fontSize={15}>
                    {description}
                  </Text>
                  <Text fontSize={12} color="#888">
                    {FAUCET_AMOUNTS[label].display} {label} per claim
                  </Text>
                </AutoColumn>
              </TokenHeader>
              {!account ? (
                <ButtonPrimary disabled>
                  <Text fontWeight={500} fontSize={16}>
                    Connect Wallet
                  </Text>
                </ButtonPrimary>
              ) : (
                <ButtonPrimary
                  onClick={() => handleClaim(token.address, label)}
                  disabled={pending[label]}
                >
                  <Text fontWeight={500} fontSize={16}>
                    {pending[label] ? <Dots>Claiming</Dots> : `Claim ${FAUCET_AMOUNTS[label].display} ${label}`}
                  </Text>
                </ButtonPrimary>
              )}
              {success[label] && <SuccessMessage>Claimed successfully! Tokens are in your wallet.</SuccessMessage>}
              {errors[label] && <ErrorMessage>{errors[label]}</ErrorMessage>}
            </TokenCard>
          ))}
        </AutoColumn>
        <RowBetween style={{ marginTop: '16px' }}>
          <Text fontSize={12} color="#888" style={{ textAlign: 'center', width: '100%' }}>
            These are test tokens on WorldLand (Chain 103) with no real value.
          </Text>
        </RowBetween>
      </AppBody>
    </PageWrapper>
  )
}
