import React from 'react'
import { Icon } from '@iconify/react'
import useDataListApi from '../../hooks/api/dataList'
import DataList from '../dataList/dataList'
import Button from '../form/button'
import { Profile } from '../../types/user'
import { DidCard } from '../did/didCard'
import DidContainer from '../../containers/did'

export default function DashboardCommunity({
  title = 'Community',
  preTitle = 'Your',
  profile,
  noDataMessage = 'You currently have no followers. Invite your community to follow your account and increase your visibility!',
  buttonText = 'Your followers',
  buttonLink = `/creator/followers/${profile?.uri}`
}: {
  title?: string
  preTitle?: string
  profile?: Profile
  noDataMessage?: string
  buttonText?: string
  buttonLink?: string
}) {
  const {
    reFetchData,
    updateData,
    setOrder,
    setFilter,
    dataListLoading,
    dataListData,
    dataListMessage
  } = useDataListApi(
    '/creators',
    { user_profile_id: profile.id, followers: true, per_page: 10 },
    null,
    null,
    noDataMessage
  )

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row font-black tracking-[-0.08em] sm:items-end">
        <h2 className="text-2xl dark:text-dark-madWhite text-light-madWhite font-black tracking-[-0.08em] flex items-center">
          <Icon icon="fa6-solid:users" className="h-6 text-madPink mr-1" />
          {preTitle}
          <span className="text-madPink ml-1">{title}</span>.
        </h2>
      </div>
      <DataList
        hideSpacer={true}
        exposedFilters={true}
        setFilter={setFilter}
        setOrder={setOrder}
        dataListData={dataListData}
        dataListMessage={dataListMessage}
        dataListLoading={dataListLoading}
        listRender={(item, index) => (
          <DidContainer
            Component={DidCard}
            key={item.id}
            profile={item}
            updateData={updateData}
            reFetchData={reFetchData}
            listIndex={index}
            className={'min-w-[300px] max-w-[300px]'}
          />
        )}
        wrapperClassName={'w-full overflow-auto'}
        listClassName={'flex w-full overflow-auto gap-4 py-4'}
      />
      {buttonText && (
        <div className="flex justify-end mt-4">
          <Button className="m-auto ml-0" colour="madPink" hoverColour="madBlack" href={buttonLink}>
            <span>{buttonText}</span>
            <Icon icon="fa6-solid:arrow-right" className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
