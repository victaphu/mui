import React, { useEffect, useState } from 'react'
import useDataListApi from '../../hooks/api/dataList'
import DataList from '../dataList/dataList'
import Loader from '../common/loader'
import { useSelector } from 'react-redux'
import { getUserProfile } from '../../store/user'
import ConnectButton from '../wallet/button'
import { Icon } from '@iconify/react'
import { Profile } from '../../types/user'
import Follow from '../did/follow'
import FeedCardComponent from '../feed/feedCard'
import FeedContainer from '../../containers/feed'

export default function DashboardFeed({
  profileData,
  updateProfileData,
  params = {},
  dataUri = '/follower/activity',
  noDataMessage = 'There are no posts from people you follow. Follow more creators to view their activity!'
}: {
  profileData?: Profile
  updateProfileData?: (id, newData) => void
  params?
  dataUri?: string
  noDataMessage?: string
}) {
  const profile = useSelector(getUserProfile)
  const {
    updateData,
    setLoadMore,
    setOrder,
    setFilter,
    dataListLoading,
    dataListData,
    dataListFilters,
    dataListMessage,
    dataListInfo
  } = useDataListApi(
    dataUri,
    { ...{ per_page: 10, order_by: 'created_at', order_dir: 'desc' }, ...params },
    null,
    null,
    noDataMessage
  )
  const [scrollBottom, setScrollBottom] = useState<number>(0)
  const [scrolled, setScrolled] = useState<boolean>(false)

  useEffect(() => {
    const onScroll = () => {
      setScrollBottom(window.scrollY + window.innerHeight)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.addEventListener('scroll', onScroll)
  })

  useEffect(() => {
    if (scrolled && !dataListLoading) {
      setScrolled(false)
    }
  }, [scrolled, dataListLoading])

  useEffect(() => {
    const documentHeight = document.body.scrollHeight
    const modifier = 600
    if (
      parseInt(scrollBottom.toString()) > parseInt((documentHeight - modifier - 1).toString()) &&
      dataListInfo.next_page_url &&
      !scrolled
    ) {
      setLoadMore()
      setScrolled(true)
    }
  }, [scrolled, scrollBottom, dataListInfo, setLoadMore])

  return (
    <div className="relative h-full">
      <div className="dark:bg-madOnyx bg-zinc-200 rounded-xl p-4 flex flex-col mb-2">
        <div className="flex flex-col sm:flex-row font-black tracking-[-0.08em] sm:items-end">
          <h2 className="text-2xl dark:text-dark-madWhite text-light-madWhite font-black tracking-[-0.08em] flex items-center">
            <Icon icon="fa6-solid:list" className="h-6 text-madPink mr-1" />
            Creator
            <span className="text-madPink ml-1">Feed</span>.
          </h2>
        </div>
      </div>
      {profileData && (
        <>
          {(profileData.is_following.length || (profile && profile.id === profileData.id)) && (
            <DataList
              hideLoader={true}
              exposedFilters={true}
              setFilter={setFilter}
              setOrder={setOrder}
              dataListFilters={dataListFilters}
              dataListData={dataListData}
              dataListMessage={dataListMessage}
              dataListMessageClassName={'dark:bg-madOnyx bg-zinc-200 rounded-xl p-4 flex flex-col'}
              dataListLoading={dataListLoading}
              wrapperClassName="w-full min-h-table relative mb-4"
              listClassName="w-full"
              filtersClassName="justify-end flex"
              listRender={(data, index) => (
                <FeedContainer
                  key={index}
                  Component={FeedCardComponent}
                  feedData={data}
                  updateData={updateData}
                />
              )}
            />
          )}
          {profile &&
            profileData &&
            !profileData.is_following.length &&
            profile.id !== profileData.id && (
              <div className="dark:bg-madOnyx bg-zinc-200 rounded-xl p-4 flex flex-col">
                <p className="mb-3">Follow this creator to view their activity.</p>
                <div>
                  <Follow creator={profileData} updateProfileData={updateProfileData} />
                </div>
              </div>
            )}
          {!profile && (
            <div className="dark:bg-madOnyx bg-zinc-200 rounded-xl p-4 flex flex-col">
              <p className="mb-3">
                Connect your wallet and follow this creator to view their activity.
              </p>
              <div>
                <ConnectButton />
              </div>
            </div>
          )}
          {!dataListLoading && dataListData.length > 1 && !dataListInfo.next_page_url && (
            <div className="dark:bg-madOnyx bg-zinc-200 rounded-xl p-4">
              That&apos;s all from <span className="text-madPink">{profileData.public_name}</span>!
              Check back soon ...
            </div>
          )}
        </>
      )}
      {dataListLoading && <Loader className="my-5" />}
    </div>
  )
}
