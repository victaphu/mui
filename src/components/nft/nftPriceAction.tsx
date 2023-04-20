// @typed v1
import React from 'react'
import { Icon } from '@iconify/react'
import useNftPrice from '../../hooks/nftPrice'
import { NftComponent } from '../../types/containers'

export default function NftPriceAction({ nft }: NftComponent): JSX.Element {
  const { priceAction } = useNftPrice(nft)
  return (
    <Icon
      icon={`${
        priceAction === null
          ? 'fa:line-chart'
          : priceAction === true
          ? 'fa6-solid:arrow-up-wide-short'
          : 'fa6-solid:arrow-down-short-wide'
      }`}
      className={`${
        priceAction === false ? 'text-madPink' : priceAction === true ? 'text-madGreen' : ''
      } mr-1`}
    />
  )
}
