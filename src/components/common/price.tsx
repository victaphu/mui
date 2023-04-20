// @typed v1
import React from 'react'
import { abbreviateNumber } from '../../utils/utils'
import { Tooltip } from '../toolTip/toolTip'
import { useSelector } from 'react-redux'
import { getCurrentNetwork } from '../../store/web3'
import Copy from './copy'

export default function Price({
  price,
  priceExact,
  hideHover
}: {
  price: number
  priceExact: string
  hideHover?: boolean
}): JSX.Element {
  const network = useSelector(getCurrentNetwork)
  return (
    <>
      {!hideHover && parseInt(priceExact) > 1 ? (
        <Tooltip
          button={
            <>
              <Copy
                text={
                  (parseInt(priceExact) < 100000000000000 && parseInt(priceExact) > 0
                    ? '< 0.0001 '
                    : abbreviateNumber(price)) + ' '
                }
                success={'Price copied'}
              />
              {network.currency?.erc20Symbol || network.currency?.symbol}
            </>
          }
        >
          <Copy className={'text-white'} text={priceExact} success={'Price copied'} />
        </Tooltip>
      ) : (
        <>
          <Copy
            text={
              parseInt(priceExact) < 100000000000000 && parseInt(priceExact) > 0
                ? '< 0.0001'
                : abbreviateNumber(price).toString()
            }
            success={'Price copied'}
          />
          &nbsp;{network.currency?.erc20Symbol || network.currency?.symbol}
        </>
      )}
    </>
  )
}
