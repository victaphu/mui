import React from 'react'
import { Icon } from '@iconify/react'
import useDataListApi from '../../hooks/api/dataList'
import DataList from '../dataList/dataList'
import Button from '../form/button'
import { Profile } from '../../types/user'
import CollectionCardComponent from '../collection/collectionCard'

export default function DashboardCollections({
  title = 'Collections',
  preTitle = 'Trending',
  profile,
  noDataMessage = 'You currently have no Collections. Create your first and engage with your community!',
  showCreateButton = true,
  buttonText = 'All Collections',
  buttonLink = `/creator/collections/${profile?.uri}`
}: {
  title?: string
  preTitle?: string
  profile?: Profile
  noDataMessage?: string
  showCreateButton?: boolean
  buttonText?: string
  buttonLink?: string
}) {
  const { setOrder, setFilter, dataListLoading, dataListData, dataListMessage } = useDataListApi(
    '/collections',
    { creator_uri: profile.uri, per_page: 50 },
    null,
    null,
    noDataMessage
  )

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row font-black tracking-[-0.08em] sm:items-end">
        <h2 className="text-2xl dark:text-dark-madWhite text-light-madWhite font-black tracking-[-0.08em] flex items-center">
          <Icon icon="fa6-solid:layer-group" className="h-6 text-madPink mr-1" />
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
          <CollectionCardComponent
            className={`min-w-[320px] md:min-w-[420px] card-wrapper rounded-lg shadow-black/50 shadow-lg border dark:bg-madCarbon bg-madWhite border-gray-500 dark:border-gray-500`}
            key={item.id}
            collection={item}
          />
        )}
        wrapperClassName={'w-full overflow-auto'}
        listClassName={'flex w-full overflow-auto gap-4 py-4'}
      />
      <div className="flex mt-4 mb-0 justify-between items-center">
        {showCreateButton && (
          <Button className="m-auto ml-0" colour="madPink" hoverColour="madBlack" href={`/create`}>
            <Icon icon="fa6-solid:plus" className="mr-2" />
            <>Create</>
          </Button>
        )}
        <Button colour="madPink" hoverColour="madBlack" href={buttonLink}>
          <>{buttonText}</>
          <Icon icon="fa6-solid:arrow-right" className="ml-2" />
        </Button>
      </div>
    </div>
  )
}
