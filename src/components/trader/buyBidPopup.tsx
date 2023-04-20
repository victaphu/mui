import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Popup from '../common/popup'
import { Nft, NftOrder } from '../../types/nft'
import { getTraderStatus, statusUpdated, tradeAssetDeleted } from '../../store/trader'
import Loader from '../common/loader'
import { useWeb3React } from '@web3-react/core'
import useMarketplace from '../../hooks/web3/marketplace'
import useToaster from '../../hooks/toast'
import { formatImageUrl } from '../../utils/utils'
import Button from '../form/button'
import { Icon } from '@iconify/react'
import useNftPrice from '../../hooks/nftPrice'
import useCrudObjectApi from '../../hooks/api/crudObject'
import { useRouter } from 'next/router'
import Balance from '../wallet/balance'
import Price from '../common/price'
import { getCurrentNetwork } from '../../store/web3'
import ConnectButton from '../wallet/button'
import { compareAndRequestNetworkChange, findNetworkById } from '../../utils/network'

export default function BuyBidPopup({
  bidData,
  closePopup
}: {
  bidData: Nft & NftOrder
  closePopup: () => Promise<void>
}): JSX.Element {
  const dispatch = useDispatch()
  const { floorPrice, floorPriceExact } = useNftPrice(bidData)
  const { account, library } = useWeb3React()
  const { getData } = useCrudObjectApi()
  const [minPrice, setMinPrice] = useState<number>(0)
  const router = useRouter()
  const network = useSelector(getCurrentNetwork)

  function roundUp(value, decimals) {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals)
  }

  const marketplace = useMarketplace()
  const toaster = useToaster()
  const tradeAssetStatus = useSelector(getTraderStatus)
  const [bidPrice, setBidPrice] = useState<number>(0)

  useEffect(() => {
    if (bidData) {
      marketplace.setContractVersion(bidData.collection.version)
      marketplace.setContractType(bidData.collection.token_standard)
      marketplace.setContractAddress(bidData.collection.contract_id)
      const price = bidData?.bid_price * 1 > 0 ? bidData?.bid_price : bidData?.start_price
      setMinPrice(
        roundUp(
          (parseFloat(price.toString()) + (6 / 100) * parseFloat(price.toString())).toString(),
          18
        )
      ) // 6%
    }
  }, [marketplace, bidData])

  const bid = async () => {
    dispatch(statusUpdated('pending'))
    await compareAndRequestNetworkChange(
      library?.provider,
      dispatch,
      network,
      findNetworkById(bidData?.collection?.chain)
    )
    const submitPrice = (bidPrice ? bidPrice : minPrice).toString()
    if (parseFloat(submitPrice) < minPrice) {
      toaster.error(
        'Price error',
        'Please submit a bid greater than the minimum bid (current price + 5%)'
      )
      dispatch(statusUpdated('idle'))
      return
    }
    const result = await marketplace.bid(account, bidData.hash, parseFloat(submitPrice))
    if (!result.error) {
      getData('sync/nft/data/' + bidData.id, null, true).then(() => {
        dispatch(statusUpdated('complete'))
        toaster.success('Success', 'Bid successfully placed!')
      })
    } else {
      dispatch(statusUpdated('idle'))
    }
  }

  const closePopupAndClear = () => {
    closePopup().then(() => {
      dispatch(statusUpdated('idle'))
      dispatch(tradeAssetDeleted())
    })
  }

  return (
    <Popup closePopup={closePopupAndClear} backClick={closePopupAndClear}>
      <h3 className="mb-4 -mt-1 px-6 text-2xl text-center font-medium">Place Your Bid</h3>
      <div className="flex mb-4">
        <div className="relative w-24 h-24 rounded overflow-hidden">
          <img
            alt="NFT image"
            src={formatImageUrl(bidData.image)}
            className="absolute w-full h-full object-cover top-0 left-0"
          />
        </div>
        <div className="ml-4 flex flex-col justify-center">
          <h3 className="text-lg">
            <span className="text-zinc-400 bg-transparent max-w-[48px] inline-block overflow-hidden mr-2">
              #{bidData.token_id}
            </span>
            <span className="text-white inline-block overflow-hidden">{bidData.name}</span>
          </h3>
          <h4 className="text-zinc-400">{bidData.collection.name}</h4>
        </div>
        <div className="ml-auto flex flex-col justify-center items-end text-right">
          <span className="inline-block mt-1">
            <Price price={bidData.start_price} priceExact={bidData.start_price_exact} />
          </span>
          <span className="text-zinc-400 mt-1">qty: {bidData.quantity || 1}</span>
        </div>
      </div>
      <div className="flex mb-4 p-4 border-zinc-800 border rounded-lg">
        <div className="flex flex-col justify-center">
          <h3 className="text-lg flex items-center">
            <Icon icon="fa6-solid:dollar-sign" className="mr-2 h-4 text-madPink" /> Minimum bid
          </h3>
          <h4 className="text-zinc-400 text-sm">Current bid</h4>
        </div>
        <div className="ml-auto flex flex-col justify-center items-end text-right">
          <span>
            <Price price={minPrice || floorPrice} priceExact={floorPriceExact} />
          </span>
          <span className="text-zinc-400 text-sm">
            <Price price={floorPrice} priceExact={floorPriceExact} />
          </span>
        </div>
      </div>

      <Balance />

      {tradeAssetStatus !== 'complete' && tradeAssetStatus !== 'pending' && (
        <>
          <div className="flex my-4 px-4 border-zinc-800 border rounded-lg">
            <label htmlFor="price" className="block w-19 text-left py-2 whitespace-nowrap mr-2">
              Your bid
            </label>
            <input
              autoFocus={true}
              type="number"
              name="price"
              id="price"
              value={bidPrice || minPrice}
              min={minPrice}
              onChange={(event) => {
                // @ts-ignore
                setBidPrice(event.target.value)
              }}
              placeholder="Bid"
              className="bg-transparent text-right ml-auto mr-2 p-2 w-full"
            />
            <span className="mr-0 py-2">
              {network.currency.erc20Symbol || network.currency.symbol}
            </span>
          </div>
          {account ? (
            <Button
              onClick={bid}
              colour="madPink"
              hoverColour="madBlack"
              className="w-full justify-center rounded-lg"
            >
              Confirm bid
            </Button>
          ) : (
            <div className="flex justify-center mt-2">
              <ConnectButton />
            </div>
          )}
        </>
      )}

      {tradeAssetStatus === 'pending' && (
        <div className="flex flex-col justify-center p-10 text-center items-center">
          <div>
            <Loader text="Check your wallet..." className="mb-6" />
            Please sign the transaction using your connected wallet to complete your purchase.
          </div>
        </div>
      )}

      {tradeAssetStatus === 'complete' && (
        <>
          <p className="font-normal text-center mt-4 mb-2 px-2 text-lg">Your bid was successful!</p>
          <p className="font-normal text-center px-2 md:px-8 mb-2 text-sm">
            If your bid remains the highest bid when the auction ends you will win the auction and
            can withdraw the NFT from the marketplace at any time.
          </p>
          <p className="font-normal text-center px-2 md:px-8 text-sm">
            If another user outbids your offer your funds will automatically be transfered back to
            your wallet
          </p>
          <div className="mt-4 flex items-center justify-center">
            <Button colour="madPink" hoverColour="madBlack" onClick={() => router.reload()}>
              Reload
            </Button>
          </div>
        </>
      )}
    </Popup>
  )
}
