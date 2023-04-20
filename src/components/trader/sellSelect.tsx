import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import DatePicker from 'react-datepicker'
import { useSelector } from 'react-redux'
import { getCurrentNetwork } from '../../store/web3'

export default function SellSelect({
  tokenStandard,
  onSelectBuy,
  onSelectAuction,
  onSelectUnlisted,
  endDate,
  setEndDate,
  quantity,
  quantityMax,
  setQuantity,
  price,
  setPrice,
  currentSelection,
  className = 'my-2 flex items-center justify-center gap-4',
  formClassName = 'mt-4'
}: {
  tokenStandard?: '721' | '1155'
  onSelectBuy: () => void
  onSelectAuction: () => void
  onSelectUnlisted?: () => void
  endDate?: Date
  setEndDate?: (date) => void
  quantity?: number
  quantityMax?: number
  setQuantity?: (number) => void
  price?: number
  setPrice?: (number) => void
  currentSelection?: number
  className?: string
  formClassName?: string
}): JSX.Element {
  const network = useSelector(getCurrentNetwork)
  const [minDate, setMinDate] = useState(null)
  useEffect(() => {
    const date = new Date(new Date().getTime() + network?.minListingMinutes * 60000)
    setMinDate(date)
  }, [network, endDate, setEndDate])
  return (
    <>
      <div className={className}>
        <button
          className={`flex flex-col rounded-lg px-2 items-center justify-center h-32 ease-in duration-300 border bg-madWhite border-gray-500 text-gray-500 hover:bg-madPink hover:border-madPink dark:hover:bg-madPink dark:hover:text-white ${
            currentSelection === 0
              ? 'bg-madPink text-white dark:bg-madPink dark:text-white'
              : 'dark:bg-madOnyx'
          }`}
          onClick={onSelectBuy}
        >
          <Icon icon="fa6-solid:wallet" className="text-4xl" />
          <p className="font-normal text-2xl">Buy now</p>
        </button>
        <button
          className={`flex flex-col rounded-lg px-2 items-center justify-center h-32 ease-in duration-300 border bg-madWhite border-gray-500 text-gray-500 hover:bg-madPink hover:border-madPink dark:hover:bg-madPink dark:hover:text-white ${
            currentSelection === 2
              ? 'bg-madPink text-white dark:bg-madPink dark:text-white'
              : 'dark:bg-madOnyx'
          }`}
          onClick={onSelectAuction}
        >
          <Icon icon="fa6-solid:gavel" className="text-4xl" />
          <p className="font-normal text-2xl">Auction</p>
        </button>
        {onSelectUnlisted && (
          <button
            className={`flex flex-col rounded-lg px-2 items-center justify-center h-32 ease-in duration-300 border bg-madWhite border-gray-500 text-gray-500 hover:bg-madPink hover:border-madPink dark:hover:bg-madPink dark:hover:text-white ${
              currentSelection === 3
                ? 'bg-madPink text-white dark:bg-madPink dark:text-white'
                : 'dark:bg-madOnyx'
            }`}
            onClick={onSelectUnlisted}
          >
            <Icon icon="fa6-solid:gavel" className="text-4xl" />
            <p className="font-normal text-2xl">Unlisted</p>
          </button>
        )}
      </div>
      {(currentSelection || currentSelection === 0) && currentSelection != 3 && (
        <div className={formClassName}>
          <h6 className="font-bold text-xl">
            NFT <span>Price</span>.
          </h6>
          <p className="font-normal text-madGray leading-none text-sm">
            Set the item price {tokenStandard === '1155' ? 'and quantity' : ''} for your NFT.
          </p>
          <div className="w-full flex justify-end text-right border-b border-gray-500 w-full mb-0 ml-auto">
            <input
              type="number"
              min={0}
              name="price"
              value={price}
              onChange={(event) => {
                setPrice(parseFloat(event.target.value))
              }}
              placeholder="Price"
              className="bg-transparent focus:outline-none border-none text-right w-1/2"
            />
            <span className="text-madGray py-2 ml-2">
              {network.currency.erc20Symbol || network?.currency?.symbol}
            </span>
          </div>
          {tokenStandard === '1155' && (
            <div className="w-full flex justify-end text-right border-b border-gray-500 w-full ml-auto mb-4">
              <input
                type="number"
                min={1}
                step={1}
                max={quantityMax}
                name="quantity"
                value={quantity || ''}
                onChange={(event) => {
                  setQuantity(
                    parseInt(event.target.value) > quantityMax
                      ? quantityMax
                      : parseInt(event.target.value)
                  )
                }}
                placeholder="Quantity"
                className="bg-transparent focus:outline-none border-none text-right w-1/2"
              />
              <span className="text-madGray py-2 ml-2">QTY</span>
            </div>
          )}
          <div className="text-right -mt-3 text-madGray">
            {tokenStandard === '1155' ? `max ${quantityMax}` : ''}
          </div>

          <div className="mt-4">
            <h6 className="font-bold text-xl">
              End<span>Date</span>.
            </h6>
          </div>
          <div className="w-full ml-auto">
            <label htmlFor="end" className="flex items-center">
              <DatePicker
                showTimeSelect
                dateFormat="Pp"
                selected={endDate}
                minDate={minDate}
                onChange={(date: Date) => {
                  setEndDate(date)
                }}
                className="w-full bg-transparent py-2 border-b text-right border-gray-500 "
              />
            </label>
          </div>
        </div>
      )}
    </>
  )
}
