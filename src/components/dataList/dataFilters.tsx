// @typed - MH
import React from 'react'
import { Icon } from '@iconify/react'
import DataFilter from './dataFilter'
import { DataListFilter } from '../../types/dataListFilter'

export default function DataFilters({
  filters,
  className = 'flex ml-2',
  callback,
  dataListFilters
}: {
  filters: Array<{
    id: string
    options?: Array<DataListFilter>
    callback?: (selection: DataListFilter, previousValue?: DataListFilter) => void
    value?: DataListFilter | string // will be a string if type is text
    nullable?: boolean
    placeholder?: string
    icon?
    type?: string
    className?: string
    filterClassName?: string
  }>
  dataListFilters?: DataListFilter[]
  className?: string
  callback?: (selection: DataListFilter, previousValue?: DataListFilter) => void
}): JSX.Element {
  const findValue = (f) => {
    if (!dataListFilters) return
    if (f.type === 'text') {
      return f.value
    } else {
      return f.options.find((option) => dataListFilters.find((a) => option.id === a.id))
    }
  }
  return (
    <div className={className}>
      {filters &&
        filters.map((f) => (
          <DataFilter
            key={f.id}
            type={f.type}
            icon={f.icon}
            value={f.value ? f.value : findValue(f)}
            className={f.className}
            filterClassName={f.filterClassName}
            placeholder={f.placeholder}
            placeholderTemplate={(placeholderText, exposed) => (
              <div className="text-madGray hover:text-madPink">
                <Icon
                  icon={exposed ? 'fa:close' : f.icon || 'fa6-solid:chevron-down'}
                  className="mr-2 w-4"
                />{' '}
                {placeholderText}
                <Icon icon="fa6-solid:chevron-down" className="ml-2" />
              </div>
            )}
            valueTemplate={(unit) => (
              <>
                {!unit ? (
                  <div className="text-madGray">
                    <Icon icon={f.icon || 'fa6-solid:arrows-up-down'} className="mr-2" />
                    <span className="whitespace-nowrap ml-2">No items found</span>
                  </div>
                ) : (
                  <div className="text-madGray">
                    <Icon icon={f.icon || 'fa6-solid:arrows-up-down'} className="mr-1" />
                    <span className="whitespace-nowrap ml-2">{unit.name}</span>
                    <Icon icon="fa6-solid:chevron-down" className="ml-2" />
                  </div>
                )}
              </>
            )}
            onChange={(value, previousValue) => {
              if (callback) callback(value, previousValue)
              if (f.callback) f.callback(value, previousValue)
            }}
            filters={f.options}
            nullable={f.nullable}
          />
        ))}
    </div>
  )
}
