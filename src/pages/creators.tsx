import { Sidebar } from '../components/sidebar'
import useDataListApi from '../hooks/api/dataList'
import React from 'react'
import DataList from '../components/dataList/dataList'
import { useSelector } from 'react-redux'
import { getSidebarOpen } from '../store/ux'
import { getUserProfile } from '../store/user'
import { creatorFilterGroups, creatorSorting } from '../constants/filter'
import { DidCard } from '../components/did/didCard'
import DidContainer from '../containers/did'

const CreatorsPage = (): JSX.Element => {
  const {
    setFilter,
    setLoadMore,
    setOrder,
    reFetchData,
    dataListLoading,
    dataListOrder,
    dataListData,
    dataListSorting,
    dataListMessage,
    dataListInfo,
    dataListFilters,
    setDataListSearchText,
    dataListSearchText,
    updateData
  } = useDataListApi(
    '/creators',
    { per_page: 24, order_by: 'followers_count' },
    ['category', 'projects'],
    creatorSorting
  )
  const profile = useSelector(getUserProfile)
  const sidebarCollapse = useSelector<boolean>(getSidebarOpen)
  return (
    <section className="flex dark:bg-madBlack bg-madWhite">
      <Sidebar
        profile={profile}
        backButton={true}
        showProfileLinks={true}
        showProfileHeader={true}
      />
      <DataList
        icon="fa6-solid:users"
        preTitle="Our"
        title="Creators"
        reFetchData={reFetchData}
        setFilter={setFilter}
        setOrder={setOrder}
        dataListData={dataListData}
        dataListMessage={dataListMessage}
        dataListLoading={dataListLoading}
        dataListInfo={dataListInfo}
        dataListFilters={dataListFilters}
        dataListFilterGroups={creatorFilterGroups}
        setDataListSearchText={setDataListSearchText}
        dataListSearchText={dataListSearchText}
        setLoadMore={setLoadMore}
        dataListOrder={dataListOrder}
        dataListSorting={dataListSorting}
        listRender={(item, index) => (
          <DidContainer
            Component={DidCard}
            key={item.id}
            profile={item}
            updateData={updateData}
            reFetchData={reFetchData}
            listIndex={index}
          />
        )}
        wrapperClassName={'flex w-full flex-col dark:bg-madBlack bg-madWhite p-2 md:p-6 relative'}
        filtersClassName={`flex flex-wrap md:flex-nowrap items-center gap-2 fixed top-[72px] right-0 z-[1] p-2 px-4 md:px-8 dark:bg-madCarbon bg-madWhite border-b border-zinc-800 shadow-md dark:shadow-black ${
          !sidebarCollapse ? `left-0 md:left-[72px]` : 'left-[375px] lg:left-[420px]'
        }`}
      />
    </section>
  )
}
export default CreatorsPage
