import { abbreviateNumber, formatDate, formatImageUrl } from '../../utils/utils'
import { Icon } from '@iconify/react'
import Socials from './socials'
import React from 'react'
import Button from '../form/button'
import Link from '../common/link'
import Copy from '../common/copy'
import { Tooltip } from '../toolTip/toolTip'
import Follow from './follow'
import Share from '../common/share'
import ConnectButton from '../wallet/button'
import { DataListItemComponent, DidComponent } from '../../types/containers'

export const DidCard = ({
  profile,
  className,
  showPanel,
  setShowPanel,
  updateData
}: DidComponent & DataListItemComponent) => {
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
  const didLevelBtnClasses =
    parseInt(profile?.did_temp_level?.toString()) > 0
      ? 'did-level-bg did-level-bg-' + profile.did_temp_level
      : 'bg-madPink'
  const didLevelBg = profile.did_temp_level > 1 ? `did-bg-${profile.did_temp_level}.jpg` : ''
  const didLevelShadow = `shadow-didLevel${profile?.did_temp_level}`

  return (
    <div
      className={`p-1.5 rounded-lg shadow-sm dark:shadow-lg dark:shadow-madOnyx relative ${didLevel} ${className}`}
    >
      <div
        className="p-1.5 rounded-lg bg-madBlack flex flex-col h-full bg-cover"
        style={{ backgroundImage: `url(${didLevelBg})` }}
      >
        <div className="h-[180px] rounded-t-lg bg-center bg-cover overflow-hidden absolute top-1.5 left-1.5 right-1.5">
          <img src={banner} className="w-full h-full object-cover" alt="User Background" />
        </div>
        <div className="rounded-lg border border-madGray dark:border-madWhite dark:border-opacity-20 relative h-full flex flex-col">
          <div
            className={`relative m-auto mt-6 mb-2 w-[180px] h-[180px] rounded-full p-1.5 ${didLevelShadow} ${didLevel}`}
          >
            <Link href={link} className={`relative overflow-hidden rounded-full w-full h-full`}>
              <img src={avatar} className="w-full h-full object-cover" alt="User Avatar" />
            </Link>
            {(!!profile?.wp_id || profile?.wp_id === 0) && (
              <div
                className={`absolute ${
                  !profile.verified ? 'bottom-1 right-6' : 'bottom-4 right-2'
                }`}
              >
                <Tooltip
                  button={
                    <div
                      className={`rounded-full bg-madPink p-0.5 shadow-madPinkSm ${didLevelBtnClasses}`}
                    >
                      <div className="bg-madBlack w-5 h-5 rounded-full flex items-center justify-center">
                        <Icon icon="fa6-solid:crown" className="text-xs" />
                      </div>
                    </div>
                  }
                >
                  <div className="text-center">OG Creator</div>
                </Tooltip>
              </div>
            )}
            {!!profile?.verified && (
              <div className="absolute bottom-1 right-6">
                <Tooltip
                  button={
                    <div
                      className={`rounded-full bg-madPink p-0.5 shadow-madPinkSm ${didLevelBtnClasses}`}
                    >
                      <div className="bg-madBlack w-5 h-5 rounded-full flex items-center justify-center">
                        <Icon icon="fa6-solid:check" className="text-xs" />
                      </div>
                    </div>
                  }
                >
                  <div className="text-center">Verified</div>
                </Tooltip>
              </div>
            )}
          </div>
          <h2 className="px-4 mb-2 w-full text-2xl text-center font-bold name-ellipsis">
            <Copy
              text={
                <>
                  {profile?.public_name} <span className="text-madPink">.</span>
                </>
              }
              copy={profile?.creator_address}
              success={'Creator address copied'}
            />
          </h2>
          {profile?.id !== 'guest' ? (
            <>
              <div className="px-4 mb-4 flex justify-center">
                <Follow creator={profile} updateProfileData={updateData} />
              </div>
              <div className="px-4 mb-6 flex gap-2 px-6 flex-wrap justify-center">
                <Share
                  url={link}
                  className="inline-flex"
                  btnClassName="flex items-center justify-center w-5 h-5 mt-auto dark:text-madBlack light:text-madWhite dark:bg-madGray bg-madWhite rounded-full dark:hover:bg-dark-madCarbon hover:bg-light-madCarbon'"
                />
                <Socials socials={profile?.integrations} />
              </div>
            </>
          ) : (
            <div className="m-auto mb-6">
              <span>Start your web3 journey today</span>
              <ConnectButton className="m-auto mt-4" />
            </div>
          )}
          <div className="px-4 mt-auto mb-3 grid grid-cols-2 md:grid-cols-4 gap-3 w-full text-center">
            <div
              className={`rounded shadow-md dark:shadow-black text-xs flex items-center justify-center p-[1px] ${didLevelBtnClasses}`}
            >
              <span className="bg-madBlack p-2 px-2 w-full rounded flex items-center justify-center">
                <Icon icon="fa6-solid:user-plus" className="text-sm text-madPink mr-1" />
                {abbreviateNumber(profile?.followers_count || 0)}
              </span>
            </div>
            <div
              className={`rounded shadow-md dark:shadow-black text-xs flex items-center justify-center p-[1px] ${didLevelBtnClasses}`}
            >
              <span className="bg-madBlack p-2 px-2 w-full rounded flex items-center justify-center">
                <Icon icon="fa6-solid:heart" className="text-sm text-madPink mr-1" />
                {abbreviateNumber(profile?.likes_boost_count || 0)}
              </span>
            </div>
            <div
              className={`rounded shadow-md dark:shadow-black text-xs flex items-center justify-center p-[1px] ${didLevelBtnClasses}`}
            >
              <span className="bg-madBlack p-2 px-2 w-full rounded flex items-center justify-center">
                <Icon icon="fa6-solid:fire-flame-curved" className="text-sm text-madPink mr-1" />
                {abbreviateNumber(profile?.volume || 0)}
              </span>
            </div>
            <div
              className={`rounded shadow-md dark:shadow-black text-xs flex items-center justify-center p-[1px] ${didLevelBtnClasses}`}
            >
              <span className="bg-madBlack p-2 px-2 w-full rounded flex items-center justify-center">
                <Icon icon="fa6-solid:cubes-stacked" className="text-sm text-madPink mr-1" />
                {abbreviateNumber(profile?.nfts_count || 0)}
              </span>
            </div>
          </div>
          <div className="border-b border-madBlack border-opacity-20 dark:border-madWhite dark:border-opacity-20 mx-4 mt-2" />
          <div className="px-4 py-2 flex flex-wrap justify-center text-xs">
            <Button
              colour="transparent"
              hoverColour="madGray"
              onClick={() => setShowPanel('about')}
              className="hover:text-madPink hover:border-none border-none"
            >
              About
            </Button>
            <Button
              colour="transparent"
              hoverColour="madGray"
              onClick={() => setShowPanel('achievements')}
              className="hover:text-madPink hover:border-none border-none"
            >
              Achievements
            </Button>
            <Button
              colour="transparent"
              hoverColour="madGray"
              onClick={() => setShowPanel('rating')}
              className="hover:text-madPink hover:border-none border-none"
            >
              Ranking
            </Button>
          </div>
        </div>
        {showPanel && showPanel !== 'idle' && (
          <div className="bg-madBlack bg-opacity-80 rounded-md flex flex-col items-center p-4 absolute top-1.5 left-1.5 right-1.5 bottom-1.5 animate-in fade-in zoom-in">
            <h4 className="text-xl mb-2 text-center uppercase">{showPanel}</h4>
            <div className="mb-auto bg-madCarbon w-full p-4 rounded-lg">
              {showPanel === 'about' ? (
                <>
                  <div className="flex flex-row gap-2 mb-2 justify-between">
                    <span className="text-madGray">Member since:</span>
                    <span className="text-right">{formatDate(profile.created_at)}</span>
                  </div>
                  <div className="flex flex-row gap-2 justify-between">
                    <span className="text-madGray">Categories:</span>
                    <span className="text-right">
                      {profile.collection_categories?.map((c, index) => (
                        <span key={c.id} className={`text-${c.color}`}>
                          {c.name}
                          {index !== profile.collection_categories.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </span>
                  </div>
                </>
              ) : showPanel === 'achievements' ? (
                <div className="text-center">Coming soon...</div>
              ) : (
                <div className="text-center">Coming soon...</div>
              )}
            </div>
            <Button colour="madPink" hoverColour="madBlack" onClick={() => setShowPanel('idle')}>
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
