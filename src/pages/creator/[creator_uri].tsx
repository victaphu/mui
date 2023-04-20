import React from 'react'
import { useEffect, useState } from 'react'
import useDataObjectApi from '../../hooks/api/dataObject'
import { Sidebar } from '../../components/sidebar'
import DashboardFeed from '../../components/dataList/dashboardFeed'
import DashboardCommunity from '../../components/dataList/dashboardCommunity'
import DashboardNfts from '../../components/dataList/dashboardNfts'
import DashboardCollections from '../../components/dataList/dashboardCollections'
import Banner from '../../components/common/banner'

const CreatorPage = (): JSX.Element => {
  const { dataObjectLoading, dataObjectData, reloadData } = useDataObjectApi(
    '/creator',
    null,
    'creator_uri'
  )
  const [profileData, setProfileData] = useState(null)

  useEffect(() => {
    if (dataObjectData && !dataObjectLoading) {
      setProfileData(dataObjectData)
    }
    return () => {
      setProfileData(null)
    }
  }, [dataObjectData, dataObjectLoading])

  return (
    <section className="flex dark:bg-madBlack bg-madWhite">
      <Sidebar
        profile={profileData}
        backButton={true}
        showProfileLinks={true}
        showProfileHeader={true}
      />
      <div className="flex w-full flex-col min-h-screen dark:bg-madBlack bg-madWhite p-2 pb-6 md:px-4">
        <Banner profile={profileData} updateProfileData={reloadData} />
        <section className="flex grid gap-2 grid-cols-1 md:grid-cols-12">
          <div className="col-span-6 xl:col-span-5 2xl:col-span-4 order-1 lg:order-0 h-full">
            {profileData?.uri && (
              <DashboardFeed
                updateProfileData={reloadData}
                profileData={profileData}
                dataUri={`/creator/activity/${profileData.uri}`}
                noDataMessage="This creator has no activity, check back soon!"
              />
            )}
          </div>
          <div className="col-span-6 xl:col-span-7 2xl:col-span-8 order-0 lg:order-1 flex flex-col gap-2">
            <div className="dark:bg-madOnyx bg-zinc-200 rounded-xl p-4 flex flex-col">
              {profileData?.uri && (
                <DashboardNfts
                  profile={profileData}
                  title="NFTs"
                  preTitle="Creator"
                  noDataMessage="This creator has no NFTs, check back soon!"
                  buttonText="All creator NFTs"
                  showCreateButton={false}
                />
              )}
            </div>
            <div className="dark:bg-madOnyx bg-zinc-200 rounded-xl p-4 flex flex-col">
              {profileData?.uri && (
                <DashboardCollections
                  profile={profileData}
                  title="Collections"
                  preTitle="Creator"
                  noDataMessage="This creator has no Collections, check back soon!"
                  buttonText="All creator Collections"
                  showCreateButton={false}
                />
              )}
            </div>
            <div className="dark:bg-madOnyx bg-zinc-200 rounded-xl p-4 flex flex-col">
              {profileData?.uri && (
                <DashboardCommunity
                  profile={profileData}
                  title="Community"
                  preTitle="Creator"
                  buttonText={null}
                  noDataMessage="This creator has no followers. Join their community by following and show your support!"
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}
export default CreatorPage
