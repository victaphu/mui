// @typed - MH
import React from 'react'
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import { getSidebarOpen, uxAdded } from '../../store/ux'

export default function Title({
  intro,
  preTitle,
  title,
  subTitle,
  className = 'flex ml-2',
  icon,
  children
}: {
  intro?: string
  preTitle?: string
  title?: string
  subTitle?: string
  className?: string
  icon?: string
  children?
}): JSX.Element {
  const dispatch = useDispatch()
  const sidebarIsOpen = useSelector<boolean>(getSidebarOpen)
  const setShowSidebar = (val) => dispatch(uxAdded({ key: 'sidebarOpen', value: val }))
  return (
    <div className={className}>
      {intro && (
        <span
          className="hidden sm:block text-madPink uppercase text-xs -mr-8"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {intro}
        </span>
      )}
      <h1 className="text-2xl sm:text-4xl font-bold flex items-center">
        {!sidebarIsOpen && (
          <button
            onClick={() => setShowSidebar(!sidebarIsOpen)}
            className={`md:hidden w-8 h-8 rounded-full dark:bg-madBlack bg-madWhite border border-madGray flex items-center justify-center mr-4`}
          >
            <Icon
              icon={`${sidebarIsOpen ? 'fa6-solid:chevron-left' : 'fa6-solid:chevron-right'}`}
              className="w-6 text-madGray text-md fa-solid fa-bars"
            />
          </button>
        )}
        {icon && <Icon icon={icon} className="h-5 sm:h-6 mr-1 text-madPink" />}
        <span className="hidden sm:inline dark:text-madWhite text-madBlack">{preTitle}</span>
        <span className="text-madPink">{title}</span>
        {subTitle}.
      </h1>
      {children}
    </div>
  )
}
