import React from 'react'
import useDataListApi from '../../hooks/api/dataList'
import DataList from '../dataList/dataList'
import CollectionCardComponent from '../collection/collectionCard'
import Slider from 'react-slick'
import Loader from '../common/loader'
import useWindow from '../../hooks/useWindow'
import { collectionSorting } from '../../constants/filter'

export default function TrendingCollections({
  listWrapClassName = 'mx-3 md:mx-16'
}: {
  listWrapClassName?: string
}) {
  const { setOrder, setFilter, dataListLoading, dataListOrder, dataListData, dataListMessage } =
    useDataListApi('/collections', { per_page: 9, order_by: 'volume_price' }, [], collectionSorting)
  const { width } = useWindow()
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 600,
    autoplaySpeed: 12000,
    slidesToShow: width < 768 ? 1 : width < 1600 ? 2 : width < 2200 ? 3 : 4,
    slidesToScroll: width < 768 ? 1 : width < 1600 ? 2 : width < 2200 ? 3 : 4,
    margin: 20,
    autoplay: true,
    pauseOnHover: false
  }

  return (
    <div className="relative w-full">
      {dataListLoading && (
        <div className="mx-5 md:mx-20">
          <Loader className="h-56 flex bg-opacity-50 dark:bg-opacity-50 dark:bg-madCarbon bg-madCarbon rounded-lg h-full w-full top-0 left-0" />
        </div>
      )}
      <DataList
        hideSpacer={true}
        hideLoader={true}
        setFilter={setFilter}
        setOrder={setOrder}
        dataListData={dataListData}
        dataListMessage={dataListMessage}
        dataListLoading={dataListLoading}
        dataListOrder={dataListOrder}
        wrapperClassName="flex w-full flex-col"
        listClassName="w-full"
        listRender={(item) => <CollectionCardComponent key={item.id} collection={item} />}
        listRenderWrapper={(children) => (
          <div className={listWrapClassName}>
            <Slider
              {...settings}
              className="pb-20 slick-slider-block-dots animate-in fade-in duration-800 w-full"
            >
              {children}
            </Slider>
          </div>
        )}
      />
    </div>
  )
}
