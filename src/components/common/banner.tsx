// @typed - MH
import React from 'react'
import { Profile } from '../../types/user'
import { Icon } from '@iconify/react'
import { abbreviateNumber } from '../../utils/utils'
import Follow from '../did/follow'
import Title from './title'

export default function Banner({
  profile,
  updateProfileData
}: {
  profile: Profile
  updateProfileData?: (id, newData) => void
}): JSX.Element {
  return (
    <section className="dark:bg-madOnyx bg-zinc-200 rounded-xl p-4 flex flex-row flex-wrap justify-between mb-2">
      <div className="">
        <Title title={profile?.[profile?.display_name]} className="mr-2 whitespace-nowrap" />
        <div className="my-4 md:mt-2 md:mb-0">
          <Follow creator={profile} updateProfileData={updateProfileData} />
        </div>
      </div>
      <div className="flex">
        <div className="dark:bg-madOnyx bg-zinc-200 rounded-xl p-2 pr-4 pl-0 flex justify-between items-center">
          <div className="flex flex-col">
            <h6 className="uppercase">Total earnings</h6>
            <p className="text-madPink">
              {abbreviateNumber(profile?.volume_price)} <span className="text-madBlue" />
            </p>
          </div>
          <Icon icon="fa6-solid:coins" className="ml-2 opacity-10 text-6xl text-madGray" />
        </div>
        <div className="dark:bg-madOnyx bg-zinc-200 rounded-xl p-2 pr-4 pl-0 flex justify-between items-center">
          <div className="flex flex-col">
            <h6 className="uppercase">Total Likes</h6>
            <p className="text-madPink">
              {profile?.likes_boost_count ? profile?.likes_boost_count : 0}
            </p>
          </div>
          <Icon icon="fa6-solid:heart" className="ml-2 opacity-10 text-6xl text-madGray" />
        </div>
        <div className="dark:bg-madOnyx bg-zinc-200 rounded-xl p-2 pr-4 pl-0 flex justify-between items-center">
          <div className="flex flex-col">
            <h6 className="uppercase">Total Followers</h6>
            <p className="text-madPink">
              {profile?.followers_count ? profile?.followers_count : 0}
            </p>
          </div>
          <Icon icon="fa6-solid:user-group" className="ml-2 opacity-10 text-6xl text-madGray" />
        </div>
      </div>
    </section>
  )
}
