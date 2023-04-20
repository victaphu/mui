// @typed - MH
import { Icon } from '@iconify/react'
import React from 'react'
import { Collection } from '../../types/collection'
import { abbreviateNumber } from '../../utils/utils'
import Price from '../common/price'

export default function CollectionStats({ collection }: { collection: Collection }): JSX.Element {
  return (
    <div className="stats flex justify-evenly">
      <div className="flex items-center text-madGray">
        <Icon icon="fa6-solid:cubes-stacked" className="fa-solid fa-people-group mr-1" />
        <p>{collection.nfts_count ? abbreviateNumber(collection.nfts_count) : 0}</p>
      </div>
      <div className="flex items-center text-madGray ">
        <Icon icon="fa6-solid:people-group" className="fa-solid fa-people-group mr-1" />
        <p>{collection.holders_count ? abbreviateNumber(collection.holders_count) : 0}</p>
      </div>
      <div className="flex items-center text-madGray">
        <Icon
          icon="fa6-solid:arrow-down-short-wide"
          className="fa-solid fa-arrow-down-short-wide mr-1"
        />
        <p>
          <Price price={collection.floor_price} priceExact={collection.floor_price_exact} />
        </p>
      </div>
      <div className="flex items-center text-madGray ">
        <Icon icon="fa6-solid:chart-simple" className="fa-solid fa-chart-simple mr-1" />
        <p>{collection.volume ? abbreviateNumber(collection.volume) : 0}</p>
      </div>
    </div>
  )
}
