// @typed - MH
import React from 'react'
import { Profile } from '../../types/user'
import useCrudObjectApi from '../../hooks/api/crudObject'
import Button from '../form/button'
import Loader from '../common/loader'
import { getUserProfile } from '../../store/user'
import { useSelector } from 'react-redux'
import { abbreviateNumber } from '../../utils/utils'
import { Tooltip } from '../toolTip/toolTip'

const Follow = ({
  creator,
  updateProfileData
}: {
  creator: Profile
  updateProfileData?: (id, newData) => void
}): JSX.Element => {
  const { putData, dataLoading } = useCrudObjectApi()
  const profile = useSelector(getUserProfile)
  const followToggle = async () => {
    if (dataLoading) return
    const response = await putData('creator/follow/' + creator.id)
    if (response?.data?.data) {
      updateProfileData(creator.id, response?.data?.data)
    }
  }
  return (
    <>
      {profile?.creator_address !== creator?.creator_address ? (
        <>
          {profile ? (
            <>
              {profile && creator?.is_following?.length > 0 ? (
                <Tooltip
                  placement="bottom-0"
                  button={
                    <span className="text-xs uppercase p-1 px-2 rounded-lg text-madGray bg-madBlack border border-madWhite border-opacity-10">
                      {abbreviateNumber(creator?.followers_count)} Follower
                      {!creator?.followers_count || creator?.followers_count > 1 ? 's' : ''}
                    </span>
                  }
                >
                  <Button
                    className="text-xs py-1 rounded-md m-auto"
                    colour={profile && creator?.is_following?.length > 0 ? 'madGray' : 'madGreen'}
                    hoverColour="madWhite"
                    onClick={followToggle}
                  >
                    <>
                      {dataLoading ? (
                        <Loader
                          className="w-10 h-4 p-0 flex justify-center"
                          imgClassName="w-4 h-4 p-0"
                        />
                      ) : (
                        'unfollow'
                      )}
                    </>
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  className="text-xs rounded-md py-1"
                  colour={profile && creator?.is_following?.length > 0 ? 'madGray' : 'madGreen'}
                  hoverColour="madWhite"
                  onClick={followToggle}
                >
                  <>
                    {dataLoading ? (
                      <Loader
                        className="w-10 h-4 p-0 flex justify-center"
                        imgClassName="w-4 h-4 p-0"
                      />
                    ) : (
                      'Follow'
                    )}
                  </>
                  <span className="ml-2">{abbreviateNumber(creator?.followers_count)}</span>
                </Button>
              )}
            </>
          ) : (
            <Button
              className="text-xs rounded-md py-1"
              colour={'madGreen'}
              hoverColour="madBlack"
              onClick={followToggle}
            >
              <>Follow</>
              <span className="ml-2">{abbreviateNumber(creator?.followers_count)}</span>
            </Button>
          )}
        </>
      ) : (
        <span className="text-xs uppercase p-1 px-2 rounded-lg text-madGray bg-madBlack border border-madWhite border-opacity-10">
          {abbreviateNumber(creator?.followers_count)} Follower
          {!creator?.followers_count || creator?.followers_count > 1 ? 's' : ''}
        </span>
      )}
    </>
  )
}
export default Follow
