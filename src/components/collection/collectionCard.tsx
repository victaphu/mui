// @typed MH
import React from 'react'
import Link from '../common/link'
import { abbreviateNumber, formatImageUrl } from '../../utils/utils'
import { Collection } from '../../types/collection'
import CollectionActions from './collectionActions'
import CollectionIcons from './collectionIcons'
import Price from '../common/price'
import useWeb3 from '../../hooks/web3/web3'

const CollectionCardComponent = ({
  collection,
  className = `mb-4 card-wrapper rounded-lg dark:shadow-black/60 shadow-lg border dark:bg-madCarbon bg-madWhite border-gray-500 mx-3`
}: {
  collection: Collection
  className?: string
}): JSX.Element => {
  const collectionLink = `/collection/${collection.contract_id}`
  const { account } = useWeb3()

  return (
    <div className={className}>
      <div className="relative mb-4">
        <div className="flex flex-col mb-4 w-full">
          <Link
            href={collectionLink}
            className="w-full overflow-hidden relative mb-4 rounded-t-md pb-[36%]"
          >
            <img
              alt="Collection cover"
              src={collection.img_banner ? formatImageUrl(collection.img_banner) : '/bg-404.jpg'}
              className="absolute object-cover w-full h-full"
            />
          </Link>
          <Link
            href={collectionLink}
            className="absolute sm:hidden shrink-0 w-24 h-24 right-3 top-3 rounded-lg border-4 border-madCarbon dark:border-madWhite overflow-hidden"
          >
            <img
              alt="Collection Icon"
              src={collection.img_avatar ? formatImageUrl(collection.img_avatar) : '/bg-404.jpg'}
              className=" object-cover w-full h-full"
            />
          </Link>
          <Link href={collectionLink}>
            <div className="px-3 flex relative">
              <div className="hidden sm:block relative shrink-0 w-24 h-24 mr-4 -mt-12 rounded-lg border border-zinc-500 overflow-hidden">
                <img
                  alt="Collection Icon"
                  src={
                    collection.img_avatar ? formatImageUrl(collection.img_avatar) : '/bg-404.jpg'
                  }
                  className="absolute object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col flex-wrap 2xl:flex-row">
                <div className="mr-4 mb-2">
                  <h2 className="text-lg font-bold -mt-1 name-ellipsis">{collection.name}</h2>
                  <div className="text-gray-500 text-sm -mt-1 whitespace-nowrap">
                    {abbreviateNumber(collection.holders_count)} Owner
                    {collection.holders_count > 1 ? 's' : ''}
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4">
                    <div className="text-sm  -mt-0.5">Volume:</div>
                    <div className="text-gray-500">
                      <Price
                        price={collection.volume_price}
                        priceExact={collection.volume_price_exact}
                      />
                    </div>
                  </div>
                  <div className="mr-4">
                    <div className="text-sm -mt-0.5">Floor:</div>
                    <div className="text-gray-500">
                      <Price
                        price={collection.floor_price || collection.mint_price}
                        priceExact={collection.floor_price_exact || collection.mint_price_exact}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-auto">
                <CollectionIcons collection={collection} />
              </div>
            </div>
          </Link>
        </div>
        {account && account.toLowerCase() === collection.creator.creator_address.toLowerCase() && (
          <div className="absolute top-2 left-2">
            <CollectionActions collection={collection} />
          </div>
        )}
      </div>
    </div>
  )
}
export default CollectionCardComponent
