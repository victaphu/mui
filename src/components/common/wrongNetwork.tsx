// @typed - MH
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCurrentNetwork } from '../../store/web3'
import { Network } from '../../types/network'
import { requestNetworkChange } from '../../utils/network'
import { useWeb3React } from '@web3-react/core'
import Button from '../form/button'
import ConnectButton from '../wallet/button'

export default function WrongNetwork({
  compareNetwork,
  message = 'You are viewing an item from a different chain, please switch your network'
}: {
  compareNetwork: Network
  message?: string
}): JSX.Element {
  const { account, library } = useWeb3React()
  const network = useSelector(getCurrentNetwork)
  const [showMessage, setShowMessage] = useState<boolean>(false)
  useEffect(() => {
    if (!network?.id || !compareNetwork.id) {
      setShowMessage(false)
      return
    }
    setShowMessage(network?.id != compareNetwork.id)
  }, [network, compareNetwork])
  return (
    <>
      {showMessage && (
        <section className="flex items-center mb-6 bg-zinc-200 dark:bg-zinc-700 rounded p-4 flex flex-row flex-wrap justify-between mb-2">
          {message}
          {account ? (
            <Button
              className="text-xs ml-4"
              colour="madPink"
              hoverColour="madBlack"
              onClick={() => {
                requestNetworkChange(library?.provider, compareNetwork).then()
              }}
            >
              Switch network
            </Button>
          ) : (
            <div className="ml-4">
              <ConnectButton />
            </div>
          )}
        </section>
      )}
    </>
  )
}