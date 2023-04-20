// @typed - MH
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getCurrentNetwork } from '../../store/web3'
import Loader from '../common/loader'
import useFuel from '../../hooks/web3/fuel'

export default function Faucet({
  className = 'inline-flex border-0 text-xs cursor-pointer hover:text-madPink underline mt-5 mx-2 mb-0',
  loaderClassName = 'w-4 h-4'
}: {
  className?: string
  loaderClassName?: string
}): JSX.Element {
  const network = useSelector(getCurrentNetwork)
  const { pow } = useFuel()
  const [loadingPow, setLoadingPow] = useState<boolean>(false)

  const getFuel = async () => {
    if (loadingPow) return
    setLoadingPow(true)
    await pow()
    setLoadingPow(false)
  }

  return (
    <span className={className} onClick={getFuel}>
      Top up your {network?.currency?.symbol}
      {loadingPow && <Loader imgClassName={loaderClassName} />}
    </span>
  )
}
