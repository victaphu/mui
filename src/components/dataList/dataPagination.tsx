// @typed - MH
import React from 'react'
import { DataListInfo } from '../../types/dataListInfo'

export default function DataPagination({
  className,
  loading,
  listInfo,
  loadMore,
  numberPreText = 'Showing',
  numberSubText = 'item',
  loadMoreText = 'Load more items'
}: {
  className?: string
  loading?: boolean
  listInfo: DataListInfo
  loadMore: () => void
  numberPreText?: string
  numberSubText?: string
  loadMoreText?: string
}): JSX.Element {
  return (
    <div className={className}>
      {!loading ? (
        <div className="text-center">
          <span className="text-madGray">
            {numberPreText} {listInfo.to ?? 0} {numberSubText}
            {numberSubText && listInfo.to !== 1 ? 's' : ''}
          </span>
          {listInfo.next_page_url && (
            <button
              onClick={loadMore}
              className="relative flex items-center text-madGray ring-1 text-sm ring-madGray uppercase rounded-full py-1.5 px-3 tracking-[-0.08em] duration-300 hover:bg-madGray dark:hover:text-madBlack hover:text-madBlack mx-auto mt-3"
            >
              <div className="absolute inset-0 w-full h-full ring-madGray/80 ring-opacity-80 rounded-full duration-300 hover:ring-4 hover:animate-pulse" />
              {loadMoreText}
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}
