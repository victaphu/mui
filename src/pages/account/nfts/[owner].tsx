// @typed v1
import React from 'react'
import { Sidebar } from '../../../components/sidebar'
import useDataListApi from '../../../hooks/api/dataList'
import useDataObjectApi from '../../../hooks/api/dataObject'
import DataList from '../../../components/dataList/dataList'
import NftCardComponent from '../../../components/nft/nftCard'
import { creatorNftsFilterGroups, nftSorting } from '../../../constants/filter'
import TableRow from '../../../components/dataList/tableRow'
import { nftColumns } from '../../../constants/column'
import NftContainer from '../../../containers/nft'
import NftContent from '../../../components/nft/nftContent'

const AccountNftsPage = (): JSX.Element => {
  const { dataObjectData } = useDataObjectApi('/creator', null, 'owner')
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
  } = useDataListApi('/nfts', { per_page: 24, order_by: 'created_at' }, ['owner'], nftSorting)

  return (
    <section className="flex dark:bg-madBlack bg-madWhite">
      <Sidebar
        profile={dataObjectData}
        backButton={true}
        showProfileLinks={true}
        showProfileHeader={true}
      />
      <DataList
        icon="fa6-solid:cubes-stacked"
        preTitle="Account"
        title="NFTs"
        setFilter={setFilter}
        setOrder={setOrder}
        reFetchData={reFetchData}
        dataListData={dataListData}
        dataListMessage={dataListMessage}
        dataListLoading={dataListLoading}
        dataListInfo={dataListInfo}
        dataListFilters={dataListFilters}
        dataListFilterGroups={creatorNftsFilterGroups}
        setDataListSearchText={setDataListSearchText}
        dataListSearchText={dataListSearchText}
        setLoadMore={setLoadMore}
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
    </section>
  )
}
export default AccountNftsPage
