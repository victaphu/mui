import { useEffect, useState } from 'react'
import { getUserLogoutStatus, logoutUserAsync } from '../../store/user'
import { useDispatch, useSelector } from 'react-redux'
import { getApiAuthRequired, getCurrentNetwork } from '../../store/web3'
import { useRouter } from 'next/router'
import { log } from '../../utils/log'
import { useConnect, useDisconnect } from 'wagmi'
import connectors, { injected } from '../../utils/connectors'
import { selectWagmiChain } from '../../constants/network'
import Web3AuthConnectorInstance from '../../utils/web3auth'

export default function useAuth() {
  const { disconnectAsync } = useDisconnect()
  const { connectAsync } = useConnect({
    connector: injected
  })
  const currentNetwork = useSelector(getCurrentNetwork)
  const [disconnecting, setDisconnecting] = useState(false)
  const logoutStatus = useSelector(getUserLogoutStatus)
  const apiAuthRequired = useSelector(getApiAuthRequired)
  const dispatch = useDispatch()
  const router = useRouter()

  const connectWithProvider = async (connector) => {
    // await activate(connector)
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
      console.log('selected chain is', currentNetwork)
      if (container === 'social') {
        const chain = selectWagmiChain(currentNetwork.id)
        const containerSelected = Web3AuthConnectorInstance([chain])
        await connectWithProvider(containerSelected)
      } else {
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
