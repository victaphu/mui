import React from 'react'
import { abbreviateNumber, formatImageUrl, formatTimeSince } from '../../utils/utils'
import { DataListItemComponent, FeedComponent } from '../../types/containers'
import { Icon } from '@iconify/react'
import Loader from '../common/loader'
import { Tooltip } from '../toolTip/toolTip'
import NftShare from '../nft/nftShare'
import NftContainer from '../../containers/nft'
import Button from '../form/button'

const FeedCardComponent = ({
  feedLikeToggle,
  feedData,
  feedActionState,
  isOwner,
  hasLiked
}: FeedComponent & DataListItemComponent): JSX.Element => {
  return (
    <div key={feedData.id} className="mb-2 bg-zinc-200 dark:bg-madOnyx rounded-xl p-4 relative">
      <div className="flex items-center mb-2">
        <div className="rounded-full w-12 h-12 overflow-hidden border border-madPink">
          <a href={'/creator/' + feedData?.user_profile?.uri}>
            <img
              src={formatImageUrl(feedData?.user_profile?.img_avatar, 50, 50)}
              alt="Activity feed image"
              className="w-full h-full object-cover"
            />
          </a>
        </div>
        <a href={'/creator/' + feedData?.user_profile?.uri}>
          <h2 className="text-xl ml-2 font-bold">
            {feedData?.user_profile.public_name}
            <span className="text-madPink">.</span>
          </h2>
        </a>
        <span className="text-zinc-600 ml-2">
          {formatTimeSince(new Date(feedData.created_at))} ago
        </span>
      </div>
      {feedData.calculated.parts.map((item) => (
        <>
          {item.type === 'image' ? (
            <div className="relative p-b-square mt-2">
              {item.uri_phrase ? (
                <a href={item.uri_phrase} className="text-madPink">
                  <img
                    src={item.phrase || '/bg-404.jpg'}
                    alt="Activity post image"
                    className="rounded top-0 left-1/2 transform -translate-x-1/2 object-center object-cover max-w-initial h-full m-auto absolute self-center"
                  />
                </a>
              ) : (
                <img
                  src={item.phrase || '/bg-404.jpg'}
                  alt="Activity post image"
                  className="rounded top-0 left-1/2 transform -translate-x-1/2 object-center object-cover max-w-initial h-full m-auto absolute self-center"
                />
              )}
              {feedData.calculated.data.nft_id && (
                <NftContainer
                  nft={{
                    id: feedData.calculated.data.nft_id,
                    token_id: feedData.calculated.data.token_id,
                    contract_id: feedData.calculated.data.contract_id
                  }}
                  Component={NftShare}
                  className="absolute bottom-4 left-4"
                />
              )}
            </div>
          ) : item.type === 'link' ? (
            <a href={item.uri_phrase} className="text-madGray">
              {item.prefix}
              {item.phrase}
            </a>
          ) : (
            item.phrase
          )}{' '}
        </>
      ))}
      <div className="flex border-t border-zinc-700 mt-4 pt-3">
        {feedActionState === 'loading' && (
          <div className="animate-in fade-in zoom-in absolute rounded-lg top-0 left-0 right-0 bottom-0 dark:bg-madBlack bg-zinc-300 flex flex-col items-center justify-center z-top p-10">
            <Loader />
          </div>
        )}
        {!isOwner ? (
          <Tooltip
            placement="bottom-4"
            button={
              <Button
                className="rounded-md hover:bg-transparent"
                colour={hasLiked ? `madPink` : `madGray`}
                hoverColour="madPink"
                onClick={feedLikeToggle}
              >
                <Icon icon={`fa6-solid:thumbs-up`} className="text-lg" />
                <span className="ml-1">{abbreviateNumber(feedData.likes_count)}</span>
              </Button>
            }
          >
            <div className="text-center">{hasLiked ? 'Unlike' : 'Like'} this post</div>
          </Tooltip>
        ) : (
          <Button
            colour="madGray"
            hoverColour="madGray"
            className="hover:bg-transparent cursor-[default] rounded-md"
          >
            <Icon
              icon={`fa6-solid:${hasLiked ? 'thumbs-down' : 'thumbs-up'}`}
              className="text-lg"
            />
            <span className="ml-2">{abbreviateNumber(feedData.likes_count)}</span>
          </Button>
        )}
      </div>
    </div>
  )
}
export default FeedCardComponent
