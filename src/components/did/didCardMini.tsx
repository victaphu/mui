import { formatImageUrl } from '../../utils/utils'
import Socials from './socials'
import React from 'react'
import Link from '../common/link'
import { DidComponent } from '../../types/containers'

export const DidCardMini = ({ profile, className }: DidComponent) => {
  const banner = profile?.img_banner
    ? formatImageUrl(profile?.img_banner, 320, 190)
    : '/profile-bg-default.png'
  const avatar = profile?.img_avatar
    ? formatImageUrl(profile?.img_avatar, 320, 320)
    : '/profile-icon-default.png'
  const link = profile?.id === 'guest' ? '#' : `/creator/${profile?.creator_address}`
  const didLevel =
    parseInt(profile?.did_temp_level?.toString()) > 0
      ? 'did-level-bg did-level-bg-' + profile.did_temp_level
      : 'bg-madWhite dark:bg-madBlack'

  return (
    <div
      className={`p-0.5 rounded-lg shadow-sm dark:shadow-lg dark:shadow-madOnyx relative ${didLevel} ${className}`}
    >
      <div className="p-1 rounded-lg bg-madBlack flex flex-col h-full">
        <div className="h-[120px] rounded-t-lg bg-center bg-cover overflow-hidden absolute top-0.5 left-0.5 right-0.5">
          <img src={banner} className="w-full h-full object-cover" alt="User Background" />
        </div>
        <div className="rounded-lg border border-madGray dark:border-madWhite dark:border-opacity-10 relative h-full flex flex-col">
          <div
            className={`relative m-auto mt-20 mb-2 w-[54px] h-[54px] rounded-full p-0.5 shadow-madPinkLg ${didLevel}`}
          >
            <Link href={link} className="relative overflow-hidden rounded-full p-b-square">
              <img src={avatar} className="absolute w-full h-full object-cover" alt="User Avatar" />
            </Link>
          </div>
          {profile?.id !== 'guest' && (
            <div className="px-4 pt-4 mb-6 flex gap-2 px-6 flex-wrap justify-center">
              <Socials socials={profile?.integrations} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
