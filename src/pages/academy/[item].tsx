import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { Sidebar } from '../../components/sidebar'
import { AcademyItem } from '../../types/academy'
import Popup from '../../components/common/popup'
import Loader from '../../components/common/loader'
import YouTube from 'react-youtube'
import useCrudObjectApi from '../../hooks/api/crudObject'
import { useDispatch, useSelector } from 'react-redux'
import { getUserAsync, getUserProfile } from '../../store/user'
import AcademyIcons from '../../components/academy/academyIcons'
import useDataObjectApi from '../../hooks/api/dataObject'
import DataList from '../../components/dataList/dataList'
import useDataListApi from '../../hooks/api/dataList'
import useWindow from '../../hooks/useWindow'
import { getSidebarOpen } from '../../store/ux'
import { useRouter } from 'next/router'
import AcademyCardComponent from '../../components/academy/academyCard'

const AcademyItemPage = (): JSX.Element => {
  const { dataObjectData } = useDataObjectApi('/academy/item', null, 'item')
  const { setLoadMore, dataListLoading, dataListData, dataListMessage, reFetchData } =
    useDataListApi('/academy', { per_page: 24, order_by: 'order', order_dir: 'asc' }, ['item'])
  const [popup, showPopup] = useState<AcademyItem>(null)
  const { postData } = useCrudObjectApi()
  const { width } = useWindow()
  const profile = useSelector(getUserProfile)
  const sidebarCollapse = useSelector<boolean>(getSidebarOpen)
  const [filterHeight, setFilterHeight] = useState<number>(70)
  const dispatch = useDispatch()
  const opts = {
    height: '340',
    width: '600',
    playerVars: {
      autoplay: 1,
      allowFullScreen: 1
    }
  }

  const router = useRouter()
  const [currentItem, setCurrentItem] = useState<string>('')
  useEffect(() => {
    if (router?.query?.item && currentItem != router?.query?.item) {
      setCurrentItem(router.query.item.toString())
    }
  }, [router, currentItem, setCurrentItem])

  function handleStarted(video) {
    postData(`academy/item/${video.id}/1`, null, true).then(() => {
      dispatch(getUserAsync())
    })
  }

  function handleEnded(video) {
    postData(`academy/item/${video.id}/2`, null, true).then(() => {
      dispatch(getUserAsync())
    })
  }

  return (
    <>
      {popup && (
        <Popup
          closePopup={() => {
            showPopup(null)
          }}
          title={`${dataObjectData.order}. ${dataObjectData.title}`}
        >
          <div className="relative flex items-center">
            <YouTube
              videoId={dataObjectData.video}
              opts={opts}
              onEnd={() => {
                handleEnded(dataObjectData)
              }}
              onPlay={() => {
                handleStarted(dataObjectData)
              }}
              className="m-auto relative z-10 w-full p-b-video"
              iframeClassName="w-full h-full absolute"
            />
            <div className="absolute top-0 bottom-0 left-0 right-0 m-auto w-8 h-8">
              <Loader />
            </div>
          </div>
        </Popup>
      )}
      <section className="flex dark:bg-madBlack bg-madWhite">
        <Sidebar
          profile={profile}
          backButton={true}
          showProfileLinks={true}
          showProfileHeader={true}
          showAcademy={true}
          academyItem={dataObjectData}
        />
        <div
          className="mt-2 sm:mt-6"
          style={{
            width: sidebarCollapse
              ? 'calc(100% - 420px)'
              : width < 768
              ? '100%'
              : 'calc(100% - 72px)'
          }}
        >
          <div style={{ height: filterHeight + 'px' }} />
          <div
            onClick={() => showPopup(dataObjectData)}
            className="flex relative rounded-lg overflow-hidden mx-2 sm:mx-6 mb-0"
          >
            <Icon
              icon="fa-solid:play-circle"
              className="absolute top-0 bottom-0 left-0 right-0 m-auto shadow-black/50 shadow-md rounded-full dark:bg-madBlack bg-madWhite text-6xl"
            />
            <img
              alt="Video Cover Image"
              src={dataObjectData.image || '/video-cover.jpeg'}
              className=" w-full object-cover self-center"
            />
          </div>
          <div className="py-6 px-4 mx-2 sm:mx-6">
            <div className="flex sm:flex-col">
              <div>
                <h2 className="text-2xl font-bold">
                  {dataObjectData.order - 1}. {dataObjectData.title}{' '}
                  <span className="ml-2">
                    <AcademyIcons academyItem={dataObjectData} />
                  </span>
                </h2>
                <hr className="my-4 border-madPink border-2 max-w-[200px]" />
                <div
                  className="content"
                  dangerouslySetInnerHTML={{ __html: dataObjectData.intro }}
                />
                <hr className="my-4" />
                <div
                  className="content"
                  dangerouslySetInnerHTML={{ __html: dataObjectData.content }}
                />
              </div>
            </div>
          </div>

          <div className="overflow-auto mx-6 sm:mx-10">
            <h2 className="text-2xl font-bold">
              <Icon icon="fa6-solid:cubes-stacked" className="h-6 mr-2 text-madPink" />
              More from this module
            </h2>
            <DataList
              icon="fa6-solid:graduation-cap"
              title="Academy"
              hideSpacer={true}
              setFilterHeight={setFilterHeight}
              dataListData={dataListData}
              dataListLoading={dataListLoading}
              setLoadMore={setLoadMore}
              reFetchData={reFetchData}
              filtersClassName={`flex flex-wrap md:flex-nowrap items-center gap-2 fixed top-[72px] right-0 z-[1] p-2 px-4 md:px-8 dark:bg-madCarbon bg-madWhite border-b border-zinc-800 shadow-md dark:shadow-black ${
                !sidebarCollapse ? `left-0 md:left-[72px]` : 'left-[375px] lg:left-[420px]'
              }`}
              wrapperClassName={'flex w-full overflow-auto'}
              listClassName={'flex w-full overflow-auto gap-4 py-4'}
              listRender={(item) => (
                <AcademyCardComponent academyItem={item} currentItem={currentItem} />
              )}
              dataListMessage={dataListMessage}
            />
          </div>
        </div>
      </section>
    </>
  )
}
export default AcademyItemPage
