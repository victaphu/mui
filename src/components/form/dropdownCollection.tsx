// @typed - MH
import { Icon } from '@iconify/react'
import React from 'react'
import { DataListFilter } from '../../types/dataListFilter'
import { abbreviateNumber } from '../../utils/utils'
import Dropdown from './dropdown'

export default function DropdownCollection({
  onChange,
  collectionId,
  creatorAddress,
  displayType,
  params = {},
  className,
  dropDownClassName
}: {
  onChange: (obj, previousValue?: DataListFilter) => void
  collectionId: string
  creatorAddress: string
  displayType?: string
  params?
  className?: string
  dropDownClassName?: string
}): JSX.Element {
  return (
    <Dropdown
      dropdownClassName={dropDownClassName}
      className={className}
      name="collection"
      placeholder="Select collection"
      value={collectionId || null}
      nullable={true}
      returnObject={true}
      onChange={(obj) => {
        onChange(obj)
      }}
      selectOptionsRemote="/collections"
      selectOptionsRemoteId="id"
      selectOptionsRemoteName="name"
      selectOptionsRemoteConfig={{
        params: {
          ...{
            owner_address: creatorAddress,
            owner: 'selectable',
            per_page: 1000
          },
          ...params
        }
      }}
      placeholderTemplate={(placeholder) => (
        <>
          {placeholder || 'Choose'}
          <Icon icon="fa6-solid:chevron-down" />
        </>
      )}
      valueTemplate={(unit) => (
        <>
          {unit && (
            <>
              <div className="flex overflow-x-auto">
                <span className="mr-2">{unit.name}</span>
                {displayType !== 'minimal' && (
                  <>
                    <span className="p-1 px-2 mr-2 text-xs text-gray-600 dark:bg-madCarbon bg-gray-300 rounded-full">
                      {unit.token_standard}
                    </span>
                    <span className="p-1 px-2 mr-2 text-xs text-gray-600 dark:bg-madCarbon bg-gray-300 rounded-full">
                      {abbreviateNumber(unit.current_supply)}/{abbreviateNumber(unit.max_supply)}
                      {unit.status === 1 ? ' - Unpublished' : ''}
                    </span>
                  </>
                )}
                {unit.royalties ? (
                  <span className="p-1 px-2 mr-2 text-xs text-gray-600 dark:bg-madCarbon bg-gray-300 rounded-full">{`Royalty ${
                    unit.royalties / 100
                  }%`}</span>
                ) : null}
                {unit.ambassador_address ? (
                  <span className="p-1 px-2 mr-2 text-xs text-gray-600 dark:bg-madCarbon bg-gray-300 rounded-full">{`Ambassador ${unit.ambassador_percent}%`}</span>
                ) : null}
                {unit.project_address ? (
                  <span className="p-1 px-2 mr-2 text-xs text-gray-600 dark:bg-madCarbon bg-gray-300 rounded-full">{`Project ${unit.project_percent}%`}</span>
                ) : null}
              </div>
              <Icon icon="fa6-solid:chevron-down" />
            </>
          )}
        </>
      )}
      selectOptionsTemplate={(unit) => (
        <>
          {unit && (
            <div className="w-full text-left">
              <span className="mr-2">{unit.name}</span>
              {displayType !== 'minimal' && (
                <>
                  <span className="p-1 px-2 mr-2 text-xs text-gray-600 dark:bg-madCarbon bg-gray-300 rounded-full">
                    {unit.token_standard}
                  </span>
                  <span className="p-1 px-2 mr-2 text-xs text-gray-600 dark:bg-madCarbon bg-gray-300 rounded-full">
                    {abbreviateNumber(unit.current_supply)}/{abbreviateNumber(unit.max_supply)}
                    {unit.status === 1 ? ' - Unpublished' : ''}
                  </span>
                </>
              )}
              {unit.royalties ? (
                <span className="p-1 px-2 mr-2 text-xs text-gray-600 dark:bg-madCarbon bg-gray-300 rounded-full">{`Royalty ${
                  unit.royalties / 100
                }%`}</span>
              ) : null}
              {unit.ambassador_address ? (
                <span className="p-1 px-2 mr-2 text-xs text-gray-600 dark:bg-madCarbon bg-gray-300 rounded-full">{`Ambassador ${unit.ambassador_percent}%`}</span>
              ) : null}
              {unit.project_address ? (
                <span className="p-1 px-2 mr-2 text-xs text-gray-600 dark:bg-madCarbon bg-gray-300 rounded-full">{`Project ${unit.project_percent}%`}</span>
              ) : null}
            </div>
          )}
        </>
      )}
    />
  )
}
