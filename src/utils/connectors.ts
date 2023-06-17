// import { InjectedConnector } from '@web3-react/injected-connector'
// import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
// import type { AbstractConnector } from '@web3-react/abstract-connector'
// import { supportedChains, supportedChainsWalletConnect } from '../constants/network'

// export const injected = new InjectedConnector({
//   supportedChainIds: supportedChains
// })

// export const walletConnect = new WalletConnectConnector({
//   qrcode: true,
//   infuraId: process.env.REACT_INFURA_KEY,
//   rpc: supportedChainsWalletConnect,
//   bridge: 'https://bridge.walletconnect.org'
// })

// const connectors: Record<string, AbstractConnector> = {
//   injected,
//   walletConnect
// }

// export default connectors

import { InjectedConnector } from 'wagmi/connectors/injected'
import { wagmiAdapters } from '../constants/network'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { Connector } from 'wagmi'

export const injected = new InjectedConnector({
  chains: wagmiAdapters
})

export const walletConnect = new WalletConnectConnector({
  chains: wagmiAdapters,
  options: {
    projectId: '0d1de1116a855c20817c023ce3d500bf',
    showQrModal: true
  }
})

const connectors: Record<string, Connector> = {
  injected,
  walletConnect
}

export default connectors
