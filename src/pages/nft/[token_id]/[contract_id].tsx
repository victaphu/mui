// @typed v1
import React from 'react'
import { Icon } from '@iconify/react'
import useDataObjectApi from '../../../hooks/api/dataObject'
import Loader from '../../../components/common/loader'
import { Sidebar } from '../../../components/sidebar'
import useDataListApi from '../../../hooks/api/dataList'
import DataList from '../../../components/dataList/dataList'
import Button from '../../../components/form/button'
import useWindow from '../../../hooks/useWindow'
import NftContainer from '../../../containers/nft'
import NftCardImageComponent from '../../../components/nft/nftCardImage'
import NftCardComponent from '../../../components/nft/nftCard'
import Trader from '../../../components/trader/trader'
import NftContent from '../../../components/nft/nftContent'
import { findNetworkById } from '../../../utils/network'
import WrongNetwork from '../../../components/common/wrongNetwork'

const NftPage = (): JSX.Element => {
  const { dataObjectLoading, dataObjectData } = useDataObjectApi('/nft', null, 'contract_id', [
    'token_id'
  ])
  const { setLoadMore, dataListLoading, dataListData, dataListMessage, reFetchData } =
    useDataListApi('/nfts', { per_page: 24, order_by: 'token_id', order_dir: 'asc' }, [
      'contract_id'
    ])
  const { containerWidth } = useWindow()

  return (
    <section className="flex dark:bg-madBlack bg-madWhite w-full">
      <Sidebar
        profile={dataObjectData.creator}
        backButton={true}
        showProfileLinks={true}
        showProfileHeader={true}
      />
      <div style={containerWidth} className=" p-2 py-6 md:px-4">
        {dataObjectData?.collection?.chain && (
          <WrongNetwork compareNetwork={findNetworkById(dataObjectData?.collection?.chain)} />
        )}
        {!dataObjectLoading && dataObjectData.id ? (
          <>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:min-w-1/2 mb-auto 2xl:min-w-[500px] 2xl:max-w-[500px]">
                <NftContainer
                  Component={NftCardComponent}
                  nft={dataObjectData}
                  reFetchData={reFetchData}
                  hideViewButton={true}
                />
                <Trader allowListing={true} nft={dataObjectData} />
              </div>
              <div className="basis-full">
                <NftContent nft={dataObjectData} />
              </div>
            </div>
            {dataListData.length > 1 ? (
              <div>
                <h2 className="mt-8 text-2xl">More from this Collection</h2>
                <DataList
                  hideSpacer={true}
                  dataListData={dataListData}
                  dataListLoading={dataListLoading}
                  setLoadMore={setLoadMore}
                  reFetchData={reFetchData}
                  wrapperClassName={'flex w-full overflow-auto'}
                  listClassName={'flex w-full overflow-auto gap-2 py-4'}
                  listRender={(item) => (
                    <NftCardImageComponent
                      nft={item}
                      key={item.id}
                      className={dataObjectData.id === item.id ? 'hidden' : ''}
                    />
                  )}
                  dataListMessage={dataListMessage}
                />
                <Button
                  href={`/collection/${dataObjectData.collection?.contract_id}`}
                  colour="madPink"
                  hoverColour="madBlack"
                  className="m-auto mt-4 mb-2 w-48 justify-center"
                >
                  <Icon icon="fa6-solid:layer-group" className="mr-2" />
                  <span>View collection</span>
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="mt-8">
            {dataObjectLoading ? (
              <Loader />
            ) : (
              <div className="text-center">
                <h2 className="text-lg">NFT not found!</h2>
                <div className="flex">
                  <Button
                    href="/marketplace"
                    colour="madPink"
                    hoverColour="madBlack"
                    className="m-auto mt-6"
                  >
                    Back to the Marketplace
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
export default NftPage
