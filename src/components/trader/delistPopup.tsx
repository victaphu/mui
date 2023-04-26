import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'
import Popup from '../common/popup'
import { getTradeAsset, getTraderStatus, statusUpdated, tradeTypeAdded } from '../../store/trader'
import useToaster from '../../hooks/toast'
import Loader from '../common/loader'
import useMarketplace from '../../hooks/web3/marketplace'
import useCrudObjectApi from '../../hooks/api/crudObject'
import { useRouter } from 'next/router'
import Button from '../form/button'
import useWeb3 from '../../hooks/web3/web3'

export default function DelistPopup({
  closePopup
}: {
  closePopup: () => Promise<void>
}): JSX.Element {
  const tradeAsset = useSelector(getTradeAsset)
  const dispatch = useDispatch()
  const marketplace = useMarketplace()
  const { account } = useWeb3()
  const toaster = useToaster()
  const tradeAssetStatus = useSelector(getTraderStatus)
  const { getData } = useCrudObjectApi()
  const router = useRouter()

  useEffect(() => {
    if (tradeAsset) {
      marketplace.setContractVersion(tradeAsset.collection.version)
      marketplace.setContractType(tradeAsset.collection.token_standard)
      marketplace.setContractAddress(tradeAsset.collection.contract_id)
    }
  }, [marketplace, tradeAsset])

  const delistOrder = async () => {
    dispatch(statusUpdated('pending'))
    const result = await marketplace.cancelOrder(account, tradeAsset.hash)
    if (!result.error) {
      getData('sync/nft/data/' + tradeAsset.id, null, true).then(() => {
        toaster.success('Success', 'Item successfully removed from the marketplace')
        dispatch(statusUpdated('complete'))
      })
    } else {
      dispatch(statusUpdated('idle'))
    }
  }

  return (
    <Popup closePopup={closePopup}>
      <h3 className="mb-2 px-6 text-3xl text-center dark:text-dark-madWhite text-light-madWhite font-bold">
        <>
          Delist<span>Asset</span>.
        </>
      </h3>
      <p className="font-normal text-center px-2">
        {tradeAssetStatus === 'complete'
          ? 'Item has been successfully de-listed. It may take a minute to complete indexing and become available to buy.'
          : 'Are you sure you want to delist this item from the marketplace?'}
      </p>

      {tradeAssetStatus === 'pending' && (
        <div className="p-4 mb-2 flex items-center justify-center">
          <div className="z-10 absolute dark:bg-madBlack bg-madWhite bg-opacity-90 dark:bg-opacity-90 top-0 left-0 bottom-0 right-0 flex flex-col justify-center p-10 text-center items-center">
            <div>
              <Loader />
              Please sign the transaction in your Wallet to complete your marketplace listing
            </div>
          </div>
        </div>
      )}
      {tradeAssetStatus !== 'complete' ? (
        <div className="flex justify-center items-center w-full mt-4">
          <Button
            colour="madPink"
            hoverColour="madBlack"
            onClick={() => dispatch(tradeTypeAdded(null))}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button colour="madBlue" hoverColour="madBlack" onClick={delistOrder} className="ml-2">
            Confirm
          </Button>
        </div>
      ) : (
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
      )}
    </Popup>
  )
}
