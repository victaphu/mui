// @typed - MH
import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import transakSDK from '@transak/transak-sdk'
import { Icon } from '@iconify/react'
import Button from '../form/button'
import List from '../common/list'
import { log } from '../../utils/log'
import { useSelector } from 'react-redux'
import { getCurrentNetwork } from '../../store/web3'

export default function Transak({ className }: { className?: string }): JSX.Element {
  const network = useSelector(getCurrentNetwork)
  const { account } = useWeb3React()
  const [transak, setTransak] = useState(null)

  useEffect(() => {
    if (!transak && window && account && network?.transak) {
      const transakParams = {
        apiKey: '1e68ab6d-74a3-4e85-b142-e6899d489aa2',
        environment: network.transak, // STAGING/PRODUCTION
        //hostURL: window.location.origin,
        widgetHeight: '625px',
        widgetWidth: '500px',
        defaultCryptoCurrency: network.currency.symbol,
        walletAddress: account,
        themeColor: 'FF1A54'
      }
      const transakObject = new transakSDK(transakParams)
      log('mad:transak:init', transakParams)
      transakObject.on(transakObject.ALL_EVENTS, (e) => {
        log('mad:transak:event', e)
      })

      setTransak(transakObject)
    }
  }, [account, network, transak])

  const initPayWindow = () => {
    transak.init()
  }

  return (
    <div className={className}>
      <List
        className="text-left"
        items={[
          {
            icon: 'dollar-sign',
            className: 'mb-2 text-lg font-bold',
            iconClassName: 'top-2 left-1',
            content: 'Paying with card? Top up your wallet with your credit card using Transak'
          },
          {
            icon: true,
            className: 'md:mx-10',
            content: 'Step 1: Open the transfer window and select your crypto'
          },
          {
            icon: true,
            className: 'md:mx-10',
            content: 'Step 2: Follow the Transak popup instructions'
          },
          {
            icon: true,
            className: 'md:mx-10',
            content: 'Step 3: Wait for Transak to complete the transfer'
          }
        ]}
      />
      <Button
        colour="madBlack"
        darkColour="madWhite"
        darkHoverColour="madPink"
        hoverColour="madPink"
        onClick={initPayWindow}
        className="mt-4 rounded-md w-full justify-center"
      >
        <Icon icon="fa6-solid:dollar-sign" className="mr-2 w-4" />
        <span className="whitespace-nowrap">Buy crypto with your card</span>
      </Button>
    </div>
  )
}
