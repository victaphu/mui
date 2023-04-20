import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCurrentNetwork } from '../store/web3'
import client from '../utils/client'

export default function useClient() {
  const network = useSelector(getCurrentNetwork)
  const [clientConfigured, setClientConfigured] = useState(false)
  useEffect(() => {
    setClientConfigured(false)
    client.defaults.headers.common.chainId = network.id
    setClientConfigured(true)
  }, [network])
  return clientConfigured ? client : null
}
