import React, { useEffect, useState } from 'react'
import { Sidebar } from '../../../components/sidebar'
import useDataListApi from '../../../hooks/api/dataList'
import useDataObjectApi from '../../../hooks/api/dataObject'
import DataList from '../../../components/dataList/dataList'
import { useSelector } from 'react-redux'
import { getSidebarOpen } from '../../../store/ux'
import CollectionCardComponent from '../../../components/collection/collectionCard'
import { collectionSorting, myCollectionFilterGroups } from '../../../constants/filter'

const CreatorCollectionsPage = (): JSX.Element => {
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
    setDataListSearchText,
    dataListSearchText
  } = useDataListApi(
    '/collections',
    { per_page: 24 },
    ['category', 'creator_uri', 'owner_from_creator_uri'],
    collectionSorting
  )

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
        icon="fa6-solid:layer-group"
        preTitle="Creator"
        title="Collections"
        setFilter={setFilter}
        setOrder={setOrder}
        setDataListSearchText={setDataListSearchText}
        dataListSearchText={dataListSearchText}
        dataListData={dataListData}
        dataListMessage={dataListMessage}
        dataListLoading={dataListLoading}
        dataListInfo={dataListInfo}
        dataListFilters={dataListFilters}
        dataListFilterGroups={myCollectionFilterGroups}
        setLoadMore={setLoadMore}
        dataListOrder={dataListOrder}
        dataListSorting={dataListSorting}
        listClassName={`grid grid-cols-1 ${
          !sidebarCollapse ? 'lg:grid-cols-2 xl:grid-cols-3' : 'xl:grid-cols-2'
        } gap-4 2xl:gap-6 my-6 mx-3`}
        wrapperClassName={'flex w-full flex-col dark:bg-madBlack bg-madWhite p-2 md:p-6 relative'}
        filtersClassName={`flex flex-wrap md:flex-nowrap items-center gap-2 fixed top-[72px] right-0 z-[1] p-2 px-4 md:px-8 dark:bg-madCarbon bg-madWhite border-b border-zinc-800 shadow-md dark:shadow-black ${
          !sidebarCollapse ? `left-0 md:left-[72px]` : 'left-[375px] lg:left-[420px]'
        }`}
        listRender={(item) => (
          <CollectionCardComponent
            className={`card-wrapper rounded-lg dark:shadow-black shadow-lg border dark:bg-madCarbon bg-madWhite border-gray-500`}
            key={item.id}
            collection={item}
          />
        )}
      />
    </section>
  )
}
export default CreatorCollectionsPage
