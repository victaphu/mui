import { CHAIN_NAMESPACES } from '@web3auth/base'
import { Web3Auth } from '@web3auth/modal'
import { Chain } from 'wagmi'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'
const clientId =
  'BM_UR18KDju5ZqxoqfNR42ufXCsWx437bAtjI5Oj6YgqAcKdqTR9q3Jiq8LsExBtgvu0wqI-Lda6oMeeWKGOOyA'

export default function Web3AuthConnectorInstance(chains: Chain[]) {
  // Create Web3Auth Instance
  const name = 'MAD NFTS'
  const iconUrl = 'https://v1.madnfts.io/logo.svg'
  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x' + chains[0].id.toString(16),
    rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
    displayName: chains[0].name,
    tickerName: chains[0].nativeCurrency?.name,
    ticker: chains[0].nativeCurrency?.symbol,
    blockExplorer: chains[0].blockExplorers?.default.url[0] as string
  }
  const web3AuthInstance = new Web3Auth({
    clientId,
    chainConfig,
    uiConfig: {
      appName: name,
      theme: 'dark',
      loginMethodsOrder: ['google'],
      defaultLanguage: 'en',
      appLogo: iconUrl,
      modalZIndex: '2147483647'
    },
    web3AuthNetwork: 'testnet',
    enableLogging: true
  })
  const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } })
  const openloginAdapterInstance = new OpenloginAdapter({
    privateKeyProvider,
    adapterSettings: {
      network: 'testnet',
      uxMode: 'popup',
      whiteLabel: {
        name: name,
        logoLight: iconUrl,
        logoDark: iconUrl,
        defaultLanguage: 'en',
        dark: true
      },
      loginConfig: {
        google: {
          name: 'Google Login',
          verifier: 'mad-google',
          typeOfLogin: 'google',
          clientId: '125971468645-acluenumtcs9s3m7qcshtmgvfkcgsoj6.apps.googleusercontent.com'
        }
      }
    }
  })
  web3AuthInstance.configureAdapter(openloginAdapterInstance)
  return new Web3AuthConnector({
    chains,
    options: {
      web3AuthInstance
    }
  })
}
