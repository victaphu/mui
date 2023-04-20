import { Sidebar } from '../components/sidebar'
import useDataListApi from '../hooks/api/dataList'
import React from 'react'
import DataList from '../components/dataList/dataList'
import useWindow from '../hooks/useWindow'
import TopCreators from '../components/dataList/topCreators'
import { useSelector } from 'react-redux'
import { getSidebarOpen } from '../store/ux'
import { getUserProfile } from '../store/user'
import { creatorSorting, projectFilterGroups } from '../constants/filter'
import DidContainer from '../containers/did'
import { DidCard } from '../components/did/didCard'

// Main Page Content

const ProjectsPage = (): JSX.Element => {
  const {
    setLoadMore,
    setOrder,
    setFilter,
    reFetchData,
    updateData,
    dataListLoading,
    dataListOrder,
    dataListData,
    dataListSorting,
    dataListMessage,
    dataListFilters,
    setDataListSearchText,
    dataListSearchText
  } = useDataListApi('/creators', { per_page: 3, projects: true }, ['category'], creatorSorting)
  const { width } = useWindow()
  const profile = useSelector(getUserProfile)
  const sidebarCollapse = useSelector<boolean>(getSidebarOpen)
  return (
    <section className="flex">
      <Sidebar
        profile={profile}
        backButton={true}
        showProfileLinks={true}
        showProfileHeader={true}
      />
      <div
        style={{
          width: sidebarCollapse ? 'calc(100% - 420px)' : width < 768 ? '100%' : 'calc(100% - 72px)'
        }}
      >
        <DataList
          icon="fa6-solid:handshake"
          preTitle="Our"
          title="Projects"
          setFilter={setFilter}
          setOrder={setOrder}
          reFetchData={reFetchData}
          dataListData={dataListData}
          dataListMessage={dataListMessage}
          dataListLoading={dataListLoading}
          dataListFilters={dataListFilters}
          setDataListSearchText={setDataListSearchText}
          dataListSearchText={dataListSearchText}
          dataListFilterGroups={projectFilterGroups}
          setLoadMore={setLoadMore}
          dataListOrder={dataListOrder}
          dataListSorting={dataListSorting}
          wrapperClassName={'flex w-full flex-col dark:bg-madBlack bg-madWhite p-2 md:p-6 relative'}
          filtersClassName={`flex flex-wrap md:flex-nowrap items-center gap-2 fixed top-[72px] right-0 z-[1] p-2 px-4 md:px-8 dark:bg-madCarbon bg-madWhite border-b border-zinc-800 shadow-md dark:shadow-black ${
            !sidebarCollapse ? `left-0 md:left-[72px]` : 'left-[375px] lg:left-[420px]'
          }`}
          listRender={(item, index) => (
            <DidContainer
              Component={DidCard}
              key={item.id}
              profile={item}
              updateData={updateData}
              reFetchData={reFetchData}
              listIndex={index}
              className={'min-w-[300px] max-w-[300px]'}
            />
          )}
        />
        <div className="mx-10">
          <TopCreators
            perPage={50}
            preTitle="Search"
            title="Projects"
            params={{ projects: true }}
          />
        </div>
      </div>
    </section>
  )
}
export default ProjectsPage
