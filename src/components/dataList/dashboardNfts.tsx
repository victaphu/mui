import React from 'react'
import { Icon } from '@iconify/react'
import useDataListApi from '../../hooks/api/dataList'
import DataList from '../dataList/dataList'
import Button from '../form/button'
import { Profile } from '../../types/user'
import NftCardComponent from '../nft/nftCard'

export default function DashboardNfts({
  title = 'NFTs',
  preTitle = 'Trending',
  profile,
  noDataMessage = 'You currently have no NFTs. Create your first and engage with your community!',
  showCreateButton = true,
  buttonText = 'All NFTs',
  buttonLink = `/creator/nfts/${profile?.uri}`
}: {
  title?: string
  preTitle?: string
  profile?: Profile
  noDataMessage?: string
  showCreateButton?: boolean
  buttonText?: string
  buttonLink?: string
}) {
  const {
    updateData,
    setOrder,
    setFilter,
    reFetchData,
    dataListLoading,
    dataListData,
    dataListMessage
  } = useDataListApi('/nfts', { creator_uri: profile.uri, per_page: 50 }, null, null, noDataMessage)

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row font-black tracking-[-0.08em] sm:items-end">
        <h2 className="text-2xl dark:text-dark-madWhite text-light-madWhite font-black tracking-[-0.08em] flex items-center">
          <Icon icon="fa6-solid:cubes-stacked" className="h-6 text-madPink mr-1" />
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
        listRender={(item) => (
          <NftCardComponent
            key={item.id}
            nft={item}
            updateData={updateData}
            reFetchData={reFetchData}
            className="min-w-[280px]"
          />
        )}
        wrapperClassName={'w-full overflow-auto'}
        listClassName={'flex w-full overflow-auto gap-4 py-4'}
      />
      {buttonText && (
        <div className="flex mt-4 mb-0 justify-between items-center">
          {showCreateButton && (
            <Button
              className="m-auto ml-0"
              colour="madPink"
              hoverColour="madBlack"
              href={`/create`}
            >
              <Icon icon="fa6-solid:plus" className="mr-2" />
              <>Create</>
            </Button>
          )}
          <Button colour="madPink" hoverColour="madBlack" href={buttonLink}>
            <>{buttonText}</>
            <Icon icon="fa6-solid:arrow-right" className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
