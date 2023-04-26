// @typed - MH
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getUser,
  getUserStatus,
  getUserAsync,
  getSignatureAsync,
  getCsrfAsync,
  authUserAsync,
  getUserProfile,
  getUserProfileStatus,
  getUserSession
} from '../store/user'
import {
  getApiAuthRequired,
  apiAuthRequiredAdded,
  web3AuthRequiredAdded,
  changeNetwork,
  getCurrentNetwork
} from '../store/web3'
import Wallet from '../components/wallet/wallet'
import PopupWrapper from '../components/trader/popupWrapper'
import { defaultNetwork, protectedPages } from '../constants/config'
import useAuth from '../hooks/web3/auth'
import { findNetworkById, findNetworkByName, requestNetworkChange } from '../utils/network'
import { networksVisible, supportedChains } from '../constants/network'
import useToaster from '../hooks/toast'
import { formatContractError } from '../utils/utils'
import { log } from '../utils/log'
import useWeb3 from '../hooks/web3/web3'

export function AuthGuard({ children }: { children: JSX.Element }) {
  // 1 - App state
  const dispatch = useDispatch()
  const router = useRouter()
  const { account, active, chainId, error, library, setError } = useWeb3()
  const user = useSelector(getUser)
  const sessionTimeout = useSelector(getUserSession)
  const profile = useSelector(getUserProfile)
  const userStatus = useSelector(getUserStatus)
  const userProfileStatus = useSelector(getUserProfileStatus)
  const apiAuthRequired = useSelector(getApiAuthRequired)
  const auth = useAuth()
  const toaster = useToaster()
  const [authenticating, setAuthenticating] = useState<boolean>(true)
  const network = useSelector(getCurrentNetwork)

  // 2 - Component state
  const [signingWithApi, setSigningWithApi] = useState(false)

  useEffect(() => {
    if (!sessionTimeout && user && userStatus === 'complete') {
      setError(new Error('Session timeout!'))
    }
  }, [userStatus, setError, sessionTimeout, user])

  // 3 - Data bindings
  // Handle setting user and users profile state and checking protected page access
  useEffect(() => {
    // Try to fetch the user, response may return unauthenticated
    if (!user && userStatus === 'pending') {
      dispatch(getUserAsync())
    }
    // Prevent access to these pages if user is not logged in
    else if (userProfileStatus === 'error' && protectedPages.includes(router.pathname)) {
      router.push('/').then(() => {
        setAuthenticating(false)
        toaster.error('Unauthenticated', 'Please connect your wallet to access this page')
      })
      return
    }
    // Allow child components to mount always for not protected pages
    if (userProfileStatus === 'complete' || userProfileStatus === 'error') {
      setAuthenticating(false)
    }
  }, [user, router, userStatus, profile, userProfileStatus, dispatch, toaster])

  // Handles web3 'active' and store 'apiAuthRequired' / 'web3AuthRequired' and displays modals based on these
  useEffect(() => {
    const signWithApi = async (address) => {
      try {
        const signatureResponse = await dispatch(getSignatureAsync({ address }))
        // @ts-ignore
        const message = signatureResponse.payload
        const signature = await library.getSigner().signMessage(message)
        await dispatch(getCsrfAsync())
        await dispatch(authUserAsync({ address, message, signature, chain: network.id }))
        await dispatch(getUserAsync())
        await dispatch(web3AuthRequiredAdded(false))
        await dispatch(apiAuthRequiredAdded(false))
        setSigningWithApi(false)
      } catch (e) {
        dispatch(web3AuthRequiredAdded(false))
        dispatch(apiAuthRequiredAdded(false))
        setSigningWithApi(false)
        router.push('/').then()
      }
    }
    log('mad:authGuard:useEffect', '', 'info')
    if (
      !signingWithApi &&
      apiAuthRequired === true &&
      error?.message?.includes('Unsupported chain id:')
    ) {
      log('mad:authGuard:UnsupportedChainIdError', '', 'error')
      // @ts-ignore
      if (window.ethereum) {
        // @ts-ignore
        requestNetworkChange(window.ethereum, network).then()
      }
    }
    // Trigger connect if localStorage.connected === 'yes' adn the user profile is authenticated
    if (!active && localStorage.connected === 'yes' && profile && !error) {
      setTimeout(() => auth.connect(localStorage.connectedType || 'injected').then(), 500)
    }
    if (!signingWithApi && apiAuthRequired === true && active) {
      setSigningWithApi(true)
      signWithApi(account).then()
    }
    if (!error && account && profile && account?.toLowerCase() !== profile?.creator_address) {
      setError({
        name: 'Incorrect account',
        message: `You are connected to a different from your current profile. Switch back to ${profile.creator_address} in your wallet or logout and reconnect`
      })
    }
  }, [
    network,
    auth,
    account,
    active,
    apiAuthRequired,
    signingWithApi,
    dispatch,
    router,
    profile,
    library,
    error,
    setError
  ])

  // Handles network change events and stores 'currentNetwork' and localStorage 'cachedChain'
  useEffect(() => {
    // Set default chain | set from user local store in not connected
    if (!chainId || !active) {
      const cachedChain = localStorage.getItem('cachedChain')
      if (cachedChain && supportedChains.includes(parseInt(cachedChain))) {
        dispatch(changeNetwork(findNetworkById(cachedChain)))
        return
      }
    }
    // Set to connected chain if supported
    if (supportedChains.includes(chainId)) {
      const networkFound = findNetworkById(chainId)
      localStorage.setItem('cachedChain', networkFound.id.toString())
      dispatch(changeNetwork(networkFound))
      return
    }
    localStorage.setItem('cachedChain', findNetworkByName(defaultNetwork).id.toString())
    dispatch(changeNetwork(findNetworkByName(defaultNetwork)))
  }, [chainId, active, dispatch])

  return (
    <>
      {error?.message && (
        <div className="p-8 py-5 bg-madYellow text-madBlack text-center text-sm fixed bottom-0 w-full z-[1]">
          <strong>Wallet error:</strong>
          {error.message.includes('Unsupported chain id:') ? (
            <>
              {' '}
              Please switch to one of our supported networks:{' '}
              {networksVisible.map((n, index) => (
                <strong
                  key={index}
                  className="underline mr-0.5 font-bold cursor-pointer"
                  onClick={() => {
                    if (library && library?.provider) {
                      requestNetworkChange(library.provider, n).then()
                    } else {
                      dispatch(changeNetwork(n))
                    }
                  }}
                >
                  {n.label}.{' '}
                </strong>
              ))}
            </>
          ) : (
            <>{formatContractError(error)} </>
          )}
          {error.name === 'Incorrect account' && (
            <span
              className="underline font-bold cursor-pointer"
              onClick={() => auth.disconnect().then()}
            >
              Logout
            </span>
          )}
        </div>
      )}
      <PopupWrapper />
      <Wallet />
      {!authenticating && children}
    </>
  )
}
