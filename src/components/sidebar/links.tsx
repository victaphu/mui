import { Icon } from '@iconify/react'
import Link from '../common/link'
import React from 'react'
import { useRouter } from 'next/router'

const LinksComponent = (props): JSX.Element => {
  const { showSidebar, profile } = props
  const router = useRouter()
  return (
    <>
      {profile && (
        <>
          <Link
            href={`/creator/${profile?.uri}`}
            className={`${
              showSidebar ? 'p-1 mb-1' : 'mb-4'
            } text-center hover:text-madPink ease-in duration-300 ${
              router.pathname === '/view-profile' ? 'text-madPink' : ''
            }`}
          >
            <Icon icon="fa6-solid:user" className="h-8 w-8 mb-1" />
            <p className="text-xs w-full text-center lg:block">Profile</p>
          </Link>
          <Link
            href={`/creator/sales/${profile?.uri}`}
            className={`${
              showSidebar ? 'p-1 mb-1' : 'mb-0'
            } text-center hover:text-madPink ease-in duration-300 ${
              router.pathname.includes('creator/sales') ? 'text-madPink' : ''
            }`}
          >
            <Icon icon="fa6-solid:fire-flame-curved" className="h-8 w-8 mb-1" />
            <p className="text-xs w-full text-center lg:block">Sales</p>
          </Link>
          <Link
            href={`/creator/collections/${profile?.uri}`}
            className={`${
              showSidebar ? 'p-1 mb-1' : 'mb-0'
            } text-center hover:text-madPink ease-in duration-300 ${
              router.pathname.includes('/creator/collections') ? 'text-madPink' : ''
            }`}
          >
            <Icon icon="fa6-solid:layer-group" className="h-8 w-8 mb-1" />
            <p className="text-xs w-full text-center lg:block name-ellipsis">Collections</p>
          </Link>
          <Link
            href={`/creator/nfts/${profile?.uri}`}
            className={`${
              showSidebar ? 'p-1 mb-1' : 'mb-0'
            } text-center hover:text-madPink ease-in duration-300 ${
              router.pathname.includes('creator/nfts') ? 'text-madPink' : ''
            }`}
          >
            <Icon icon="fa6-solid:cubes-stacked" className="h-8 w-8 mb-1" />
            <p className="text-xs w-full text-center lg:block">NFTs</p>
          </Link>
        </>
      )}
    </>
  )
}

export default LinksComponent
