import { useEffect, useState } from 'react'
import { getUserLogoutStatus, logoutUserAsync } from '../../store/user'
import { useDispatch, useSelector } from 'react-redux'
import { getApiAuthRequired, getCurrentNetwork } from '../../store/web3'
import { useRouter } from 'next/router'
import { log } from '../../utils/log'
import { useConnect, useDisconnect } from 'wagmi'
import connectors from '../../utils/connectors'

export default function useAuth() {
  const { disconnectAsync } = useDisconnect()
  const { connectAsync } = useConnect()
  const [disconnecting, setDisconnecting] = useState(false)
  const logoutStatus = useSelector(getUserLogoutStatus)
  const apiAuthRequired = useSelector(getApiAuthRequired)
  const dispatch = useDispatch()
  const router = useRouter()
  const currentNetwork = useSelector(getCurrentNetwork)

  const connectWithProvider = async (connector) => {
    // await activate(connector)
    console.log('connector', connector)
    await connectAsync({
      connector
    })
  }

  const disconnect = async () => {
    setDisconnecting(true)
    log('mad:auth:disconnect', '')
  }

  const connect = async (container: string) => {
    try {
      let containerSelected = container ? connectors[container] : connectors.injected
      if (container === 'social') {
        console.log(await containerSelected.getChainId())
        containerSelected = connectors[currentNetwork.id]
      }
      
      console.log('container', container, containerSelected)
      await connectWithProvider(containerSelected)
      localStorage.connected = 'yes'
      localStorage.connectedType = container
      log('mad:auth:connect', container)
      console.log('connection is complete', container)
    } catch (err) {
      console.log('connection is in error', err)
      localStorage.connected = 'none'
      log('mad:auth:connect', err, 'error')
    }
  }

  useEffect(() => {
    log('mad:auth:useEffect', '', 'info')
    console.log('mad nft use effect - disconnecting or something i guess')
    if (disconnecting && logoutStatus === 'pending') {
      disconnectAsync()
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
    disconnecting,
    disconnectAsync,
    setDisconnecting
  ])
  return {
    connect,
    disconnect,
    disconnecting
  }
}
