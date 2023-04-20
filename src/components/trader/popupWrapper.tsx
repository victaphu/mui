import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SellPopup from './sellPopup'
import BuyPopup from './buyPopup'
import SellBuyNowPopup from './sellBuyNowPopup'
import SellAuctionPopup from './sellAuctionPopup'
import BuyBidPopup from './buyBidPopup'
import ClaimAuctionPopup from './claimAuctionPopup'
import TransferPopup from './transferPopup'

import {
  getTradeType,
  tradeTypeDeleted,
  getTradeAsset,
  tradeAssetDeleted
} from '../../store/trader'
import DelistPopup from './delistPopup'
import { getCurrentNetwork } from '../../store/web3'

export default function PopupWrapper(): JSX.Element {
  const dispatch = useDispatch()
  const tradeType = useSelector(getTradeType)
  const tradeAsset = useSelector(getTradeAsset)
  const [symbol, setSymbol] = useState('ONE')
  const network = useSelector(getCurrentNetwork)

  useEffect(() => {
    if (network) {
      setSymbol(network.currency.erc20Symbol || network.currency.symbol)
    }
  }, [network])

  const closeWindow = async () => {
    dispatch(tradeTypeDeleted())
    dispatch(tradeAssetDeleted())
  }

  function OutsideAlerter({ children }: { children: JSX.Element }): JSX.Element {
    const wrapperRef = useRef<HTMLDivElement>(null)
    return <div ref={wrapperRef}>{children}</div>
  }

  const sellWindow = (
    <OutsideAlerter>
      <SellPopup closePopup={closeWindow} />
    </OutsideAlerter>
  )

  const buyWindow = (
    <OutsideAlerter>
      <BuyPopup buyData={tradeAsset} closePopup={closeWindow} />
    </OutsideAlerter>
  )

  const createBuyNowWindow = (
    <OutsideAlerter>
      <SellBuyNowPopup closePopup={closeWindow} symbol={symbol} />
    </OutsideAlerter>
  )

  const createAuctionWindow = (
    <OutsideAlerter>
      <SellAuctionPopup closePopup={closeWindow} symbol={symbol} />
    </OutsideAlerter>
  )

  const delistWindow = (
    <OutsideAlerter>
      <DelistPopup closePopup={closeWindow} />
    </OutsideAlerter>
  )

  const claimAuctionWindow = (
    <OutsideAlerter>
      <ClaimAuctionPopup claimData={tradeAsset} closePopup={closeWindow} symbol={symbol} />
    </OutsideAlerter>
  )

  const bidWindow = (
    <OutsideAlerter>
      <BuyBidPopup bidData={tradeAsset} closePopup={closeWindow} />
    </OutsideAlerter>
  )

  const transferWindow = (
    <OutsideAlerter>
      <TransferPopup transferData={tradeAsset} closePopup={closeWindow} symbol={symbol} />
    </OutsideAlerter>
  )

  return (
    <>
      {tradeType && (
        <>
          {tradeType === 'sell' && sellWindow}
          {tradeType === 'buy' && buyWindow}
          {tradeType === 'createBuyNow' && createBuyNowWindow}
          {tradeType === 'createAuction' && createAuctionWindow}
          {tradeType === 'delist' && delistWindow}
          {tradeType === 'claimAuction' && claimAuctionWindow}
          {tradeType === 'bid' && bidWindow}
          {tradeType === 'transfer' && transferWindow}
        </>
      )}
    </>
  )
}
