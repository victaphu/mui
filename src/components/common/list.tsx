// @typed - MH
import React from 'react'
import { Icon } from '@iconify/react'

export default function List({
  className,
  items
}: {
  className?: string
  items: Array<{
    iconClassName?: string
    className?: string
    content: string
    icon?: boolean | string
  }>
}): JSX.Element {
  return (
    <ul className={className}>
      {items.map((item, index) => (
        <li key={index} className={'relative ' + item.className || ''}>
          {item.icon === true && (
            <span className={`absolute ${item.iconClassName || ''}`}>
              <Icon icon="fa6-solid:chevron-right" className="text-madPink -mr-0.5 text-xs" />
              <Icon icon="fa6-solid:chevron-right" className="text-madPink mr-1 text-xs" />
            </span>
          )}
          {item.icon && item.icon !== true && (
            <>
              <Icon
                icon={`fa6-solid:${item.icon}`}
                className={`text-madPink mr-1 text-xs absolute ${item.iconClassName}`}
              />
            </>
          )}
          <span className={'block ' + (item.icon ? 'pl-6' : '')}>{item.content}</span>
        </li>
      ))}
    </ul>
  )
}
