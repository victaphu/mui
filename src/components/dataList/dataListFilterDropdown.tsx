import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import { DataListFilter } from '../../types/dataListFilter'
import Loader from '../common/loader'
import PriceRangeComponent from '../form/priceRange'
import { useSelector } from 'react-redux'
import { getUser } from '../../store/user'

const DataListFilterDropdown = ({
  filters,
  values,
  onChange,
  loading,
  itemClassName = 'cursor-pointer flex justify-between items-center px-1 py-3',
  itemCheckboxClassName = 'font-light px-1 py-0.5 cursor-pointer flex items-center justify-between font-medium text-sm dark:text-dark-madWhite text-light-madWhite dark:hover:bg-dark-madBlack hover:bg-light-madBlack'
}: {
  filters
  values: Array<DataListFilter>
  onChange: (val, prev?) => void
  loading?: boolean
  itemClassName?: string
  itemCheckboxClassName?: string
}): JSX.Element => {
  const user = useSelector(getUser)
  const [showFilter, setShowFilter] = useState({})
  const showFiltersHandle = (key: string) => {
    const filtersShown = { ...showFilter }
    filtersShown[key] = !filtersShown[key]
    setShowFilter(filtersShown)
  }
  return (
    <div className="relative">
      {loading && (
        <Loader className="flex items-center absolute dark:bg-madBlack bg-madWhite bg-opacity-50 dark:bg-opacity-50 top-0 -left-4 -right-4 bottom-0" />
      )}
      {filters
        ? filters.map((group, index) => (
            <div key={'sidebarfilter-' + index + group.id}>
              <div
                className={itemClassName}
                onClick={() => {
                  showFiltersHandle(group.id)
                }}
              >
                <p className="capitalize">{`${group.placeholder}`}</p>
                <Icon
                  icon={showFilter[group.id] ? 'fa6-solid:chevron-up' : 'fa6-solid:chevron-down'}
                  className="w-3 text-xs"
                />
              </div>
              <div
                className={
                  index === filters.length - 1
                    ? 'flex flex-col'
                    : 'flex flex-col border-b border-zinc-800'
                }
              >
                {showFilter[group.id] && group.options && (
                  <ul className="dark:text-gray-200 w-full pb-4">
                    {group.options.map((filter, i) => (
                      <li
                        key={'sidebarfilter-sub' + filter.id + i}
                        className={filter.authenticatedOnly && !user ? 'hidden' : 'visible'}
                      >
                        <label
                          key={filter.id + 'label'}
                          htmlFor={`filter-checkbox-${filter.id}`}
                          className={itemCheckboxClassName}
                        >
                          <input
                            onChange={() => {
                              const selected = values
                                ? !!values.find((a) => a?.id == filter.id)
                                : false
                              onChange(!selected ? filter : null, filter)
                            }}
                            checked={values ? !!values.find((a) => a?.id == filter.id) : false}
                            id={`filter-checkbox-${filter.id}`}
                            type="checkbox"
                            value={filter.value}
                            className="accent-madPink rounded-none mr-2 w-4 h-4 text-madPink rounded border-zinc-800 focus:ring-madGray dark:focus:ring-madGray dark:ring-offset-madGray focus:ring-2 bg-madGray dark:border-zinc-800"
                          />
                          <span>{filter.name}</span>
                          <span className="ml-auto mr-4">{filter.count}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
                {showFilter[group.id] && group.type === 'price' && (
                  <PriceRangeComponent
                    onChangeHandler={(amount, type) => {
                      const selected = { id: type, column: type + '_price', value: amount }
                      onChange(amount ? selected : null, selected)
                    }}
                  />
                )}
              </div>
            </div>
          ))
        : null}
    </div>
  )
}
export default DataListFilterDropdown
