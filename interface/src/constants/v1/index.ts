import { Interface } from '@ethersproject/abi'
import V1_EXCHANGE_ABI from './v1_exchange.json'
import V1_FACTORY_ABI from './v1_factory.json'

// No V1 on WorldLand
const V1_FACTORY_ADDRESSES: { [chainId: number]: string } = {}

const V1_FACTORY_INTERFACE = new Interface(V1_FACTORY_ABI)
const V1_EXCHANGE_INTERFACE = new Interface(V1_EXCHANGE_ABI)

export { V1_FACTORY_ADDRESSES, V1_FACTORY_INTERFACE, V1_EXCHANGE_INTERFACE, V1_EXCHANGE_ABI, V1_FACTORY_ABI }
