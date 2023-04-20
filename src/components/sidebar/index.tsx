import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import TitleContent from './titleContent'
import LinksComponent from './links'
import { useRouter } from 'next/router'
import { getSidebarOpen, uxAdded } from '../../store/ux'
import { useDispatch, useSelector } from 'react-redux'
import useWindow from '../../hooks/useWindow'
import { DidCard } from '../did/didCard'
import DataListFilterDropdown from '../dataList/dataListFilterDropdown'
import AcademyNav from '../academy/academyNav'
import DidContainer from '../../containers/did'
import { DidCardMini } from '../did/didCardMini'

export const Sidebar = ({
  backButton,
  titleHeader,
  titleText,
  titleSubText,
  paragraphText,
  paragraphHighlightedText,
  paragraphContinuation,
  showAcademy,
  academyItem,
  showProfileLinks,
  showProfileHeader,
  profile,
  filters,
  filterValues,
  filterChange
}: {
  backButton?
  titleHeader?
  titleText?
  titleSubText?
  paragraphText?
  paragraphHighlightedText?
  paragraphContinuation?
  showAcademy?
  academyItem?
  showProfileLinks?
  showProfileHeader?
  profile?
  filters?
  filterValues?
  filterChange?
}) => {
  const profileData = !profile
    ? {
        id: 'guest',
        public_name: 'Disconnected',
        creator_address: 'Create a web3 wallet and dive in!'
      }
    : profile
  const showSideBarAtThisWidth = 1024
  const router = useRouter()
  const dispatch = useDispatch()
  const { width } = useWindow()
  const sidebarIsOpen = useSelector<boolean>(getSidebarOpen)
  const setShowSidebar = (val) => dispatch(uxAdded({ key: 'sidebarOpen', value: val }))
  const [showFilter, setShowFilter] = useState({})
  const showFiltersHandle = (key: string) => {
    const filtersShown = { ...showFilter }
    filtersShown[key] = !filtersShown[key]
    setShowFilter(filtersShown)
  }

  useEffect(() => {
    if (width < showSideBarAtThisWidth) {
      dispatch(uxAdded({ key: 'sidebarOpen', value: false }))
    } else {
      dispatch(uxAdded({ key: 'sidebarOpen', value: true }))
    }
  }, [width, dispatch])

  return (
    <>
      <div
        className={`relative flex shrink-0 flex-col min-h-screen dark:bg-madCarbon bg-madWhite border-r border-zinc-800 ${
          !sidebarIsOpen ? `w-[0] md:w-[70px]` : 'w-[375px] lg:w-[420px]'
        }`}
      >
        <div
          className={`fixed overflow-auto border-r border-zinc-800 dark:bg-madCarbon bg-madWhite ${
            !sidebarIsOpen ? `w-[0] md:w-[70px]` : 'w-[375px] lg:w-[420px]'
          }`}
          style={{ height: 'calc(100vh - 70px)' }}
        >
          {backButton && (
            <button
              onClick={() => router.back()}
              className={`absolute z-[1] ${
                !sidebarIsOpen ? 'hidden' : 'top-6 left-6'
              } w-11 h-11 rounded-full dark:bg-madBlack bg-madWhite flex items-center justify-center`}
            >
              <Icon
                icon={`fa6-solid:arrow-left`}
                className="w-6 text-madGray text-md fa-solid fa-bars"
              />
            </button>
          )}

          <button
            onClick={() => setShowSidebar(!sidebarIsOpen)}
            className={`absolute z-[1] ${
              !sidebarIsOpen ? 'top-3 right-3' : 'top-6 right-6'
            } w-11 h-11 rounded-full dark:bg-madBlack bg-madWhite flex items-center justify-center`}
          >
            <Icon
              icon={`${sidebarIsOpen ? 'fa6-solid:chevron-left' : 'fa6-solid:chevron-right'}`}
              className="w-6 text-madGray text-md fa-solid fa-bars"
            />
          </button>
          {sidebarIsOpen && showProfileHeader ? (
            <DidContainer Component={DidCard} profile={profileData} className="m-2 relative" />
          ) : showProfileHeader ? (
            <DidContainer Component={DidCardMini} profile={profileData} />
          ) : null}
          {showProfileLinks && sidebarIsOpen && profileData?.id !== 'guest' && (
            <div className=" p-6 px-2 justify-between flex relative border-b border-zinc-800">
              <div
                className={`grid gap-0 lg:gap-8 m-auto ${
                  sidebarIsOpen ? 'grid-cols-2' : 'grid-cols-1'
                }`}
              >
                <LinksComponent profile={profileData} sidebarIsOpen={sidebarIsOpen} />
              </div>
            </div>
          )}
          <div className="flex flex-col">
            {titleHeader && (
              <TitleContent
                sidebarIsOpen={sidebarIsOpen}
                toggle={() => setShowSidebar(!sidebarIsOpen)}
                titleHeader={titleHeader}
                titleText={titleText}
                titleSubText={titleSubText}
                paragraphText={paragraphText}
                paragraphHighlightedText={paragraphHighlightedText}
                paragraphContinuation={paragraphContinuation}
              />
            )}
          </div>
          {filters && sidebarIsOpen && (
            <div className="flex flex-col pb-32">
              {filters.map((a) => (
                <div key={a.id}>
                  <div
                    className="cursor-pointer flex justify-between items-center px-4 py-3"
                    onClick={() => {
                      showFiltersHandle(a.id)
                    }}
                  >
                    <p className="capitalize text-madPink font-bold">{`${a.name}`}</p>
                    <Icon
                      icon={showFilter[a.id] ? 'fa6-solid:chevron-up' : 'fa6-solid:chevron-down'}
                      className="w-3 text-xs"
                    />
                  </div>
                  <div className={`${showFilter[a.id] ? '' : 'hidden'}`}>
                    <DataListFilterDropdown
                      itemClassName={'cursor-pointer flex justify-between items-center px-4 py-3'}
                      itemCheckboxClassName={
                        'font-light px-4 pr-1 py-0.5 cursor-pointer flex items-center justify-between font-medium text-sm dark:text-dark-madWhite text-light-madWhite dark:hover:bg-dark-madBlack hover:bg-madBlack'
                      }
                      filters={a.filterGroups}
                      values={filterValues}
                      onChange={(v, previousValue) => {
                        filterChange(v, previousValue)
                      }}
                    />
                  </div>
                  <div className="border-b border-zinc-800" />
                </div>
              ))}
            </div>
          )}
          {showAcademy && (
            <div className={`${!sidebarIsOpen ? 'hidden' : ''} flex flex-col pb-32`}>
              <AcademyNav academyItem={academyItem} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
