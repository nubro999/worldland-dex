import React from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'
import { AutoColumn } from '../../components/Column'
import { ButtonPrimary } from '../../components/Button'
import { useHistory } from 'react-router-dom'

const PageWrapper = styled(AutoColumn)`
  max-width: 560px;
  width: 100%;
  padding: 0 16px;
`

const Card = styled.div`
  background: ${({ theme }) => theme.bg2};
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 12px;
`

const StepNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
  margin-right: 14px;
`

const StepRow = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`

const StepContent = styled.div`
  flex: 1;
`

const StepTitle = styled(Text)`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
`

const StepDesc = styled(Text)`
  font-size: 14px;
  color: ${({ theme }) => theme.text2};
  line-height: 1.5;
`

const SectionTitle = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`

const PageTitle = styled(Text)`
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
`

const PageSubtitle = styled(Text)`
  font-size: 14px;
  color: ${({ theme }) => theme.text2};
  text-align: center;
  margin-bottom: 24px;
  line-height: 1.5;
`

const InfoBox = styled.div`
  background: ${({ theme }) => theme.bg3};
  border-radius: 12px;
  padding: 12px 16px;
  margin-top: 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.text2};
  line-height: 1.5;
`

const TokenBadge = styled.span<{ bg: string }>`
  display: inline-block;
  background: ${({ bg }) => bg};
  color: white;
  font-weight: 600;
  font-size: 12px;
  border-radius: 6px;
  padding: 2px 8px;
  margin-right: 6px;
`

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.bg3};
  margin: 8px 0 20px;
`

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`

const ActionButton = styled(ButtonPrimary)`
  font-size: 15px;
  padding: 12px;
  border-radius: 14px;
`

export default function Guide() {
  const history = useHistory()

  return (
    <PageWrapper>
      {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
      <PageTitle>🚀 Ridge DEX Test Guide</PageTitle>
      <PageSubtitle>
        Get test tokens and try swapping on the WorldLand chain.
        <br />
        These are test tokens with no real value — feel free to experiment.
      </PageSubtitle>

      {/* Prerequisites */}
      <Card>
        {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
        <SectionTitle>📋 Before You Start</SectionTitle>
        <Divider />
        <StepRow>
          <StepNumber>1</StepNumber>
          <StepContent>
            <StepTitle>Install MetaMask</StepTitle>
            <StepDesc>
              Install the MetaMask browser extension to interact with the DEX.
              <br />
              <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" style={{ color: '#8b5cf6' }}>
                metamask.io →
              </a>
            </StepDesc>
          </StepContent>
        </StepRow>
        <StepRow>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>Connect to WorldLand Network</StepTitle>
            <StepDesc>
              Click &quot;Connect Wallet&quot; and the WorldLand network (Chain ID: 103) will be added automatically.
            </StepDesc>
          </StepContent>
        </StepRow>
        <StepRow>
          <StepNumber>3</StepNumber>
          <StepContent>
            <StepTitle>Get 1 WLC for Gas Fees</StepTitle>
            <StepDesc>
              Receive 1 WLC from the WorldLand faucet. This WLC is used to pay transaction gas fees.
              <br />
              1 WLC is enough for hundreds of swaps.
            </StepDesc>
          </StepContent>
        </StepRow>
      </Card>

      {/* Faucet Guide */}
      <Card>
        {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
        <SectionTitle>🪙 Step 1: Claim Test Tokens</SectionTitle>
        <Divider />
        <StepDesc style={{ marginBottom: '12px' }}>
          Go to the <strong>&quot;Faucet&quot;</strong> tab in the top menu to claim free mock tokens for testing.
        </StepDesc>
        <StepRow>
          <StepNumber>1</StepNumber>
          <StepContent>
            <StepTitle>Go to the Faucet Page</StepTitle>
            <StepDesc>Click &quot;Faucet&quot; in the top navigation bar.</StepDesc>
          </StepContent>
        </StepRow>
        <StepRow>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>Select a Token and Claim</StepTitle>
            <StepDesc>
              Click the &quot;Claim&quot; button for the token you want and approve the transaction in MetaMask.
            </StepDesc>
          </StepContent>
        </StepRow>
        <StepRow>
          <StepNumber>3</StepNumber>
          <StepContent>
            <StepTitle>Verify Your Balance</StepTitle>
            <StepDesc>
              Once the transaction is confirmed, the tokens will appear in your wallet.
            </StepDesc>
          </StepContent>
        </StepRow>

        <InfoBox>
          <div style={{ marginBottom: '8px', fontWeight: 600, color: '#ddd' }}>Available Test Tokens:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div><TokenBadge bg="#26A17B">USDT</TokenBadge> 10,000 USDT (Mock Tether USD)</div>
            <div><TokenBadge bg="#2775CA">USDC</TokenBadge> 10,000 USDC (Mock USD Coin)</div>
            <div><TokenBadge bg="#F7931A">WBTC</TokenBadge> 1 WBTC (Mock Wrapped BTC)</div>
          </div>
        </InfoBox>

        <ButtonRow>
          <ActionButton onClick={() => history.push('/faucet')}>
            Go to Faucet →
          </ActionButton>
        </ButtonRow>
      </Card>

      {/* Swap Guide */}
      <Card>
        {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
        <SectionTitle>🔄 Step 2: Swap Tokens</SectionTitle>
        <Divider />
        <StepDesc style={{ marginBottom: '12px' }}>
          Swap freely between the mock tokens you claimed from the faucet.
        </StepDesc>
        <StepRow>
          <StepNumber>1</StepNumber>
          <StepContent>
            <StepTitle>Go to the Swap Page</StepTitle>
            <StepDesc>Click &quot;Swap&quot; in the top navigation bar.</StepDesc>
          </StepContent>
        </StepRow>
        <StepRow>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>Select Token Pair</StepTitle>
            <StepDesc>
              Choose the &quot;From&quot; token (what you send) and the &quot;To&quot; token (what you receive).
              <br />
              e.g. USDT → USDC, USDC → WBTC, etc.
            </StepDesc>
          </StepContent>
        </StepRow>
        <StepRow>
          <StepNumber>3</StepNumber>
          <StepContent>
            <StepTitle>Enter Amount</StepTitle>
            <StepDesc>
              Enter the amount you want to swap. The output amount will be calculated automatically.
            </StepDesc>
          </StepContent>
        </StepRow>
        <StepRow>
          <StepNumber>4</StepNumber>
          <StepContent>
            <StepTitle>Approve & Swap</StepTitle>
            <StepDesc>
              On your first swap, you need to approve the token. After approval, click &quot;Swap&quot; to complete the trade.
            </StepDesc>
          </StepContent>
        </StepRow>

        <InfoBox>
          <div style={{ marginBottom: '8px', fontWeight: 600, color: '#ddd' }}>Supported Swap Pairs:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>• USDT ↔ USDC (Stablecoin 1:1)</div>
            <div>• USDT ↔ WBTC</div>
            <div>• USDC ↔ WBTC</div>
          </div>
        </InfoBox>

        <ButtonRow>
          <ActionButton onClick={() => history.push('/swap')}>
            Go to Swap →
          </ActionButton>
        </ButtonRow>
      </Card>

      {/* Notes */}
      <Card>
        {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
        <SectionTitle>💡 Good to Know</SectionTitle>
        <Divider />
        <StepDesc style={{ lineHeight: '1.8' }}>
          • All tokens are <strong>test tokens</strong> with no real value.
          <br />
          • A small amount of <strong>WLC (gas fee)</strong> is deducted per swap.
          <br />
          • 1 WLC is sufficient for hundreds of transactions.
          <br />
          • Default slippage tolerance is set to 0.5%.
          <br />
          • If you encounter issues, refresh the page and try again.
        </StepDesc>
      </Card>
    </PageWrapper>
  )
}
