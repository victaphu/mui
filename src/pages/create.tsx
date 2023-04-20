// @typed v1
import React from 'react'
import { useSelector } from 'react-redux'
import Minter from '../components/minter/minter'
import { Sidebar } from '../components/sidebar'
import { getUserProfile } from '../store/user'
import DropContainer from '../containers/drop'
import NftCreate from '../components/nft/nftCreate'
import Title from '../components/common/title'
import Link from '../components/common/link'
import { Icon } from '@iconify/react'

const CreatePage = (): JSX.Element => {
  const profile = useSelector(getUserProfile)
  return (
    <section className="flex dark:bg-madCarbon bg-madWhite">
      <Sidebar
        profile={profile}
        backButton={true}
        showProfileLinks={true}
        showProfileHeader={true}
      />
      <div className="flex w-full w-full flex-col min-h-screen dark:bg-madBlack bg-madWhite p-2 py-6 md:px-4">
        <Title className="flex flex-col mb-6" title="Create" subTitle="NFT">
          <p className="font-normal md:w-2/3 max-w-[720px] text-madGray text-sm mt-4">
            Create your NFT metadata and upload your assets below. To find out how to create your
            ideal NFT and what you should choose, head over to the &nbsp;&nbsp;
            <Link href="/academy" className="inline text-madPink whitespace-nowrap">
              <>
                <Icon icon="fa6-solid:graduation-cap" className="mr-1" />
                Academy
              </>
            </Link>
          </p>
        </Title>
        <DropContainer Component={NftCreate} />
      </div>
      <Minter />
    </section>
  )
}
export default CreatePage
