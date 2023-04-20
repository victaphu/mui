import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import type { AbstractConnector } from '@web3-react/abstract-connector'
import { supportedChains, supportedChainsWalletConnect } from '../constants/network'

export const injected = new InjectedConnector({
  supportedChainIds: supportedChains
})

export const walletConnect = new WalletConnectConnector({
  qrcode: true,
  infuraId: process.env.REACT_INFURA_KEY,
  rpc: supportedChainsWalletConnect,
  bridge: 'https://bridge.walletconnect.org'
})

const connectors: Record<string, AbstractConnector> = {
  injected,
  walletConnect
}

export default connectors
