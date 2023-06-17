import { useCallback, useEffect, useState } from 'react'
import { log } from '../../utils/log'
import { Web3Auth } from '@web3auth/modal'
import { CHAIN_NAMESPACES, SafeEventEmitterProvider, WALLET_ADAPTERS } from '@web3auth/base'
import { Web3Provider } from '@ethersproject/providers'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
const clientId =
  'BM_UR18KDju5ZqxoqfNR42ufXCsWx437bAtjI5Oj6YgqAcKdqTR9q3Jiq8LsExBtgvu0wqI-Lda6oMeeWKGOOyA' // get from https://dashboard.web3auth.io

/**
 * Replace Web3 react so we can merge web3auth and web3-react
 *
 * @returns web3 structure shared to various classes; replaces useWeb3React
 */
export default function useWeb3Auth() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null)
  const [, setProvider] = useState<SafeEventEmitterProvider | null>(null)
  const [signer, setSigner] = useState<Web3Provider | null>(null)
  const [active, setActive] = useState(false)
  const [chainId, setChainId] = useState(0x13881)
  const [error, setError] = useState<Error>(null)

  const [walletAddress, setWalletAddress] = useState('')

  const getAccounts = async (_signer: Web3Provider) => {
    const rpc = await _signer.getSigner()
    const address = await rpc.getAddress()
    console.log(address)
    setWalletAddress(address)
  }

  const getChainId = async (_signer: Web3Provider) => {
    const rpc = await _signer.getSigner()
    const chainIdW3 = await rpc.getChainId()
    console.log(chainIdW3)
    setChainId(chainIdW3)
  }

  const connect = async (container: string) => {
    try {
      console.log('connecting ...', web3auth)
      if (!web3auth) {
        setActive(false)
        return
      }
      const web3provider = await web3auth.connect()
      if (!web3provider) {
        log('mad:web3auth:connect', 'failed - web3provider is undefined', 'error')
        return
      }
      const p = new Web3Provider(web3provider)
      setProvider(web3provider)
      setSigner(p)
      await getAccounts(p)
      await getChainId(p)
      log('mad:web3auth:connect', container)
      setActive(true)
    } catch (err) {
      setActive(false)
      localStorage.connected = 'none'
      log('mad:web3auth:connect', err, 'error')
    }
  }

  const activate = async () => {
    try {
      const auth = new Web3Auth({
        clientId,
        web3AuthNetwork: 'testnet', // mainnet, aqua, celeste, cyan or testnet
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: '0x13881',
          rpcTarget: 'https://rpc-mumbai.maticvigil.com' // This is the public RPC we have added, please pass on your own endpoint while creating an app
        },
        uiConfig: {
          theme: 'dark',
          loginMethodsOrder: ['google'],
          appLogo: 'https://v1.madnfts.io/logo.svg' // Your App Logo Here
        }
      })

      const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
          mfaLevel: 'default' // Pass on the mfa level of your choice: default, optional, mandatory, none
        },
        adapterSettings: {
          whiteLabel: {
            name: 'MADNFT',
            logoLight: 'https://v1.madnfts.io/logo.svg',
            logoDark: 'https://v1.madnfts.io/logo.svg',
            defaultLanguage: 'en',
            dark: true // whether to enable dark mode. defaultValue: false
          },
          loginConfig: {
            // Add login configs corresponding to the provider
            // Google login
            google: {
              name: 'Google Login', // The desired name you want to show on the login button
              verifier: 'mad-google', // Please create a verifier on the developer dashboard and pass the name here
              typeOfLogin: 'google', // Pass on the login provider of the verifier you've created
              clientId: '125971468645-acluenumtcs9s3m7qcshtmgvfkcgsoj6.apps.googleusercontent.com' // use your app client id you got from google
            }
            // Add other login providers here
          }
        }
      })
      auth.configureAdapter(openloginAdapter)

      setWeb3auth(auth)

      await auth.initModal({
        modalConfig: {
          [WALLET_ADAPTERS.OPENLOGIN]: {
            label: 'openlogin',
            loginMethods: {
              google: {
                name: 'google login',
                logoDark: 'url to your custom logo which will shown in dark mode'
              }
            },
            // setting it to false will hide all social login methods from modal.
            showOnModal: true
          }
        }
      })
    } catch (err) {
      console.error(err)
      log('mad:web3auth:connect', err, 'error')
    }
  }

  const deactivate = useCallback(async () => {
    if (!web3auth) {
      return
    }
    await web3auth.logout()
    setProvider(null)
    setSigner(null)
    setWalletAddress('')
  }, [web3auth])

  useEffect(() => {
    log('mad:web3auth:useEffect', '')
    activate()
  }, [])

  console.log(walletAddress, active, chainId, error)

  return {
    connect,
    account: walletAddress,
    active,
    activate,
    deactivate,
    chainId,
    error,
    setError,
    library: signer
  }
}
