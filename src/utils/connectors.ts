import { InjectedConnector } from 'wagmi/connectors/injected'
import { wagmiAdapters } from '../constants/network'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { Connector } from 'wagmi'
import Web3AuthConnectorInstance from './web3auth'

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

export const social = Web3AuthConnectorInstance(wagmiAdapters)

const connectors: Record<string, Connector> = {
  injected,
  walletConnect,
  social
}

export default connectors
