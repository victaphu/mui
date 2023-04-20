import React, { useState } from 'react'

const PriceRangeComponent = ({
  onChangeHandler
}: {
  onChangeHandler: (amount: string, type: 'min' | 'max') => void
}): JSX.Element => {
  const [min, setMin] = useState('0')
  const [max, setMax] = useState('')
  return (
    <div className="flex flex-col">
      <div className="flex items-center w-full pb-3">
        <div className="w-1/2 card-price flex rounded-full dark:bg-madCarbon bg-madWhite items-center">
          <input
            onChange={(event) => {
              onChangeHandler(event.target.value, 'min')
              setMin(event.target.value)
            }}
            value={min}
            id="search"
            name="min"
            type="number"
            min={0}
            max={max}
            placeholder="min"
            className="block w-full px-3 py-1 pr-10 text-gray-500 dark:bg-madCarbon bg-madWhite border-1 rounded-full focus:border-madPink focus:outline-none focus:ring focus:ring-madPink dark:focus:text-dark-madWhite focus:text-light-madWhite"
          />
          <span className="text-socialFb font-black text-sm -ml-10">ONE</span>
        </div>
        <p className="mx-2">-</p>
        <div className="w-1/2 card-price flex rounded-full dark:bg-madCarbon bg-madWhite p-0 items-center">
          <input
            onChange={(event) => {
              onChangeHandler(event.target.value, 'max')
              setMax(event.target.value)
            }}
            value={max}
            id="search"
            name="max"
            type="number"
            min={min}
            placeholder="max"
            className="block w-full px-3 py-1 pr-10 text-gray-500 dark:bg-madCarbon bg-madWhite border-1 rounded-full focus:border-madPink focus:outline-none focus:ring focus:ring-madPink dark:focus:text-dark-madWhite focus:text-light-madWhite"
          />
          <span className="text-socialFb font-black text-sm -ml-10">ONE</span>
        </div>
      </div>
    </div>
  )
}
export default PriceRangeComponent
