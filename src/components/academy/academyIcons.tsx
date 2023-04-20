// @typed - MH
import { Icon } from '@iconify/react'
import React from 'react'
import { useSelector } from 'react-redux'
import { getUser } from '../../store/user'
import { AcademyItem } from '../../types/academy'
import { Tooltip } from '../toolTip/toolTip'

export default function AcademyIcons({
  academyItem,
  currentItemId
}: {
  academyItem?: AcademyItem
  currentItemId?: string
}): JSX.Element {
  const user = useSelector(getUser)
  let status = user ? user?.videos.filter((a) => a.academy_item_id === academyItem.id) : null
  status = status ? status[0] : null

  return (
    <>
      {status && (
        <Tooltip
          button={
            <span>
              <Icon
                icon={status.status === 2 ? 'fa6-solid:check' : 'fa6-solid:pause'}
                className={`w-6 h-6 mr-1 rounded-full p-1.5 ${
                  status.status === 2 ? 'bg-madPink text-madBlack' : 'bg-madCarbon text-madGray'
                } rounded-full`}
              />
            </span>
          }
        >
          <span className="text-madWhite tracking-[-0.08em] font-light">
            {status.status !== 2 ? 'Part watched' : 'Completed'}
          </span>
        </Tooltip>
      )}
      {currentItemId === academyItem.id && (
        <Tooltip
          button={
            <span>
              <Icon
                icon="fa6-solid:play"
                className={`w-6 h-6 mr-1 rounded-full p-1.5 bg-madPink rounded-full animate-pulse`}
              />
            </span>
          }
        >
          <span className="text-madWhite tracking-[-0.08em] font-light">Viewing now</span>
        </Tooltip>
      )}
    </>
  )
}
