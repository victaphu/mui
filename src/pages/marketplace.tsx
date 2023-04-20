// @typed v1
import React from 'react'
import NftCardComponent from '../components/nft/nftCard'
import { Sidebar } from '../components/sidebar'
import useDataListApi from '../hooks/api/dataList'
import DataList from '../components/dataList/dataList'
import { useSelector } from 'react-redux'
import { getUserProfile } from '../store/user'
import TableRow from '../components/dataList/tableRow'
import { nftColumns } from '../constants/column'
import NftContainer from '../containers/nft'
import NftContent from '../components/nft/nftContent'
import { marketplaceFilterGroups, nftSortingMarketplace } from '../constants/filter'

const MarketplacePage = (): JSX.Element => {
  const profile = useSelector(getUserProfile)
  const {
    setLoadMore,
    setLoadPage,
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
    { per_page: 24, order_by: 'on_sale_end_time', sales_only: true },
    ['category'],
    nftSortingMarketplace
  )
  return (
    <>
      <section className="flex dark:bg-madBlack bg-madWhite">
        <Sidebar
          profile={profile}
          backButton={true}
          showProfileLinks={true}
          showProfileHeader={true}
        />
        <DataList
          icon="fa6-solid:shop"
          preTitle="The"
          title="Marketplace"
          setFilter={setFilter}
          setOrder={setOrder}
          reFetchData={reFetchData}
          dataListData={dataListData}
          setDataListSearchText={setDataListSearchText}
          dataListSearchText={dataListSearchText}
          dataListMessage={dataListMessage}
          dataListLoading={dataListLoading}
          dataListInfo={dataListInfo}
          dataListFilters={dataListFilters}
          dataListFilterGroups={marketplaceFilterGroups}
          setLoadMore={setLoadMore}
          setLoadPage={setLoadPage}
          dataListOrder={dataListOrder}
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
          dataListSorting={dataListSorting}
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
      </section>
    </>
  )
}
export default MarketplacePage
