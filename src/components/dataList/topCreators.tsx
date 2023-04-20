import React from 'react'
import Link from '../common/link'
import { Icon } from '@iconify/react'
import { formatImageUrl } from '../../utils/utils'
import useDataListApi from '../../hooks/api/dataList'
import DataList from '../dataList/dataList'
import Loader from '../common/loader'
import { categoryFilters, creatorFilters, creatorSorting } from '../../constants/filter'
import Button from '../form/button'
import Price from '../common/price'

export default function TopCreators({
  title = 'Creators',
  preTitle = 'Popular',
  params,
  buttonLink,
  buttonText,
  perPage
}: {
  title?: string
  preTitle?: string
  params?
  buttonLink?: string
  buttonText?: string
  perPage?: number
}) {
  const {
    setOrder,
    setFilter,
    dataListLoading,
    dataListOrder,
    dataListData,
    dataListFilters,
    dataListMessage
  } = useDataListApi(
    '/creators',
    { ...{ per_page: perPage ?? 5, order_by: 'likes_boost_count' }, ...params },
    ['category', 'projects'],
    creatorSorting
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
      id: 'creator-filter',
      value: null,
      nullable: true,
      placeholder: 'Creators',
      icon: 'fa6-solid:users',
      options: creatorFilters
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
          <Icon icon="fa6-solid:user" className="h-6 text-madPink" />
          {preTitle}
          <span className="text-madPink">{title}</span>.
        </h2>
      </div>
      <DataList
        hideLoader={true}
        exposedFilters={true}
        setFilter={setFilter}
        setOrder={setOrder}
        dataListFilterGroups={filters}
        dataListFilters={dataListFilters}
        dataListData={dataListData}
        dataListMessage={dataListMessage}
        dataListLoading={dataListLoading}
        wrapperClassName="w-full min-h-table relative mb-10"
        listClassName="w-full"
        filtersClassName="justify-end flex"
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
                      <th className="p-2 pl-2" colSpan={2}>
                        {title}
                      </th>
                      <th
                        className="cursor-pointer over:text-madPink p-2 text-center whitespace-nowrap"
                        onClick={() => tableOrder('volume')}
                      >
                        <Icon icon={thOrder('volume')} className="mr-1 text-xs" />
                        Sold
                      </th>
                      <th
                        className="cursor-pointer over:text-madPink p-2 text-center whitespace-nowrap"
                        onClick={() => tableOrder('volume_price')}
                      >
                        <Icon icon={thOrder('volume_price')} className="mr-1 text-xs" />
                        Volume
                      </th>
                      <th
                        className="cursor-pointer over:text-madPink p-2 text-center whitespace-nowrap"
                        onClick={() => tableOrder('likes_boost_count')}
                      >
                        <Icon icon={thOrder('likes_boost_count')} className="mr-1 text-xs" />
                        Likes
                      </th>
                      <th
                        className="cursor-pointer over:text-madPink p-2 text-center whitespace-nowrap"
                        onClick={() => tableOrder('nfts_count')}
                      >
                        <Icon icon={thOrder('nfts_count')} className="mr-1 text-xs" />
                        NFTs
                      </th>
                    </tr>
                  </thead>
                )}
                <tbody>{children}</tbody>
              </table>
            )}
          </div>
        )}
        listRender={(creator, index) => (
          <tr key={creator.id} className={`border-b-2 border-b-madGray`}>
            <td className="p-4 pr-0 text-center">{index + 1}</td>
            <td className="p-4">
              <Link
                href={`/creator/${creator.uri}`}
                className={`flex shrink-0 w-10 h-10 overflow-hidden rounded-full ring-2 ring-${creator.description_color} dark:ring-${creator.description_color}`}
              >
                <img
                  className={`block w-full h-full object-cover object-center rounded-full`}
                  src={formatImageUrl(creator?.img_avatar, 100, 100)}
                  alt="Bordered avatar"
                />
              </Link>
            </td>
            <td className="">
              <Link href={`/creator/${creator.uri}`}>
                <p className={`name-ellipsis text-${creator.description_color}`}>
                  {!!creator.verified && <Icon icon="fa6-solid:trophy" className="w-4 mr-2" />}
                  {(!!creator.wp_id || creator.wp_id == 0) && (
                    <Icon
                      icon="fa6-solid:crown"
                      className={`w-4 mr-2 text-${creator.description_color}`}
                    />
                  )}
                  {creator?.public_name}
                </p>
                <span className="text-xs name-ellipsis w-44">{creator?.tag_line}</span>
              </Link>
            </td>
            <td className="text-center">
              <span className="text-madGray text-sm leading-none">{creator?.volume ?? 0}</span>
            </td>
            <td className="text-center">
              <span className="text-madGray text-sm leading-none whitespace-nowrap">
                <Price price={creator?.volume_price} priceExact={creator?.volume_price_exact} />
              </span>
            </td>
            <td className="text-center">
              <span className="text-madGray text-sm leading-none">
                {creator?.likes_boost_count ?? 0}
              </span>
            </td>
            <td className="text-center">
              <span className="text-madGray text-sm leading-none">
                {creator?.created_nfts_count ?? 0}
              </span>
            </td>
          </tr>
        )}
      />
      {buttonLink && (
        <div className="flex items-center flex-col">
          <Button href={buttonLink} colour="madPink" hoverColour="madBlack">
            <Icon icon="fa6-solid:user-group" className="fa-solid fa-user mr-1" />
            <span>{buttonText}</span>
          </Button>
        </div>
      )}
    </div>
  )
}
