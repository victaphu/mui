// @typed v1
import { Icon } from '@iconify/react'
import React from 'react'
import { Tooltip } from '../toolTip/toolTip'
import { abbreviateNumber } from '../../utils/utils'
import NftPriceAction from './nftPriceAction'
import useNftPrice from '../../hooks/nftPrice'
import Price from '../common/price'
import { NftComponent } from '../../types/containers'

export default function NftStats({ nft }: NftComponent): JSX.Element {
  const { lastPrice, lastPriceExact, priceAction, priceActionChange } = useNftPrice(nft)

  return (
    <div className="stats flex items-center gap-2 sm:gap-4 mx-4">
      <Tooltip
        button={
          <div className="flex items-center text-madGray cursor-default">
            <Icon icon="fa6-solid:heart" className="mr-1" />
            <p>{nft.likes_boost_count ? abbreviateNumber(nft.likes_boost_count) : 0}</p>
          </div>
        }
      >
        <div className="text-center">Number of likes</div>
      </Tooltip>
      <Tooltip
        button={
          <div className="flex items-center text-madGray cursor-default">
            <Icon icon="fa6-solid:chart-simple" className="mr-1" />
            <p>{nft.volume ? abbreviateNumber(nft.volume) : 0}</p>
          </div>
        }
      >
        <div className="text-center">Number of sales</div>
      </Tooltip>
      <Tooltip
        button={
          <div className="flex items-center text-madGray cursor-default">
            <Icon icon="fa6-solid:cubes-stacked" className="mr-1" />
            <p>{nft.total_supply ? abbreviateNumber(nft.total_supply) : 1}</p>
          </div>
        }
      >
        <div className="text-center">NFT Supply</div>
      </Tooltip>
      <Tooltip
        button={
          <div className="flex items-center text-madGray cursor-default whitespace-nowrap">
            <NftPriceAction nft={nft} />
            <Price price={lastPrice} priceExact={lastPriceExact} hideHover={true} />
          </div>
        }
      >
        {priceAction !== null ? (
          <div className={'flex items-center w-32'}>
            <span
              className={
                !priceAction
                  ? 'text-madPink mr-1 whitespace-nowrap'
                  : 'text-madGreen mr-1 whitespace-nowrap'
              }
            >
              <NftPriceAction nft={nft} />
              {priceActionChange}%
            </span>{' '}
            change from last sale
          </div>
        ) : (
          <div className="text-center">Last sale price</div>
        )}
      </Tooltip>
    </div>
  )
}
