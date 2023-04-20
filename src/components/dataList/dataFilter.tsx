import React from 'react'
import { DataListFilter } from '../../types/dataListFilter'
import Dropdown from '../form/dropdown'
import Input from '../form/input'
import { Icon } from '@iconify/react'

export default function DataFilter({
  type = 'select',
  className,
  filterClassName,
  icon,
  value,
  onChange,
  filters,
  nullable = false,
  placeholder,
  placeholderTemplate,
  valueTemplate
}: {
  type?: string
  className?: string
  filterClassName?: string
  icon?
  value?: DataListFilter
  onChange: (any, previousValue?) => void
  filters: DataListFilter[]
  nullable?: boolean
  placeholder?: string
  placeholderTemplate?: (placeholder, exposed) => React.ReactElement
  valueTemplate?: (val) => React.ReactElement
}): JSX.Element {
  return (
    <div className={`${className}`}>
      {type === 'select' ? (
        <Dropdown
          showClear={true}
          className={filterClassName}
          wrapperClassName="mb-0"
          name="sorting-select"
          placeholder={placeholder}
          nullable={nullable}
          returnObject={true}
          value={value?.id ? value?.id : placeholder ? null : 1}
          selectOptions={filters}
          onChange={(v, previousValue) => {
            onChange(v, previousValue)
          }}
          placeholderTemplate={placeholderTemplate}
          valueTemplate={valueTemplate || null}
        />
      ) : type === 'text' ? (
        <>
          {icon && (
            <Icon
              icon={icon}
              className={`absolute z-[1] left-3 top-[50%] transform -translate-y-1/2 text-xs text-${
                value ? 'madPink' : ''
              }`}
            />
          )}
          <Input
            className={
              filterClassName ||
              'border border-madPink w-full px-3 pl-8 py-1 text-xs inline-flex items-center justify-between text-gray-500 select-color dark:bg-madOnyx bg-light-madOnyx rounded-full focus:outline-none dark:focus:text-dark-madWhite focus:text-light-madWhite'
            }
            onChange={onChange}
            type="text"
            name="Text"
            value={value?.toString() || ''}
            placeholder={placeholder}
          />
        </>
      ) : null}
    </div>
  )
}
