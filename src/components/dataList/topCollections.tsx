import React from 'react'
import Link from '../common/link'
import { Icon } from '@iconify/react'
import { formatImageUrl } from '../../utils/utils'
import useDataListApi from '../../hooks/api/dataList'
import DataList from '../dataList/dataList'
import Loader from '../common/loader'
import { categoryFilters, collectionFilters, collectionSorting } from '../../constants/filter'
import Button from '../form/button'
import Price from '../common/price'

export default function TopCollections() {
  const {
    setOrder,
    setFilter,
    dataListLoading,
    dataListOrder,
    dataListData,
    dataListFilters,
    dataListMessage
  } = useDataListApi(
    '/collections',
    { per_page: 5, order_by: 'likes_boost_count' },
    [],
    collectionSorting
  )
  const filters = [
    {
      id: 'category-filter',
      value: null,
      nullable: true,
      placeholder: 'Category',
      icon: 'fa6-solid:table-cells-large',
      options: categoryFilters
    },
    {
      id: 'collection-filter',
      value: null,
      nullable: true,
      placeholder: 'Filter',
      icon: 'fa6-solid:users',
      options: collectionFilters
    }
  ]

  const thOrder = (value) => {
    if (dataListOrder) {
      const dir = dataListOrder.value === value ? dataListOrder.direction : null
      return dir === 'asc'
        ? 'fa6-solid:arrow-down'
        : dir === 'desc'
        ? 'fa6-solid:arrow-up'
        : 'fa6-solid:arrows-up-down'
    }
    return 'fa6-solid:arrows-up-down'
  }

  const tableOrder = (value) => {
    let dir = dataListOrder && dataListOrder.value === value ? dataListOrder.direction : null
    dir = !dir ? 'asc' : dir === 'asc' ? 'desc' : 'desc'
    setOrder({ id: 3, value: value, direction: dir, name: 'Sort' })
  }

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row font-black tracking-[-0.08em] sm:items-end">
        <h2 className="text-4xl dark:text-dark-madWhite text-light-madWhite font-black tracking-[-0.08em] flex items-center">
          <Icon icon="fa6-solid:layer-group" className="h-6 text-madPink" />
          Popular<span className="text-madPink">Collections</span>.
        </h2>
      </div>
      <DataList
        hideLoader={true}
        setFilter={setFilter}
        setOrder={setOrder}
        exposedFilters={true}
        dataListFilterGroups={filters}
        dataListFilters={dataListFilters}
        dataListData={dataListData}
        dataListMessage={dataListMessage}
        dataListLoading={dataListLoading}
        dataListOrder={dataListOrder}
        wrapperClassName="w-full min-h-table relative mb-10"
        filtersClassName="justify-end flex"
        listClassName="w-full"
        listRenderWrapper={(children) => (
          <div className="overflow-x-auto">
            {dataListLoading ? (
              <Loader className="flex w-full bg-opacity-50 dark:bg-madCarbon bg-madWhite rounded-lg absolute h-full w-full top-4 left-0" />
            ) : (
              <table className="table-auto w-full mt-4">
                {!dataListLoading && (
                  <thead>
                    <tr className="text-left text-sm text-gray-400">
                      <th />
                      <th className="p-2 pl-0.5" colSpan={2}>
                        Collection
                      </th>
                      <th
                        className="cursor-pointer hover:text-madPink p-2 text-center whitespace-nowrap"
                        onClick={() => tableOrder('volume')}
                      >
                        <Icon icon={thOrder('volume')} className="mr-1 text-xs" />
                        Sold
                      </th>
                      <th
                        className="cursor-pointer hover:text-madPink p-2 text-center whitespace-nowrap"
                        onClick={() => tableOrder('volume_price')}
                      >
                        <Icon icon={thOrder('volume_price')} className="mr-1 text-xs" />
                        Volume
                      </th>
                      <th
                        className="cursor-pointer hover:text-madPink p-2 text-center whitespace-nowrap"
                        onClick={() => tableOrder('floor_price')}
                      >
                        <Icon icon={thOrder('floor_price')} className="mr-1 text-xs" />
                        Floor
                      </th>
                      <th
                        className="cursor-pointer hover:text-madPink p-2 text-center whitespace-nowrap"
                        onClick={() => tableOrder('likes_boost_count')}
                      >
                        <Icon icon={thOrder('likes_boost_count')} className="mr-1 text-xs" />
                        Likes
                      </th>
                      <th
                        className="cursor-pointer hover:text-madPink p-2 text-center whitespace-nowrap"
                        onClick={() => tableOrder('nfts_count')}
                      >
                        <Icon icon={thOrder('nfts_count')} className="mr-1 text-xs" />
                        NFTs
                      </th>
                      <th
                        className="cursor-pointer hover:text-madPink p-2 text-center whitespace-nowrap"
                        onClick={() => tableOrder('holders_count')}
                      >
                        <Icon icon={thOrder('holders_count')} className="mr-1 text-xs" />
                        Holders
                      </th>
                    </tr>
                  </thead>
                )}
                <tbody>{children}</tbody>
              </table>
            )}
          </div>
        )}
        listRender={(collection, index) => (
          <tr key={collection.id} className={`border-b-2 border-b-madGray`}>
            <td className="p-4 pr-0 text-center">{index + 1}</td>
            <td className="p-4">
              <Link
                href={`/collection/${collection.contract_id}`}
                className={`flex shrink-0 w-10 h-10 overflow-hidden rounded-full ring-2 ring-${collection.category_icon_color} dark:ring-${collection.category_icon_color}`}
              >
                <img
                  className={`block w-full h-full object-cover object-center rounded-full shadow-2xl`}
                  src={formatImageUrl(collection?.img_avatar, 100, 100)}
                  alt=""
                />
              </Link>
            </td>
            <td className="">
              <Link href={`/collection/${collection.contract_id}`}>
                <p className={`name-ellipsis text-${collection.category_icon_color}`}>
                  {collection?.name}
                </p>
                <span className="text-xs name-ellipsis w-44">{collection?.public_name}</span>
              </Link>
            </td>
            <td className="text-center">
              <span className="text-madGray text-sm leading-none">{collection?.volume ?? 0}</span>
            </td>
            <td className="text-center">
              <span className="text-madGray text-sm leading-none whitespace-nowrap">
                <Price price={collection.volume_price} priceExact={collection.volume_price_exact} />
              </span>
            </td>
            <td className="text-center">
              <span className="text-madGray text-sm leading-none whitespace-nowrap">
                <Price price={collection.floor_price} priceExact={collection.floor_price_exact} />
              </span>
            </td>
            <td className="text-center">
              <span className="text-madGray text-sm leading-none">
                {collection?.likes_boost_count ?? 0}
              </span>
            </td>
            <td className="text-center">
              <span className="text-madGray text-sm leading-none">
                {collection?.nfts_count ?? 0}
              </span>
            </td>
            <td className="text-center">
              <span className="text-madGray text-sm leading-none">
                {collection?.holders_count ?? 0}
              </span>
            </td>
          </tr>
        )}
      />
      <div className="flex items-center flex-col">
        <Button href="/collections" colour="madPink" hoverColour="madBlack">
          <Icon icon="fa6-solid:layer-group" className="fa-solid fa-user mr-1" />
          <span>Explore all Collections</span>
        </Button>
      </div>
    </div>
  )
}
