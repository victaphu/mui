import { useWeb3React } from '@web3-react/core'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserLogoutStatus, logoutUserAsync } from '../../store/user'
import { getApiAuthRequired } from '../../store/web3'
import connectors from '../../utils/connectors'
import { log } from '../../utils/log'
import useWeb3Auth from './web3auth'

interface MadWeb3ContextInterface extends Web3ReactContextInterface {
  connect?: (container: string) => Promise<void>
  disconnect?: () => Promise<void>
}

const Web3Context = createContext<{
  web3: Web3ReactContextInterface
  setWeb3: Dispatch<SetStateAction<MadWeb3ContextInterface | null>>
} | null>(null)

export function MadWeb3Provider({ children }) {
  const web3React = useWeb3React()

  const [web3, setWeb3] = useState<MadWeb3ContextInterface | null>(web3React)
  console.log('>>> Web3 Changed', web3)
  return <Web3Context.Provider value={{ web3, setWeb3 }}>{children}</Web3Context.Provider>
}
/**
 * Replace Web3 react so we can merge web3auth and web3-react
 *
 * @returns web3 structure shared to various classes; replaces useWeb3React
 */
export default function useWeb3() {
  const { active, chainId, error, setError, account, activate, deactivate, library } =
    useWeb3React()

  const { web3, setWeb3 } = useContext(Web3Context)

  const web3Auth = useWeb3Auth()
  const [isSocial, setIsSocial] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const logoutStatus = useSelector(getUserLogoutStatus)
  const apiAuthRequired = useSelector(getApiAuthRequired)
  const dispatch = useDispatch()
  const router = useRouter()

  const connectWithProvider = async (connector) => {
    await activate(connector)
  }

  const disconnect = async () => {
    setDisconnecting(true)
    log('mad:auth:disconnect', '')
  }

  const connect = async (container: string) => {
    try {
      if (container === 'social') {
        // console.log(container)
        if (active) {
          web3Auth.deactivate()
        }
        await web3Auth.connect(container)
        console.log('>>> set web3 social', web3Auth)
        // setWeb3({ ...web3Auth, connect, disconnect })
        setIsSocial(true)
      } else {
        setIsSocial(false)
        const containerSelected = container ? connectors[container] : connectors.injected
        await connectWithProvider(containerSelected)
        console.log('>>> set web3')
        setWeb3({
          active,
          chainId,
          error,
          setError,
          account,
          activate,
          deactivate,
          library,
          connect,
          disconnect
        })
      }
      localStorage.connected = 'yes'
      localStorage.connectedType = container
      log('mad:auth:connect', container)
    } catch (err) {
      localStorage.connected = 'none'
      log('mad:auth:connect', err, 'error')
    }
  }

  useEffect(() => {
    if (isSocial && web3Auth) {
      setWeb3(web3Auth)
    }
  }, [web3Auth, isSocial, setWeb3])

  useEffect(() => {
    log('mad:auth:useEffect', '', 'info')
    if (isSocial && disconnecting && logoutStatus === 'pending') {
      web3Auth.deactivate()
    }

    if (!isSocial && disconnecting && logoutStatus === 'pending') {
      deactivate()
      localStorage.connected = 'none'
      localStorage.connectedType = null
      if (!apiAuthRequired) {
        dispatch(logoutUserAsync())
      }
      router.push('/').then(() => {
        setDisconnecting(false)
      })
    }
  }, [
    logoutStatus,
    apiAuthRequired,
    dispatch,
    router,
    deactivate,
    disconnecting,
    isSocial,
    web3Auth
  ])

  if (isSocial) {
    console.log(web3Auth, 'isweb3auth')
    return { ...web3, connect, disconnect }
  }

  return { ...web3, connect, disconnect }
  // return {
  //   connect,
  //   disconnect,
  //   disconnecting,
  //   account,
  //   active,
  //   activate,
  //   deactivate,
  //   chainId,
  //   error,
  //   setError,
  //   library
  // }
}
