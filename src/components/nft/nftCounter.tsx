// @typed v1
import { Icon } from '@iconify/react'
import React, { useEffect } from 'react'
import useTimer from '../../hooks/timer'
import useNftTradeState from '../../hooks/nftTradeState'
import { NftComponent } from '../../types/containers'

export default function NftCounter({ nft }: NftComponent): JSX.Element {
  const timer = useTimer()
  const { latestOpenOrder } = useNftTradeState(nft)

  useEffect(() => {
    if (!timer.endTime && latestOpenOrder?.end_time) {
      timer.setEndTime(latestOpenOrder?.end_time)
    }
  }, [latestOpenOrder, timer])

  return (
    <p className={`text-sm font-normal whitespace-nowrap`}>
      {timer.countdown && <Icon icon="fa6-solid:stopwatch" className="mr-1.5" />}
      {latestOpenOrder?.end_time * 1000 < new Date().getTime() && latestOpenOrder?.bidder
        ? 'Sold'
        : timer.countdown || 'Unlisted'}
    </p>
  )
}
