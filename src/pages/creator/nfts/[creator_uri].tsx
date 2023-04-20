import React, { useEffect, useState } from 'react'
import { Sidebar } from '../../../components/sidebar'
import useDataListApi from '../../../hooks/api/dataList'
import useDataObjectApi from '../../../hooks/api/dataObject'
import DataList from '../../../components/dataList/dataList'
import NftCardComponent from '../../../components/nft/nftCard'
import { useSelector } from 'react-redux'
import { getSidebarOpen } from '../../../store/ux'
import { marketplaceFilterGroups, nftSorting } from '../../../constants/filter'

const CreatorNftsPage = (): JSX.Element => {
  const [profile, setProfile] = useState(null)
  const { dataObjectLoading, dataObjectData } = useDataObjectApi('/creator', null, 'creator_uri')
  const sidebarCollapse = useSelector<boolean>(getSidebarOpen)
  const {
    setLoadMore,
    setOrder,
    setFilter,
    dataListLoading,
    dataListOrder,
    dataListData,
    dataListFilters,
    dataListSorting,
    dataListMessage,
    dataListInfo,
    updateData,
    reFetchData,
    setDataListSearchText,
    dataListSearchText
  } = useDataListApi('/nfts', { per_page: 24, order_by: 'created_at' }, ['creator_uri'], nftSorting)

  useEffect(() => {
    if (!dataObjectLoading && dataObjectData) {
      setProfile(dataObjectData)
    }
  }, [dataObjectLoading, dataObjectData])

  return (
    <section className="flex dark:bg-madBlack bg-madWhite">
      <Sidebar
        profile={profile}
        backButton={true}
        showProfileLinks={true}
        showProfileHeader={true}
      />
      <DataList
        icon="fa6-solid:cubes-stacked"
        preTitle="Creator"
        title="NFTs"
        setFilter={setFilter}
        setOrder={setOrder}
        setDataListSearchText={setDataListSearchText}
        dataListSearchText={dataListSearchText}
        dataListData={dataListData}
        dataListMessage={dataListMessage}
        dataListLoading={dataListLoading}
        dataListInfo={dataListInfo}
        dataListFilters={dataListFilters}
        dataListFilterGroups={marketplaceFilterGroups}
        setLoadMore={setLoadMore}
        dataListOrder={dataListOrder}
        dataListSorting={dataListSorting}
        wrapperClassName={'flex w-full flex-col dark:bg-madBlack bg-madWhite p-2 md:p-6 relative'}
        filtersClassName={`flex flex-wrap md:flex-nowrap items-center gap-2 fixed top-[72px] right-0 z-[1] p-2 px-4 md:px-8 dark:bg-madCarbon bg-madWhite border-b border-zinc-800 shadow-md dark:shadow-black ${
          !sidebarCollapse ? `left-0 md:left-[72px]` : 'left-[375px] lg:left-[420px]'
        }`}
        listRender={(item) => (
          <NftCardComponent
            key={item.id}
            nft={item}
            updateData={updateData}
            reFetchData={reFetchData}
          />
        )}
      />
    </section>
  )
}
export default CreatorNftsPage
