// @typed - MH
import React from 'react'
import { Icon } from '@iconify/react'
import Link from '../common/link'
import { Integration } from '../../types/social'
import { integrations } from '../../constants/config'
import { Tooltip } from '../toolTip/toolTip'

const Socials = ({
  socials,
  className
}: {
  socials: Array<Integration>
  className?: string
}): JSX.Element => {
  const socialsFiltered = socials?.filter((a) => {
    return integrations.find((b) => b.enabled === true && b.id === a.provider)
  })
  return (
    <>
      {socialsFiltered?.map((el) => (
        <span className={className} key={el.id}>
          {el.uri ? (
            <Tooltip
              button={
                <Link href={el.uri} external={true}>
                  <Icon
                    icon={`simple-icons:${el.provider}`}
                    className={`text-madGray ease-in duration-300 hover:text-madPink text-xl`}
                  />
                </Link>
              }
            >
              <span className="whitespace-nowrap">{el.provider} connected</span>
            </Tooltip>
          ) : (
            <Tooltip
              button={
                <Icon
                  icon={`simple-icons:${el.provider}`}
                  className={`text-madGray ease-in duration-300 hover:text-madPink text-xl`}
                />
              }
            >
              <span className="whitespace-nowrap">{el.provider} connected</span>
            </Tooltip>
          )}
        </span>
      ))}
    </>
  )
}
export default Socials
