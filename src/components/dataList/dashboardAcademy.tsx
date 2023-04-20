import React from 'react'
import { Icon } from '@iconify/react'
import useDataListApi from '../../hooks/api/dataList'
import DataList from '../dataList/dataList'
import { creatorSorting } from '../../constants/filter'
import Button from '../form/button'
import AcademyCardComponent from '../academy/academyCard'

export default function DashboardAcademy({
  title = 'Progress',
  preTitle = 'Academy'
}: {
  title?: string
  preTitle?: string
}) {
  const { setOrder, setFilter, dataListLoading, dataListData, dataListMessage } = useDataListApi(
    '/academy',
    { watched: true, per_page: 24, order_by: 'order', order_dir: 'asc' },
    ['category', 'projects'],
    creatorSorting,
    'You have not watched any videos yet, head over to the Academy and get started!'
  )

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row font-black tracking-[-0.08em] sm:items-end">
        <h2 className="text-2xl dark:text-dark-madWhite text-light-madWhite font-black tracking-[-0.08em] flex items-center">
          <Icon icon="fa6-solid:graduation-cap" className="h-6 text-madPink mr-1" />
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
        listRender={(item) => <AcademyCardComponent academyItem={item} />}
        wrapperClassName={'w-full overflow-auto'}
        listClassName={'flex w-full overflow-auto gap-4 py-4'}
      />
      <div className="flex justify-end mt-4">
        <Button className="m-auto ml-0" colour="madPink" hoverColour="madBlack" href="/academy">
          <span>Go to the Academy</span>
          <Icon icon="fa6-solid:arrow-right" className="ml-2" />
        </Button>
      </div>
    </div>
  )
}
