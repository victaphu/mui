import React from 'react'
import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import { Sidebar } from '../components/sidebar'
import Loader from '../components/common/loader'
import { useSelector } from 'react-redux'
import { getUserProfile } from '../store/user'
import { getCurrentNetwork } from '../store/web3'
import { useWeb3React } from '@web3-react/core'
import Manager from '../components/manager/manager'
import Button from '../components/form/button'
import useCrudObjectApi from '../hooks/api/crudObject'
import DashboardFeed from '../components/dataList/dashboardFeed'
import DashboardCommunity from '../components/dataList/dashboardCommunity'
import DashboardAcademy from '../components/dataList/dashboardAcademy'
import DashboardNfts from '../components/dataList/dashboardNfts'
import DashboardCollections from '../components/dataList/dashboardCollections'
import Banner from '../components/common/banner'

const DashboardPage = (): JSX.Element => {
  const profile = useSelector(getUserProfile)
  const network = useSelector(getCurrentNetwork)
  const { account } = useWeb3React()
  const { getData, dataLoading } = useCrudObjectApi()
  const [isManager, setIsManager] = useState<boolean>(false)

  useEffect(() => {
    setIsManager(network.addresses['1.0']?.deployer?.toLowerCase() === account?.toLowerCase())
  }, [account, network])

  return (
    <section className="flex dark:bg-madCarbon bg-madWhite">
      <Sidebar
        profile={profile}
        backButton={true}
        showProfileLinks={true}
        showProfileHeader={true}
      />
      <div className="flex w-full flex-col min-h-screen dark:bg-madBlack bg-madWhite p-2 pb-6 md:px-4">
        <Banner profile={profile} />
        <section className="flex grid gap-2 grid-cols-1 md:grid-cols-12">
          <div className="col-span-6 xl:col-span-5 2xl:col-span-4 order-1 lg:order-0 h-full">
            <DashboardFeed profileData={profile} />
          </div>
          <div className="col-span-6 xl:col-span-7 2xl:col-span-8 order-0 lg:order-1 flex flex-col gap-2">
            <div className="dark:bg-madOnyx bg-zinc-200 rounded-xl p-4">
              {profile && <DashboardCommunity profile={profile} />}
            </div>
            <div className="dark:bg-madOnyx bg-zinc-200 rounded-xl p-4">
              <DashboardAcademy />
            </div>
            <div className="dark:bg-madOnyx bg-zinc-200 rounded-xl p-4">
              {profile && <DashboardNfts profile={profile} />}
            </div>
            <div className="dark:bg-madOnyx bg-zinc-200 rounded-xl p-4">
              {profile && <DashboardCollections profile={profile} />}
            </div>
            {network.chain === 1666600000 && (
              <section className="bg-zinc-200 dark:bg-madOnyx rounded-xl p-4 flex flex-col justify-between">
                <div className="flex items-center">
                  <Icon icon="fa6-solid:cubes-stacked" className={`mr-1 text-xl text-madPink`} />
                  <h6 className="font-bold text-xl">
                    Import <span className={`text-madPink`}>Davinci</span> NFTs.
                  </h6>
                </div>
                <div className="flex flex-col mt-4">
                  {dataLoading ? (
                    <>
                      <p>Please wait while we import your Davinci NFTs</p>
                      <Loader className="py-1 m-auto" />
                    </>
                  ) : (
                    <>
                      <p className="mb-1 mb-4">
                        Click the button to import your Davinci Image and Video collection NFTs. It
                        can take some time before the NFT name, description and images is retrieved
                        and visible while we index the metadata, please be patient during this
                        process.
                        <br />
                        <br />
                        After your NFTs have imported, you can head over to your NFTs page to list
                        them on the MAD marketplace.
                      </p>
                      <Button
                        className="m-auto ml-0"
                        colour="madPink"
                        hoverColour="madBlack"
                        onClick={() => getData('nft/external/sync')}
                      >
                        Import my Davinci NFTs
                      </Button>
                    </>
                  )}
                </div>
              </section>
            )}
            <section className="bg-zinc-200 dark:bg-madOnyx rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center">
                <Icon icon="fa:refresh" className={`mr-1 text-xl text-madPink`} />
                <h6 className="font-bold text-xl">
                  Sync <span className={`text-madPink`}>Account</span> NFTs.
                </h6>
              </div>
              <div className="flex flex-col mt-4">
                {dataLoading ? (
                  <>
                    <p>Please wait while we import your account balances</p>
                    <Loader className="py-1 m-auto" />
                  </>
                ) : (
                  <>
                    <p className="mb-1 mb-4">
                      Click the button to sync your account balances, or if you’re having trouble
                      viewing your latest NFTs on the website.
                    </p>
                    <Button
                      className="m-auto ml-0"
                      colour="madPink"
                      hoverColour="madBlack"
                      onClick={() => getData('sync/nft/account')}
                    >
                      Import my balances
                    </Button>
                  </>
                )}
              </div>
            </section>

            {isManager && <Manager />}
          </div>
        </section>
      </div>
    </section>
  )
}
export default DashboardPage
