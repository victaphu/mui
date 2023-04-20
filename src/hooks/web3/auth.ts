import { useWeb3React } from '@web3-react/core'
import connectors from '../../utils/connectors'
import { useEffect, useState } from 'react'
import { getUserLogoutStatus, logoutUserAsync } from '../../store/user'
import { useDispatch, useSelector } from 'react-redux'
import { getApiAuthRequired } from '../../store/web3'
import { useRouter } from 'next/router'
import { log } from '../../utils/log'

export default function useAuth() {
  const { activate, deactivate } = useWeb3React()
  const [disconnecting, setDisconnecting] = useState(false)
  const logoutStatus = useSelector(getUserLogoutStatus)
  const apiAuthRequired = useSelector(getApiAuthRequired)
  const dispatch = useDispatch()
  const router = useRouter()

  const connectWithProvider = async (connector) => {
    await activate(connector)
  }

  const connect = async (container: string) => {
    try {
      const containerSelected = container ? connectors[container] : connectors.injected
      await connectWithProvider(containerSelected)
      localStorage.connected = 'yes'
      localStorage.connectedType = container
      log('mad:auth:connect', container)
    } catch (error) {
      localStorage.connected = 'none'
      log('mad:auth:connect', error, 'error')
    }
  }

  const disconnect = async () => {
    setDisconnecting(true)
    log('mad:auth:disconnect', '')
  }

  useEffect(() => {
    log('mad:auth:useEffect', '', 'info')
    if (disconnecting && logoutStatus === 'pending') {
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
  }, [logoutStatus, apiAuthRequired, dispatch, router, deactivate, disconnecting])

  return {
    connect,
    disconnect,
    disconnecting
  }
}
