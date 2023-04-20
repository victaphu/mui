import React, { useEffect } from 'react'
import Popup from '../common/popup'
import { Nft, NftOrder } from '../../types/nft'
import { useWeb3React } from '@web3-react/core'
import useMarketplace from '../../hooks/web3/marketplace'
import { getTraderStatus, statusUpdated, tradeAssetDeleted } from '../../store/trader'
import { useDispatch, useSelector } from 'react-redux'
import useToaster from '../../hooks/toast'
import Loader from '../common/loader'
import { useRouter } from 'next/router'
import Button from '../form/button'
import { Icon } from '@iconify/react'
import { formatImageUrl } from '../../utils/utils'
import useNftPrice from '../../hooks/nftPrice'
import useCrudObjectApi from '../../hooks/api/crudObject'
import Balance from '../wallet/balance'
import Price from '../common/price'
import ConnectButton from '../wallet/button'
import { getCurrentNetwork } from '../../store/web3'
import { compareAndRequestNetworkChange, findNetworkById } from '../../utils/network'

export default function BuyPopup({
  buyData,
  closePopup
}: {
  buyData: Nft & NftOrder
  closePopup: () => Promise<void>
}): JSX.Element {
  const dispatch = useDispatch()
  const { account, library } = useWeb3React()
  const network = useSelector(getCurrentNetwork)
  const marketplace = useMarketplace()
  const toaster = useToaster()
  const tradeAssetStatus = useSelector(getTraderStatus)
  const router = useRouter()
  const { floorPrice, floorPriceExact } = useNftPrice(buyData)
  const { getData } = useCrudObjectApi()

  useEffect(() => {
    if (buyData) {
      marketplace.setContractVersion(buyData.collection.version)
      marketplace.setContractType(buyData.collection.token_standard)
      marketplace.setContractAddress(buyData.collection.contract_id)
    }
  }, [marketplace, buyData])

  const buy = async () => {
    dispatch(statusUpdated('pending'))
    await compareAndRequestNetworkChange(
      library?.provider,
      dispatch,
      network,
      findNetworkById(buyData?.collection?.chain)
    )
    const result = await marketplace.buy(account, buyData.hash)
    if (!result.error) {
      getData('sync/nft/data/' + buyData.id, null, true).then(() => {
        dispatch(statusUpdated('complete'))
        toaster.success('Success', 'Item successfully purchased!')
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
    <Popup closePopup={closePopupAndClear} backClick={closePopupAndClear} title="Buy Now">
      <div className="flex mb-4">
        <div className="relative w-24 h-24 rounded overflow-hidden">
          <img
            alt="NFT image"
            src={formatImageUrl(buyData.image)}
            className="absolute w-full h-full object-cover top-0 left-0"
          />
        </div>
        <div className="ml-4 flex flex-col justify-center">
          <h3 className="text-lg">
            <span className="text-zinc-400 bg-transparent max-w-[48px] inline-block overflow-hidden mr-2">
              #{buyData.token_id}
            </span>
            <span className="text-white inline-block overflow-hidden">{buyData.name}</span>
          </h3>
          <h4 className="text-zinc-400">{buyData.collection.name}</h4>
        </div>
        <div className="ml-auto flex flex-col justify-center items-end text-right">
          <span className="inline-block mt-1">
            <Price price={buyData.start_price} priceExact={buyData.start_price_exact} />
          </span>
          <span className="text-zinc-400 mt-1">qty: {buyData.quantity || 1}</span>
        </div>
      </div>
      <div className="flex mb-4 p-4 border-zinc-800 border rounded-lg">
        <div className="flex flex-col justify-center">
          <h3 className="flex items-center">
            <Icon icon="fa6-solid:dollar-sign" className="mr-2 h-3 text-madPink" /> Price (ex
            network fees)
          </h3>
          <h4 className="text-zinc-400 text-sm">Floor price</h4>
        </div>
        <div className="ml-auto flex flex-col justify-center items-end text-right">
          <span>
            <Price price={buyData.start_price} priceExact={buyData.start_price_exact} />
          </span>
          <span className="text-zinc-400 text-sm">
            <Price price={floorPrice} priceExact={floorPriceExact} />
          </span>
        </div>
      </div>

      <Balance />

      {tradeAssetStatus !== 'complete' && tradeAssetStatus !== 'pending' && (
        <div className="flex flex-col justify-center items-center w-full mt-4">
          {account ? (
            <Button
              colour="madPink"
              hoverColour="madBlack"
              onClick={buy}
              className="rounded-lg w-full justify-center"
            >
              Buy now
            </Button>
          ) : (
            <div className="flex justify-center mt-2">
              <ConnectButton />
            </div>
          )}
        </div>
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
        <div className="mt-8 flex flex-col justify-center items-center w-full">
          <p className="font-normal text-center mb-4 px-2">
            Congratulations! Your purchase was successful!
          </p>
          <Button colour="madPink" hoverColour="madBlack" onClick={() => router.reload()}>
            Reload
          </Button>
        </div>
      )}
    </Popup>
  )
}
