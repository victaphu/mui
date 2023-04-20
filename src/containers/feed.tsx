// @typed v1
import React, { useEffect, useState } from 'react'
import { DataListItemComponent, FeedContainerComponent } from '../types/containers'
import { FeedActionStates } from '../types/feed'
import useDataLikeObjectApi from '../hooks/api/likeObject'
import { useSelector } from 'react-redux'
import { getUserProfile } from '../store/user'

const FeedContainer = ({
  Component,
  feedData,
  className,
  updateData,
  reFetchData,
  listIndex
}: FeedContainerComponent & DataListItemComponent): JSX.Element => {
  const [feedActionState, setFeedActionState] = useState<FeedActionStates>('idle')
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [hasLiked, setHasLiked] = useState<boolean>(false)
  const { postData, callUpdate } = useDataLikeObjectApi()
  const profile = useSelector(getUserProfile)
  const feedLikeToggle = () => {
    if (feedActionState === 'loading') return
    setFeedActionState('loading')
    postData('/feed/like', feedData.id).then((res) => {
      if (updateData && res.data?.message) {
        callUpdate(
          res,
          feedData,
          updateData,
          1,
          'likes_count',
          res.data.message === 'Unliked' ? '-' : '+'
        )
        setFeedActionState('idle')
      } else {
        setFeedActionState('idle')
      }
    })
  }

  useEffect(() => {
    setIsOwner(profile.id === feedData.user_profile_id)
    setHasLiked(feedData?.liked?.length > 0)
  }, [profile, feedData])

  return (
    <>
      {feedData && (
        <Component
          className={className}
          isOwner={isOwner}
          hasLiked={hasLiked}
          feedData={feedData}
          feedActionState={feedActionState}
          setFeedActionState={setFeedActionState}
          feedLikeToggle={feedLikeToggle}
          updateData={updateData}
          reFetchData={reFetchData}
          listIndex={listIndex}
        />
      )}
    </>
  )
}
export default FeedContainer
