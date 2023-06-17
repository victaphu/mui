import React, { useEffect } from 'react'
import Popup from '../common/popup'
import { Nft, NftOrder } from '../../types/nft'
import { useDispatch, useSelector } from 'react-redux'
import useNftPrice from '../../hooks/nftPrice'
import useMarketplace from '../../hooks/web3/marketplace'
import useToaster from '../../hooks/toast'
import { getTraderStatus, statusUpdated, tradeAssetDeleted } from '../../store/trader'
import { formatImageUrl } from '../../utils/utils'
import Button from '../form/button'
import Loader from '../common/loader'
import useCrudObjectApi from '../../hooks/api/crudObject'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

export default function ClaimAuctionPopup({
  claimData,
  closePopup,
  symbol
}: {
  claimData: Nft & NftOrder
  closePopup: () => Promise<void>
  symbol: string
}): JSX.Element {
  const dispatch = useDispatch()
  const { floorPrice } = useNftPrice(claimData)
  const { address: account } = useAccount()
  const { getData } = useCrudObjectApi()

  const marketplace = useMarketplace()
  const toaster = useToaster()
  const tradeAssetStatus = useSelector(getTraderStatus)
  const router = useRouter()

  useEffect(() => {
    if (claimData) {
      marketplace.setContractVersion(claimData.collection.version)
      marketplace.setContractType(claimData.collection.token_standard)
      marketplace.setContractAddress(claimData.collection.contract_id)
    }
  }, [marketplace, claimData])

  const claim = async () => {
    dispatch(statusUpdated('pending'))
    const result = await marketplace.claim(account, claimData.hash)
    if (!result.error) {
      getData('sync/nft/data/' + claimData.id, null, true).then(() => {
        dispatch(statusUpdated('complete'))
        toaster.success('Success', 'NFT successfully claimed!')
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
      <h3 className="mb-4 -mt-1 px-6 text-2xl text-center font-medium">Claim Your NFT</h3>
      <div className="flex mb-4">
        <div className="relative w-24 h-24 rounded overflow-hidden">
          <img
            alt="NFT image"
            src={formatImageUrl(claimData.image)}
            className="absolute w-full h-full object-cover top-0 left-0"
          />
        </div>
        <div className="ml-4 flex flex-col justify-center">
          <h3 className="text-lg">{claimData.name}</h3>
          <h4 className="text-zinc-700">{claimData.collection.name}</h4>
        </div>
        <div className="ml-auto flex flex-col justify-center items-end text-right">
          <span>
            {floorPrice} {symbol}
          </span>
          <span className="text-zinc-700">qty: {claimData.quantity || 1}</span>
        </div>
      </div>
      {tradeAssetStatus !== 'complete' && tradeAssetStatus !== 'pending' && (
        <>
          <div className="flex mb-4 px-4 border-zinc-700 border rounded-lg">
            <label htmlFor="price" className="block w-19 text-left py-2 whitespace-nowrap mr-2">
              Your bid
            </label>
            <span className=" py-2 mr-2 ml-auto">{floorPrice}</span>
            <span className="mr-0 py-2">{symbol}</span>
          </div>
          <Button
            onClick={claim}
            colour="madPink"
            hoverColour="madBlack"
            className="w-full justify-center rounded-lg"
          >
            Claim your NFT
          </Button>
        </>
      )}

      {tradeAssetStatus === 'pending' && (
        <div className="flex flex-col justify-center p-10 text-center items-center">
          <div>
            <Loader />
            Please sign the transaction using your connected wallet to complete your claim.
          </div>
        </div>
      )}

      {tradeAssetStatus === 'complete' && (
        <>
          <p className="font-normal text-center mb-2 px-2 text-lg">Your transfer was successful!</p>
          <p className="font-normal text-center px-2 mb-2 text-sm">
            Your NFT has been transferred to your wallet
          </p>
          <div className="mt-4 flex items-center justify-center">
            <button
              onClick={() => router.reload()}
              className={cn(
                'm-auto py-1.5 px-3 tracking-[-0.08em] rounded-full border border-transparent',
                'text-madPink hover:border-madPink hover:bg-madPink dark:hover:text-madBlack hover:text-madBlack',
                'uppercase duration-300'
              )}
            >
              Reload
            </button>
          </div>
        </>
      )}
    </Popup>
  )
}
