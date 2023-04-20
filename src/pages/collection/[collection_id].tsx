import React, { useEffect, useState } from 'react'
import NftCardComponent from '../../components/nft/nftCard'
import useDataObjectApi from '../../hooks/api/dataObject'
import useDataListApi from '../../hooks/api/dataList'
import client from '../../utils/client'
import { Sidebar } from '../../components/sidebar'
import { formatImageUrl } from '../../utils/utils'
import DataList from '../../components/dataList/dataList'
import { useSelector } from 'react-redux'
import { getSidebarOpen } from '../../store/ux'
import useWindow from '../../hooks/useWindow'
import MintNow from '../../components/minter/mintNow'
import CollectionDetailCard from '../../components/collection/collectionDetailCard'
import { collectionNftsFilterGroups, nftCollectionSorting } from '../../constants/filter'
import { domain } from '../../constants/domain'
import TableRow from '../../components/dataList/tableRow'
import { nftColumns } from '../../constants/column'
import CollectionIcons from '../../components/collection/collectionIcons'
import NftContainer from '../../containers/nft'
import NftContent from '../../components/nft/nftContent'

const CollectionPage = (): JSX.Element => {
  const { dataObjectLoading, dataObjectData } = useDataObjectApi(
    '/collection',
    null,
    'collection_id'
  )
  const [filterHeight, setFilterHeight] = useState<number>(0)
  const [profile, setProfile] = useState(null)
  const [filters, setFilters] = useState([])
  const [sidebarFilters, setSidebarFilters] = useState([])
  const sidebarIsOpen = useSelector<boolean>(getSidebarOpen)
  const { width } = useWindow()

  const {
    setLoadMore,
    setOrder,
    setFilter,
    dataListLoading,
    dataListOrder,
    dataListData,
    dataListFilters,
    dataListSorting,
    dataListMessage,
    dataListInfo,
    updateData,
    reFetchData,
    setDataListSearchText,
    dataListSearchText,
    setListPreview,
    dataListPreviewIndex
  } = useDataListApi(
    '/nfts',
    { per_page: 24, order_by: 'token_id', order_dir: 'asc' },
    ['collection_id', 'category'],
    nftCollectionSorting
  )

  useEffect(() => {
    const collectionFilters = []
    if (!dataObjectData || !dataObjectData.attribute_counts) return
    Object.entries(dataObjectData?.attribute_counts).map((filterSubGroups, index) => {
      const checkFilters = []
      Object.values(filterSubGroups[1]).map((filterGroup, subIndex) => {
        checkFilters.push({
          id:
            filterGroup.trait_type.toLowerCase().replaceAll(' ', '-') +
            '-filter-' +
            index +
            '-' +
            subIndex,
          value: null,
          nullable: true,
          placeholder: filterGroup.trait_type,
          icon: 'list',
          options: Object.values(filterGroup.values)
        })
      })
      collectionFilters.push({
        id: 'filter-group-' + filterSubGroups[0] + '-' + index,
        name: filterSubGroups[0],
        filterGroups: checkFilters
      })
    })
    setSidebarFilters(collectionFilters)
    setFilters(collectionNftsFilterGroups)
  }, [dataObjectData, filters])

  useEffect(() => {
    if (dataObjectData?.creator && !profile) {
      client.get(`${domain.apiUrl}/creator/${dataObjectData.creator.uri}`).then((response) => {
        setProfile(response.data)
      })
    }
  }, [profile, dataObjectData])

  return (
    <section className="flex dark:bg-madBlack bg-madWhite">
      <Sidebar
        profile={profile}
        backButton={true}
        showProfileLinks={true}
        showProfileHeader={true}
        filters={!dataObjectData?.public_mint_state ? sidebarFilters : null}
        filterValues={!dataObjectData?.public_mint_state ? dataListFilters : null}
        filterChange={(val, prev) => {
          if (!val) {
            setFilter(prev, true)
          } else {
            setFilter(val, false, false)
          }
        }}
      />
      <div
        style={{
          width:
            sidebarIsOpen && width > 768
              ? 'calc(100% - 420px)'
              : width < 768
              ? '100vw'
              : 'calc(100% - 72px)'
        }}
      >
        <div style={{ height: filterHeight + 'px' }} />
        <div className="relative flex w-full flex-col">
          <section className="top-0 left-0 overflow-hidden relative h-[185px] w-full">
            {!dataObjectLoading && (
              <img
                alt="Collection banner"
                src={
                  dataObjectData?.img_banner
                    ? formatImageUrl(dataObjectData?.img_banner, 1040, 320)
                    : '/bg-404.jpg'
                }
                className="object-cover relative h-full w-full"
              />
            )}
            <div className="absolute bottom-5 right-5">
              <CollectionIcons collection={dataObjectData} />
            </div>
            {!dataObjectLoading && (
              <div className="w-[110px] h-[110px] absolute z-[1] left-6 md:left-10 bottom-6 border border-madGray rounded-lg dark:bg-madCarbon bg-madWhite">
                <img
                  alt="Collection icon"
                  src={
                    dataObjectData?.img_avatar
                      ? formatImageUrl(dataObjectData?.img_avatar, 1040, 320)
                      : '/bg-404.jpg'
                  }
                  className="object-cover relative h-full w-full rounded-md"
                />
              </div>
            )}
          </section>
          <CollectionDetailCard collection={dataObjectData} collectionLoading={dataObjectLoading} />
          {!dataObjectLoading &&
          dataObjectData?.public_mint_state &&
          dataObjectData.nfts_count < dataObjectData.max_supply ? (
            <MintNow
              collection={dataObjectData}
              collectionLoading={dataObjectLoading}
              className="mx-2 p-8 px-16 text-center rounded-md flex flex-col items-center m-auto relative dark:bg-madCarbon bg-madWhite md:mx-6"
            />
          ) : null}
        </div>
        {!dataObjectLoading &&
          dataObjectData &&
          (!dataObjectData?.public_mint_state ||
            dataObjectData.nfts_count === dataObjectData.max_supply) && (
            <>
              <DataList
                icon="fa6-solid:layer-group"
                title="Collection"
                hideSpacer={true}
                searchPlaceholder="Search for items in this collection"
                setFilterHeight={setFilterHeight}
                setFilter={setFilter}
                setOrder={setOrder}
                setDataListSearchText={setDataListSearchText}
                dataListSearchText={dataListSearchText}
                dataListData={dataListData}
                dataListMessage={dataListMessage}
                dataListLoading={dataListLoading}
                dataListInfo={dataListInfo}
                dataListFilters={dataListFilters}
                dataListFilterGroups={filters}
                setLoadMore={setLoadMore}
                reFetchData={reFetchData}
                dataListOrder={dataListOrder}
                dataListSorting={dataListSorting}
                listRender={(item, index) => (
                  <NftContainer
                    Component={NftCardComponent}
                    key={item.id}
                    nft={item}
                    updateData={updateData}
                    reFetchData={reFetchData}
                    setListPreview={setListPreview}
                    listIndex={index}
                  />
                )}
                previewRenderTitle={(nft) => (
                  <>
                    {nft.name || nft.collection.name}
                    <div className="text-center px-10 mb-2 text-madGray text-xs name-ellipsis">
                      #{nft.token_id}
                    </div>
                  </>
                )}
                previewRender={(nft) => <NftContent nft={nft} />}
                setListPreview={setListPreview}
                dataListPreviewIndex={dataListPreviewIndex}
                dataListToggle={true}
                listRenderTableRow={(item) => (
                  <TableRow data={item} columns={nftColumns.filter((a, i) => i > 0)} />
                )}
                tableColumns={nftColumns.filter((a, i) => i > 0)}
              />
            </>
          )}
      </div>
    </section>
  )
}
export default CollectionPage
