import React, { useEffect, useRef, useState } from 'react'
import Title from '../common/title'
import DataFilters from './dataFilters'
import DataNone from './dataNone'
import DataPagination from './dataPagination'
import Button from '../form/button'
import { Icon } from '@iconify/react'
import Loader from '../common/loader'
import DataListFilterDropdown from './dataListFilterDropdown'
import TablePagination from './tablePagination'
import { useSelector } from 'react-redux'
import { getSidebarOpen } from '../../store/ux'
import Popup from '../common/popup'
import { DataListContainerComponent } from '../../types/containers'

export default function DataList({
  icon,
  intro,
  preTitle,
  title,
  dataListData,
  dataListMessage,
  dataListMessageClassName,
  dataListLoading,
  dataListToggle,
  dataListSorting,
  dataListOrder,
  dataListFilterGroups,
  dataListFilters,
  dataListInfo,
  setLoadMore,
  setLoadPage,
  reFetchData,
  setOrder,
  setFilter,
  setFilterHeight,
  exposedFilters,
  setDataListSearchText,
  dataListSearchText,
  listRender,
  listRenderTableRow,
  listRenderWrapper = (children) => <>{children}</>,
  previewRender,
  previewRenderTitle,
  setListPreview,
  dataListPreviewIndex,
  listClassName,
  wrapperClassName = 'flex w-full flex-col dark:bg-madBlack bg-madWhite p-2 md:p-6 relative',
  filtersClassName,
  hideSpacer = false,
  hideLoader = false,
  searchPlaceholder,
  preListChildren,
  tableColumns
}: DataListContainerComponent): JSX.Element {
  const ref = useRef()
  const [renderType, setRenderType] = useState('grip-vertical')
  const [localFilterHeight, setLocalFilterHeight] = useState(70)
  const [showExposedFilters, setShowExposedFilters] = useState(false)
  const sidebarCollapse = useSelector<boolean>(getSidebarOpen)
  const menuRef = useRef<HTMLDivElement>()
  const pageSorting = [
    {
      id: 'page-search',
      icon: 'fa6-solid:magnifying-glass',
      value: dataListSearchText,
      className: 'w-[50%] relative text-madGray',
      filterClassName:
        'relative w-full pl-8 text-xs dark:bg-madBlack bg-madGray bg-opacity-50 h-8 border-transparent',
      placeholder: searchPlaceholder ? searchPlaceholder : 'Search ...',
      type: 'text',
      callback: (value) => {
        setDataListSearchText(value)
      }
    },
    {
      id: 'page-sorting',
      icon: 'fa6-solid:list',
      className: 'text-md',
      filterClassName: 'sm:h-8 sm:py-0 text-xs  ',
      value:
        !dataListOrder && dataListSorting && dataListSorting.length > 1
          ? dataListSorting.find((a, i) => i === 0)
          : dataListOrder,
      options: dataListSorting,
      callback: (value) => {
        setOrder(dataListSorting.find((a) => a.id == value.id))
      }
    }
  ]

  const filterCallback = (value, singleColumnFilter, previousValue) => {
    if (!value) {
      setFilter(previousValue, true)
    } else {
      setFilter(value, null, singleColumnFilter)
    }
  }

  const thOrder = (value) => {
    if (dataListOrder) {
      const dir = dataListOrder.value === value ? dataListOrder.direction : null
      return dir === 'asc'
        ? 'fa6-solid:arrow-down'
        : dir === 'desc'
        ? 'fa6-solid:arrow-up'
        : 'fa6-solid:arrows-up-down'
    }
    return 'fa6-solid:arrows-up-down'
  }

  const tableOrder = (value) => {
    let dir = dataListOrder && dataListOrder.value === value ? dataListOrder.direction : null
    dir = !dir ? 'desc' : dir === 'asc' ? 'desc' : 'asc'
    setOrder({ id: 3, value: value, direction: dir, name: 'Sort' })
  }

  useEffect(
    () => {
      // @ts-ignore
      if (setFilterHeight) setFilterHeight(ref?.current?.clientHeight)
      // @ts-ignore
      setLocalFilterHeight(ref?.current?.clientHeight)
    }, // @ts-ignore
    [setFilterHeight, setLocalFilterHeight, ref?.current?.clientHeight]
  )

  useEffect(() => {
    function handleClickOutside(event) {
      if (showExposedFilters && menuRef.current && !menuRef.current.contains(event.target)) {
        setShowExposedFilters(false)
        event.preventDefault()
        event.stopPropagation()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showExposedFilters, menuRef])

  return (
    <div className={`${wrapperClassName} min-w-[200px]`}>
      {(dataListPreviewIndex || dataListPreviewIndex === 0) && (
        <Popup
          title={
            previewRenderTitle
              ? previewRenderTitle(dataListData[dataListPreviewIndex], dataListPreviewIndex)
              : 'Preview'
          }
          closePopup={() => setListPreview(null)}
          backClick={dataListData[dataListPreviewIndex - 1] ? () => setListPreview('prev') : null}
          nextClick={dataListData[dataListPreviewIndex + 1] ? () => setListPreview('next') : null}
          position="right"
        >
          {previewRender && previewRender(dataListData[dataListPreviewIndex], dataListPreviewIndex)}
        </Popup>
      )}
      {!hideSpacer && <div style={{ height: localFilterHeight + 'px' }} />}
      {(dataListFilters || intro || preTitle || title || dataListSorting || dataListToggle) && (
        <section
          className={
            filtersClassName
              ? filtersClassName
              : `flex flex-wrap md:flex-nowrap items-center gap-2 fixed top-[72px] right-0 z-[1] p-2 px-4 md:px-8 dark:bg-madCarbon bg-madWhite border-b border-zinc-800 shadow-md dark:shadow-black ${
                  !sidebarCollapse ? `left-0 md:left-[72px]` : 'left-[375px] lg:left-[420px]'
                }`
          }
          ref={ref}
        >
          {(intro || preTitle || title) && (
            <Title
              icon={icon}
              intro={intro}
              preTitle={preTitle}
              title={title}
              className="mr-2 whitespace-nowrap"
            />
          )}
          {!exposedFilters && dataListFilters && (
            <div className="relative z-[1]" ref={menuRef}>
              <Button
                colour="madPink"
                hoverColour="madWhite"
                darkColour="madPink"
                darkHoverColour="madWhite"
                onClick={() => setShowExposedFilters(!showExposedFilters)}
                className="text-sm mt-1 text-center justify-center dark:bg-madCarbon bg-madWhite flex"
              >
                <Icon icon="fa6-solid:sliders" className="text-sm w-3 mr-1" />
                <span>Filters</span>
              </Button>
              {!exposedFilters && showExposedFilters && dataListFilters && (
                <div className="absolute px-4 min-w-[280px] max-h-[400px] top-[100%] mt-2.5 -translate-x-1/2 left-[50%] dark:bg-madCarbon bg-madWhite overflow-y-auto shadow-md dark:shadow-black/50">
                  <DataListFilterDropdown
                    loading={dataListLoading}
                    filters={dataListFilterGroups}
                    values={dataListFilters}
                    onChange={(v, previousValue) => {
                      filterCallback(v, false, previousValue)
                    }}
                  />
                </div>
              )}
            </div>
          )}
          {dataListSorting && (
            <Button
              colour="madGray"
              hoverColour="madWhite"
              darkColour="madGray"
              darkHoverColour="madWhite"
              onClick={reFetchData}
              className="w-8 h-8 mt-1 flex px-[10px] text-center justify-center"
            >
              <Icon icon="fa:refresh" className="text-sm w-3" />
            </Button>
          )}
          {dataListToggle && (
            <Button
              colour="madGray"
              hoverColour="madWhite"
              darkColour="madGray"
              darkHoverColour="madWhite"
              onClick={() =>
                setRenderType(renderType === 'grip-vertical' ? 'list' : 'grip-vertical')
              }
              className="w-8 h-8 mt-1 flex px-[10px] text-center justify-center"
            >
              <Icon
                icon={`fa-solid:${renderType === 'grip-vertical' ? 'list' : 'grip-vertical'}`}
                className="text-sm w-3"
              />
            </Button>
          )}
          {dataListSorting && (
            <DataFilters className="flex gap-2 w-full items-center pt-1" filters={pageSorting} />
          )}
          {exposedFilters && dataListFilters && (
            <DataFilters
              className="flex gap-2"
              dataListFilters={dataListFilters}
              filters={dataListFilterGroups}
              callback={(v, previousValue) => {
                filterCallback(v, true, previousValue)
              }}
            />
          )}
          {dataListLoading && !hideLoader && (
            <div className="w-full z-[2] left-0 top-0 bottom-0 flex items-center justify-center absolute dark:bg-madBlack bg-madWhite bg-opacity-80 dark:bg-opacity-80">
              <Loader />
            </div>
          )}
        </section>
      )}
      {preListChildren}
      <section
        className={
          listClassName
            ? listClassName
            : renderType === 'grip-vertical'
            ? `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 my-6 mx-3`
            : `overflow-auto mb-8 mx-3`
        }
      >
        {renderType === 'grip-vertical' ? (
          listRenderWrapper(dataListData?.map((item, index) => listRender(item, index)))
        ) : (
          <table className="table-auto w-full mt-4">
            {!dataListLoading && (
              <thead>
                <tr className="text-left text-sm text-gray-400">
                  {tableColumns.map((col) => (
                    <th
                      key={col.name}
                      className={`${col.classNameTh} ${
                        col.sortable ? 'cursor-pointer hover:text-madPink' : ''
                      } whitespace-nowrap`}
                      onClick={() => (col.sortable ? tableOrder(col.sortable) : null)}
                    >
                      {col.sortable && (
                        <Icon icon={thOrder(col.sortable)} className="mr-1 text-xs" />
                      )}
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>{dataListData?.map((item, index) => listRenderTableRow(item, index))}</tbody>
          </table>
        )}
      </section>
      <DataNone
        className={dataListMessageClassName}
        message={dataListMessage}
        listData={dataListData}
        loading={dataListLoading}
      />
      {dataListInfo && renderType === 'grip-vertical' && (
        <DataPagination
          className="p-4"
          listInfo={dataListInfo}
          loading={false}
          loadMore={setLoadMore}
        />
      )}
      {dataListInfo && renderType === 'list' && (
        <TablePagination setLoadPage={setLoadPage} dataListInfo={dataListInfo} />
      )}
      {dataListLoading && !hideLoader && (
        <div className="w-full left-0 top-0 bottom-0 flex items-center justify-center absolute dark:bg-madBlack bg-madWhite bg-opacity-80 dark:bg-opacity-80">
          <Loader />
        </div>
      )}
    </div>
  )
}
