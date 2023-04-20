// @typed - MH
import React from 'react'

export default function DataNone({
  className = 'text-center text-madGray mx-3',
  listData,
  message,
  loading
}: {
  className?: string
  listData
  message: string
  loading: boolean
}): JSX.Element {
  return (
    <>
      {!loading && <>{!listData.length && message && <div className={className}>{message}</div>}</>}
    </>
  )
}
