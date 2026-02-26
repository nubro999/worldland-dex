import MULTICALL_ABI from './abi.json'

// Multicall contract address on WorldLand (Chain ID: 103)
// This needs to be deployed - using placeholder until then
const MULTICALL_NETWORKS: { [chainId: number]: string } = {
  103: '0x54A4A4286D5989daB4942c34B78EADD47CfA5628'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
