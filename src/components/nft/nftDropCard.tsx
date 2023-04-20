// @typed v1
import React, { useEffect } from 'react'
import Link from '../common/link'
import { formatImageUrl } from '../../utils/utils'
import useTimer from '../../hooks/timer'
import { NftComponent } from '../../types/containers'

const NftDropCardComponent = ({ nft }: NftComponent): JSX.Element => {
  const timer = useTimer()

  useEffect(() => {
    if (!timer.endTime && nft.orders[0]?.end_time) {
      timer.setEndTime(nft.orders[0]?.end_time)
    }
  }, [nft, timer])

  return (
    <div
      className={`flex card-wrapper rounded-md mx-3 p-2 mb-4 dark:shadow-black/60 shadow-lg border dark:bg-madCarbon bg-madWhite border-gray-500`}
    >
      <div className="w-full md:w-1/2 p-b-square-small flex relative rounded overflow-hidden">
        <Link href={`/nft/${nft?.token_id}/${nft?.contract_id}`}>
          <img
            src={formatImageUrl(nft.image, 320, 320)}
            alt={nft.name}
            className="object-cover object-cover absolute h-full w-full"
          />
        </Link>
      </div>
      <div className="w-full md:w-1/2 flex">
        <div className="p-4 py-2 md:pr-2 flex flex-col justify-between w-full">
          <Link
            href={`/nft/${nft?.token_id}/${nft?.contract_id}`}
            className="w-full h-full flex flex-col justify-between"
          >
            <h3 className="text-2xl font-bold name-ellipsis">
              {nft.name || nft?.collection?.name}
            </h3>
            <div>
              <span
                className={`inline-block pr-10 mb-2 pb-1 text-sm border-b-2 border-${nft?.category_object?.color} text-${nft?.category_object?.color}`}
              >
                {nft.public_name}
              </span>
            </div>
            <p className="mt-4 mb-auto pb-8 text-gray-500 text-sm">
              {nft?.description?.length > 100
                ? nft.description.substring(0, 100) + '...'
                : nft.description}
            </p>
            <div className="max-w-[180px] mt-auto mb-4 mx-auto dark:bg-madBlack bg-madWhite p-2 px-3 border-2 border-gray-500 rounded w-full flex whitespace-nowrap justify-between">
              <span>
                <span className="text-madGray mr-1">{timer.countdownObject?.days || 0}</span>D
              </span>
              <span>
                <span className="text-madGray mr-1">{timer.countdownObject?.hours || 0}</span>H
              </span>
              <span>
                <span className="text-madGray mr-1">{timer.countdownObject?.minutes || 0}</span>M
              </span>
              <span>
                <span className="text-madGray mr-1">{timer.countdownObject?.seconds || 0}</span>S
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
export default NftDropCardComponent
