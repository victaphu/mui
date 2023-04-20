import { Sidebar } from '../components/sidebar'
import useDataListApi from '../hooks/api/dataList'
import React from 'react'
import DataList from '../components/dataList/dataList'
import { useSelector } from 'react-redux'
import { getSidebarOpen } from '../store/ux'
import CollectionCardComponent from '../components/collection/collectionCard'
import { getUserProfile } from '../store/user'
import { collectionFilterGroups, collectionSorting } from '../constants/filter'
import TrendingCollections from '../components/dataList/trendingCollections'
import { Icon } from '@iconify/react'
import useWindow from '../hooks/useWindow'

const CollectionsPage = (): JSX.Element => {
  const {
    setLoadMore,
    setFilter,
    setOrder,
    reFetchData,
    setDataListSearchText,
    dataListLoading,
    dataListOrder,
    dataListData,
    dataListSorting,
    dataListMessage,
    dataListInfo,
    dataListFilters,
    dataListSearchText
  } = useDataListApi('/collections', { per_page: 24 }, ['category'], collectionSorting)
  const profile = useSelector(getUserProfile)
  const sidebarCollapse = useSelector<boolean>(getSidebarOpen)
  const { width } = useWindow()
  return (
    <div className="flex dark:bg-madBlack bg-madWhite">
      <Sidebar
        profile={profile}
        backButton={true}
        showProfileLinks={true}
        showProfileHeader={true}
      />
      <div
        style={{
          width: !sidebarCollapse
            ? width > 768
              ? 'calc(100% - 70px)'
              : '100%'
            : 'calc(100% - 420px)'
        }}
      >
        <DataList
          icon="fa6-solid:layer-group"
          preTitle="Our"
          title="Collections"
          reFetchData={reFetchData}
          setFilter={setFilter}
          setOrder={setOrder}
          dataListData={dataListData}
          dataListMessage={dataListMessage}
          dataListLoading={dataListLoading}
          dataListInfo={dataListInfo}
          dataListFilters={dataListFilters}
          dataListFilterGroups={collectionFilterGroups}
          setLoadMore={setLoadMore}
          dataListOrder={dataListOrder}
          dataListSorting={dataListSorting}
          setDataListSearchText={setDataListSearchText}
          dataListSearchText={dataListSearchText}
          preListChildren={
            <>
              {dataListFilters.length < 1 && (
                <div>
                  <div className="mb-0 mt-4 flex flex-col xl:flex-row mx-3 columns-2 items-start">
                    <h2 className="text-2xl dark:text-dark-madWhite text-light-madWhite font-black tracking-[-0.08em] flex items-center mb-6">
                      <Icon icon="fa6-solid:fire-flame-curved" className="h-6 mr-1 text-madPink" />
                      Trending<span className="text-madPink">Collections</span>.
                    </h2>
                  </div>
                  <TrendingCollections listWrapClassName="mx-0 mb-1 xl:-mb-10" />
                  <div className="-mb-6 flex flex-col xl:flex-row mx-3 columns-2 items-start">
                    <h2 className="text-2xl dark:text-dark-madWhite text-light-madWhite font-black tracking-[-0.08em] flex items-center mb-6">
                      <Icon icon="fa6-solid:fire-flame-curved" className="h-6 mr-1 text-madPink" />
                      Popular<span className="text-madPink">Collections</span>.
                    </h2>
                  </div>
                </div>
              )}
            </>
          }
          listRender={(item) => (
            <CollectionCardComponent
              className={`card-wrapper rounded-lg shadow-black/50 shadow-lg border dark:bg-madCarbon bg-madWhite border-gray-500 dark:border-gray-500`}
              key={item.id}
              collection={item}
            />
          )}
          listClassName={`grid grid-cols-1 ${
            !sidebarCollapse ? 'lg:grid-cols-2 xl:grid-cols-3' : 'xl:grid-cols-2'
          } gap-4 2xl:gap-6 my-6 mx-3`}
          wrapperClassName={'flex w-full flex-col dark:bg-madBlack bg-madWhite p-2 md:p-6 relative'}
          filtersClassName={`flex flex-wrap md:flex-nowrap items-center gap-2 fixed top-[72px] right-0 z-[1] p-2 px-4 md:px-8 dark:bg-madCarbon bg-madWhite border-b border-zinc-800 shadow-md dark:shadow-black/50 ${
            !sidebarCollapse ? `left-0 md:left-[72px]` : 'left-[375px] lg:left-[420px]'
          }`}
        />
      </div>
    </div>
  )
}
export default CollectionsPage
