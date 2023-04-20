import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import Button from '../form/button'

const ContentCardComponent = ({
  children,
  title,
  titleIcon,
  titleContent,
  collapsible = false,
  collapsedDefault = false,
  className
}: {
  children: JSX.Element | JSX.Element[] | string
  title?: JSX.Element | JSX.Element[] | string
  titleIcon?: string
  titleContent?: JSX.Element | JSX.Element[] | string
  collapsible?: boolean
  collapsedDefault?: boolean
  className?: string
}): JSX.Element => {
  const [collapsed, setCollapsed] = useState<boolean>(collapsedDefault)

  return (
    <div className={`dark:bg-madCarbon bg-zinc-200 p-2 rounded ${className}`}>
      {title && (
        <div className="p-1 px-3 dark:bg-madBlack bg-madWhite rounded">
          <div
            className={`flex items-center gap-3 ${collapsible ? 'cursor-pointer' : ''}`}
            onClick={() => (collapsible ? setCollapsed(!collapsed) : false)}
          >
            {titleIcon && <Icon className="text-madPink" icon={titleIcon} />}
            {title}
            {titleContent}
            {collapsible && (
              <Button
                colour="transparent"
                hoverColour="white"
                onClick={() => setCollapsed(!collapsed)}
                className="ml-auto pr-0"
              >
                <Icon
                  icon={collapsed ? 'fa6-solid:chevron-up' : 'fa6-solid:chevron-down'}
                  className="ml-auto"
                />
              </Button>
            )}
          </div>
        </div>
      )}
      {!collapsed && <div className="px-3">{children}</div>}
    </div>
  )
}
export default ContentCardComponent
