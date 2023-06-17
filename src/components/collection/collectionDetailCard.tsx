import React, { useEffect, useState } from 'react'
import { Collection } from '../../types/collection'
import CollectionActions from './collectionActions'
import Link from '../common/link'
import { Icon } from '@iconify/react'
import Loader from '../common/loader'
import { abbreviateNumber, formatDate, trimSentence } from '../../utils/utils'
import Popup from '../common/popup'
import Price from '../common/price'
import { useAccount } from 'wagmi'

const CollectionDetailCard = ({
  collection,
  collectionLoading
}: {
  collection: Collection
  collectionLoading: boolean
}): JSX.Element => {
  const [editable, setEditable] = useState(false)
  const [descriptionPopup, setDescriptionPopup] = useState(false)
  const { address: account } = useAccount()

  const handleReadMore = () => {
    setDescriptionPopup(!descriptionPopup)
  }

  useEffect(() => {
    if (account && account?.toLowerCase() === collection?.owner?.toLowerCase()) {
      setEditable(true)
    } else {
      setEditable(false)
    }
  }, [account, collection])

  return (
    <section className="relative flex p-4 px-6 md:px-10">
      <div className="flex flex-col w-full md:flex-row md:flex-wrap">
        {!collectionLoading ? (
          <>
            <div className="w-full flex flex-col md:pr-6 md:border-r md:border-gray-600 md:w-[50%] 2xl:w-[40%] 2xl:h-full 2xl:flex-row">
              <div className="mb-4 2xl:mb-0 2xl:w-[60%]">
                <h1 className="text-3xl flex font-bold items-center mb-0">
                  {editable && (
                    <span className="-ml-2 mr-1">
                      <CollectionActions collection={collection} />
                    </span>
                  )}
                  {collection?.name}
                </h1>
                <span className="text-sm whitespace-nowrap">
                  <span className="text-gray-500">Created</span>{' '}
                  {formatDate(collection?.created_at)}
                </span>{' '}
                {collection.external_link && (
                  <p className="text-sm text-gray-500 whitespace-nowrap">
                    <Link external={true} href={collection.external_link}>
                      <>
                        <Icon icon="fa:external-link" className="mr-2" /> {collection.external_link}
                      </>
                    </Link>
                  </p>
                )}
              </div>
              {collection?.description && (
                <div className="mb-4 xl:mb-0 2xl:pl-6">
                  {collection?.description.length > 42 ? (
                    <>
                      {trimSentence(collection?.description, 42, true)}
                      <span className="text-gray-500 ml-1 cursor-pointer" onClick={handleReadMore}>
                        read more
                      </span>
                    </>
                  ) : (
                    collection?.description
                  )}
                  {descriptionPopup && (
                    <Popup closePopup={handleReadMore} title={collection?.name}>
                      <div style={{ whiteSpace: 'pre-line' }}>{collection?.description}</div>
                    </Popup>
                  )}
                </div>
              )}
            </div>
            <div className="w-full flex flex-wrap gap-x-6 gap-y-2 text-gray-500 mb-4 md:px-6 md:w-[50%] 2xl:w-[40%] 2xl:h-full 2xl:border-r 2xl:border-gray-600">
              <div className="">
                <div className="text-xl dark:text-dark-madWhite text-light-madWhite whitespace-nowrap">
                  <Price
                    price={collection.volume_price}
                    priceExact={collection.volume_price_exact}
                  />
                </div>
                <span className="text-sm whitespace-nowrap -mt-1 block">Volume</span>
              </div>
              <div className="">
                <div className="text-xl dark:text-dark-madWhite text-light-madWhite whitespace-nowrap">
                  <Price
                    price={collection.floor_price || collection.mint_price}
                    priceExact={collection.floor_price_exact || collection.mint_price_exact}
                  />
                </div>
                <span className="text-sm whitespace-nowrap -mt-1 block">Floor price</span>
              </div>
              <div className="">
                <div className="text-xl dark:text-dark-madWhite text-light-madWhite">
                  {abbreviateNumber(collection.max_supply)}
                </div>
                <span className="text-sm whitespace-nowrap -mt-1 block">Supply</span>
              </div>
              <div className="">
                <div className="text-xl dark:text-dark-madWhite text-light-madWhite">
                  {parseFloat(
                    parseFloat(
                      (((collection.orders_count || 0) / collection.max_supply) * 100).toString()
                    ).toFixed(3)
                  )}
                  %
                </div>
                <span className="text-sm whitespace-nowrap -mt-1 block">Listed</span>
              </div>
              <div className="">
                <div className="text-xl dark:text-dark-madWhite text-light-madWhite">
                  {abbreviateNumber(collection.holders_calculated_count)}
                </div>
                <span className="text-sm whitespace-nowrap -mt-1 block">Owners</span>
              </div>
              <div className="">
                <div className="text-xl dark:text-dark-madWhite text-light-madWhite">
                  {abbreviateNumber(collection.likes_boost_count) || 0}
                </div>
                <span className="text-sm whitespace-nowrap -mt-1 block">Likes</span>
              </div>
            </div>
          </>
        ) : (
          <Loader />
        )}
      </div>
    </section>
  )
}
export default CollectionDetailCard
