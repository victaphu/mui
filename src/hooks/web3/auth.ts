import { useEffect, useState } from 'react'
import { getUserLogoutStatus, logoutUserAsync } from '../../store/user'
import { useDispatch, useSelector } from 'react-redux'
import { getApiAuthRequired } from '../../store/web3'
import { useRouter } from 'next/router'
import { log } from '../../utils/log'
// import useWeb3 from './web3'
import { useConnect, useDisconnect } from 'wagmi'
import connectors, { injected } from '../../utils/connectors'

export default function useAuth() {
  // const w3 = useWeb3()
  // const { deactivate, connect } = w3
  const { disconnectAsync } = useDisconnect()
  const { connectAsync } = useConnect({
    connector: injected
  })
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
      // if (container === 'social') {
      //   // console.log(container)
      //   if (active) {
      //     web3Auth.deactivate()
      //   }
      //   await web3Auth.connect(container)
      //   console.log('>>> set web3 social', web3Auth)
      //   // setWeb3({ ...web3Auth, connect, disconnect })
      //   setIsSocial(true)
      // } else {
      // setIsSocial(false)
      const containerSelected = container ? connectors[container] : connectors.injected
      await connectWithProvider(containerSelected)
      // }
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
