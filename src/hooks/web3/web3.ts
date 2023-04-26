import { useWeb3React } from '@web3-react/core'
import connectors from '../../utils/connectors'
import { useEffect, useState } from 'react'
import { getUserLogoutStatus, logoutUserAsync } from '../../store/user'
import { useDispatch, useSelector } from 'react-redux'
import { getApiAuthRequired } from '../../store/web3'
import { useRouter } from 'next/router'
import { log } from '../../utils/log'
import useWeb3Auth from './web3auth'
/**
 * Replace Web3 react so we can merge web3auth and web3-react
 *
 * @returns web3 structure shared to various classes; replaces useWeb3React
 */
export default function useWeb3() {
  const { active, chainId, error, setError, account, activate, deactivate, library } =
    useWeb3React()

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

  console.log(library)

  const connect = async (container: string) => {
    try {
      if (container === 'social') {
        // console.log(container)
        if (active) {
          deactivate()
        }
        await web3Auth.connect(container)
        setIsSocial(true)
      } else {
        setIsSocial(false)
        const containerSelected = container ? connectors[container] : connectors.injected
        await connectWithProvider(containerSelected)
      }
      localStorage.connected = 'yes'
      localStorage.connectedType = container
      log('mad:auth:connect', container)
    } catch (err) {
      localStorage.connected = 'none'
      log('mad:auth:connect', err, 'error')
    }
  }

  const disconnect = async () => {
    setDisconnecting(true)
    log('mad:auth:disconnect', '')
  }

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
    return web3Auth
  }

  return {
    connect,
    disconnect,
    disconnecting,
    account,
    active,
    activate,
    deactivate,
    chainId,
    error,
    setError,
    library
  }
}
