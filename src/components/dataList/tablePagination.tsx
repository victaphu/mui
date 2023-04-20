// @typed - MH
import React from 'react'
import { DataListInfo } from '../../types/dataListInfo'
import Button from '../form/button'
import { Icon } from '@iconify/react'

export default function TablePagination({
  className = 'flex items-center gap-2 justify-center',
  setLoadPage,
  dataListInfo
}: {
  className?: string
  setLoadPage: (page) => void
  dataListInfo: DataListInfo
}): JSX.Element {
  return (
    <div className={className}>
      {dataListInfo.prev_page_url && (
        <Button
          onClick={() => setLoadPage(dataListInfo.current_page - 1)}
          colour="madPink"
          hoverColour="madBlack"
        >
          <Icon icon="fa6-solid:arrow-left" className="my-1" />
        </Button>
      )}
      <Button
        onClick={() => {}}
        colour="madPink"
        hoverColour="madPink"
        className="cursor-default hover:bg-transparent opacity-50"
      >
        <>
          <span className="mr-2">Viewing</span> {dataListInfo.from} - {dataListInfo.to}
        </>
      </Button>
      {dataListInfo.next_page_url && (
        <Button
          onClick={() => setLoadPage(dataListInfo.current_page + 1)}
          colour="madPink"
          hoverColour="madBlack"
        >
          <Icon icon="fa6-solid:arrow-right" className="my-1" />
        </Button>
      )}
    </div>
  )
}
