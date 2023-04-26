import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Popup from '../common/popup'
import Loader from '../common/loader'
import cn from 'classnames'
import useToaster from '../../hooks/toast'
import {
  getTradeAsset,
  getTraderStatus,
  statusUpdated,
  tradeAssetDeleted,
  tradeAssetUpdated,
  tradeTypeAdded
} from '../../store/trader'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import useMarketplace from '../../hooks/web3/marketplace'
import { useRouter } from 'next/router'
import useFeeCalculator from '../../hooks/feeCalculator'
import useNftOwner from '../../hooks/nftOwner'
import { abbreviateNumber } from '../../utils/utils'
import useCrudObjectApi from '../../hooks/api/crudObject'
import { getCurrentNetwork } from '../../store/web3'
import useToken from '../../hooks/web3/token'
import useWeb3 from '../../hooks/web3/web3'

export default function SellAuctionPopup({
  closePopup,
  symbol
}: {
  closePopup: () => Promise<void>
  symbol: string
}): JSX.Element {
  const dispatch = useDispatch()
  const toaster = useToaster()
  const router = useRouter()
  const marketplace = useMarketplace()
  const tokenContract = useToken()
  const tradeAsset = useSelector(getTradeAsset)
  const tradeAssetStatus = useSelector(getTraderStatus)
  const { account } = useWeb3()
  const { nftObject, setNft, resaleTreasuryFee, creatorRoyalty, resaleTotal } = useFeeCalculator()
  const { ownerBalance } = useNftOwner(tradeAsset)
  const network = useSelector(getCurrentNetwork)

  const [minDate, setMinDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [inputPrice, setInputPrice] = useState<number>(0)
  const [inputQuantity, setInputQuantity] = useState<number>(0)
  const { getData } = useCrudObjectApi()

  useEffect(() => {
    if (!endDate && network?.minListingMinutes) {
      const date = new Date(new Date().getTime() + network.minListingMinutes * 60000)
      setMinDate(date)
      setEndDate(date)
    }
  }, [network, endDate, setMinDate, setEndDate])

  useEffect(() => {
    marketplace.setContractVersion(tradeAsset?.collection?.version)
    marketplace.setContractType(tradeAsset?.collection?.token_standard)
    marketplace.setContractAddress(tradeAsset?.collection?.contract_id)
    tokenContract.setContractVersion(tradeAsset?.collection?.version)
    tokenContract.setContractAddress(tradeAsset?.collection?.contract_id)
    tokenContract.setContractType(tradeAsset?.collection?.token_standard)
    tokenContract.setTokenType(tradeAsset?.collection?.token_type)
  }, [marketplace, tokenContract, tradeAsset])

  useEffect(() => {
    if (inputPrice && inputPrice !== nftObject?.price) {
      const assetCopy = { ...tradeAsset, ...{ price: inputPrice } }
      setNft(assetCopy)
    }
  }, [setNft, marketplace, tradeAsset, inputPrice, nftObject])

  const listItemForAuction = async () => {
    if (tradeAsset.collection.token_standard === '1155') {
      if (!endDate || !inputQuantity || inputQuantity < 1 || !inputPrice || inputPrice < 0) {
        toaster.error('Error', 'Please enter a price, quantity and end date')
        return
      }
      if (inputQuantity > parseInt(ownerBalance.amount)) {
        toaster.error(
          'Error',
          'Please enter a valid quantity, max: ' + abbreviateNumber(parseInt(ownerBalance.amount))
        )
        return
      }
    } else {
      if (!endDate || !inputPrice || inputPrice < 0) {
        toaster.error('Error', 'Please enter a price and end date')
        return
      }
    }
    dispatch(statusUpdated('pending'))

    let approved = await tokenContract.getApprovedForAll(account)
    if (!approved.response) {
      approved = await tokenContract.setApprovalForAll(account, true)
    }
    if (!approved.error) {
      const endTime = endDate ? parseInt((endDate.getTime() / 1000).toFixed(0)) : null
      const result = await marketplace.englishAuction(
        account,
        tradeAsset.token_id,
        inputPrice,
        endTime,
        inputQuantity
      )
      if (!result.error) {
        getData('sync/nft/data/' + tradeAsset.id, null, true).then(() => {
          toaster.success('Success', 'Item listed for sale')
          dispatch(statusUpdated('complete'))
        })
      } else {
        dispatch(statusUpdated('idle'))
      }
    } else {
      dispatch(statusUpdated('idle'))
    }
  }

  const closePopupAndClear = () => {
    dispatch(statusUpdated('idle'))
    dispatch(tradeAssetDeleted())
    closePopup().then()
  }

  const backClick = () => {
    dispatch(tradeAssetUpdated({ price: '0' }))
    dispatch(tradeTypeAdded('sell'))
  }

  return (
    <Popup closePopup={closePopupAndClear} backClick={backClick} title="Listing Auction">
      {tradeAssetStatus === 'complete' && (
        <>
          <p className="mt-6 text-center p-4 dark:bg-madCarbon bg-madWhite rounded-2xl dark:text-dark-madWhite text-light-madWhite">
            Your NFT has been listed in the marketplace! It may take a minute to complete indexing
            and become available to buy.
          </p>
          <div className="flex items-center justify-center">
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
      {tradeAssetStatus != 'complete' && (
        <>
          <p className="font-normal text-center mb-2 px-2">
            Set the auction start price for your NFT.
          </p>
          <div className="p-4 pb-0 mb-2 flex items-center justify-center">
            {tradeAssetStatus === 'pending' && (
              <div className="z-10 absolute dark:bg-madBlack bg-madWhite bg-opacity-90 dark:bg-opacity-90 top-0 left-0 bottom-0 right-0 flex flex-col justify-center p-10 text-center items-center">
                <div>
                  <Loader />
                  Please sign the transaction in your Wallet to complete your marketplace listing
                </div>
              </div>
            )}
            <span className="whitespace-nowrap dark:bg-madOnyx bg-madWhite w-[120px] px-3.5 py-2 border border-gray-500 rounded-l-full focus:outline-none focus:ring focus:ring-madPink">
              Start Price
            </span>
            <input
              type="number"
              min={0}
              name="price"
              value={inputPrice}
              onChange={(event) => {
                setInputPrice(parseFloat(event.target.value))
              }}
              placeholder="Price"
              className="dark:bg-madOnyx bg-madWhite w-full px-4 py-2 border border-gray-500 focus:border-madPink focus:outline-none focus:ring focus:ring-madPink dark:focus:text-dark-madWhite focus:text-light-madWhite"
            />
            <span className="dark:bg-madOnyx bg-madWhite px-3.5 py-2 border border-gray-500 text-gray-500 rounded-r-full focus:outline-none focus:ring focus:ring-madPink whitespace-nowrap">
              {symbol}
            </span>
          </div>
          {tradeAsset.collection.token_standard === '1155' && (
            <div className="p-4 py-0 mb-2 flex items-center w-full">
              <span className="dark:bg-madOnyx bg-madWhite w-[120px] px-3.5 py-2 border border-gray-500 rounded-l-full focus:outline-none focus:ring focus:ring-madPink">
                Quantity
              </span>
              <input
                type="number"
                min={1}
                max={ownerBalance?.amount}
                name="quantity"
                value={tradeAsset?.quantity}
                onChange={(event) => {
                  setInputQuantity(parseInt(event.target.value))
                }}
                placeholder="1"
                className="dark:bg-madOnyx bg-madWhite w-full px-4 py-2 border border-gray-500 focus:border-madPink focus:outline-none focus:ring focus:ring-madPink dark:focus:text-dark-madWhite focus:text-light-madWhite"
              />
              <span className="dark:bg-madOnyx bg-madWhite px-3.5 py-2 border border-gray-500 text-gray-500 rounded-r-full focus:outline-none focus:ring focus:ring-madPink whitespace-nowrap">
                (available {abbreviateNumber(parseInt(ownerBalance?.amount))})
              </span>
            </div>
          )}
          <label className="p-4 py-0 mb-6 flex items-center w-full">
            <span className="whitespace-nowrap dark:bg-madOnyx bg-madWhite w-[120px] px-3.5 py-2 border border-gray-500 rounded-l-full focus:outline-none focus:ring focus:ring-madPink">
              Sale ends
            </span>
            {endDate && endDate && (
              <DatePicker
                minDate={minDate}
                showTimeSelect
                dateFormat="Pp"
                selected={endDate}
                onChange={(date: Date) => {
                  setEndDate(date)
                }}
                className="dark:text-dark-madWhite text-light-madWhite w-full block px-4 py-2 text-gray-500 dark:bg-madOnyx bg-madWhite border border-gray-500 rounded-r-full focus:border-madPink focus:outline-none focus:ring focus:ring-madPink dark:focus:text-dark-madWhite focus:text-light-madWhite"
              />
            )}
          </label>
          <div className="mb-6">
            <div className="flex flex-col">
              <div className="mb-2 text-center">
                <h6 className="text-2xl">Fee Breakdown</h6>
                <p className="font-normal text-madGray leading-none text-sm">
                  This is the breakdown of the resale fees associated with this NFT.
                </p>
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between my-1 text-sm">
                  <p className="font-normal text-madGray">Price:</p>
                  <p className=" font-normal">
                    {nftObject?.price ? nftObject?.price : 0} {symbol}
                  </p>
                </div>
                <div className="flex justify-between my-1 text-sm">
                  <p className="font-normal text-madGray">
                    Creator Royalty (
                    {tradeAsset?.collection.royalties ? tradeAsset?.collection.royalties / 100 : 0}
                    %):
                  </p>
                  <p className="font-normal text-madPink">- {creatorRoyalty}</p>
                </div>
                <div className="flex justify-between my-1 text-sm mb-2">
                  <p className="font-normal text-madGray">
                    Platform fee ({network?.platformResaleFee}%):
                  </p>
                  <p className="font-normal text-madPink">- {resaleTreasuryFee}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between pt-3 mt-1 border-t border-madGray">
              <p className="text-madGray font-normal">You receive:</p>
              <p className="">
                {resaleTotal} {symbol}
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center w-full">
            <button
              onClick={listItemForAuction}
              className={cn(
                'm-auto py-1.5 px-3 tracking-[-0.08em] rounded-full border border-madBlue',
                'text-madBlue hover:bg-madBlue dark:hover:text-madBlack hover:text-madBlack',
                'uppercase duration-300'
              )}
            >
              Confirm
            </button>
          </div>
        </>
      )}
    </Popup>
  )
}
