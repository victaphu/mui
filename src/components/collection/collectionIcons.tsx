// @typed - MH
import { Icon } from '@iconify/react'
import React from 'react'
import { Collection } from '../../types/collection'
import { Tooltip } from '../toolTip/toolTip'
import { abbreviateNumber } from '../../utils/utils'

export default function CollectionIcons({ collection }: { collection?: Collection }): JSX.Element {
  return (
    <div className="flex pr-3">
      <Tooltip
        button={
          <span className="flex items-center justify-center w-10 h-10 tracking-[-0.1em] dark:bg-madOnyx bg-madWhite border border-madPink text-madPink text-sm rounded-full -mr-3">
            {collection.token_standard}
          </span>
        }
      >
        <div className="whitespace-nowrap mb-1">Token Standard: {collection.token_standard}</div>
        <div className="whitespace-nowrap mb-1">Symbol: {collection.symbol}</div>
        <div className="whitespace-nowrap">
          Max supply: {abbreviateNumber(collection.max_supply)}
        </div>
      </Tooltip>
      {collection.category_object && (
        <Tooltip
          button={
            <span
              className={`flex items-center justify-center w-10 h-10 dark:bg-madBlack bg-madWhite border border-${collection.category_object.color} rounded-full dark:hover:bg-dark-madCarbon hover:bg-light-madCarbon -mr-3`}
            >
              <Icon
                icon={`fa6-solid:${collection.category_object.icon}`}
                className={`fa-solid leading-none fa-layer-group text-${collection.category_object.color} m-1 text-lg`}
              />
            </span>
          }
        >
          <div className={`text-center text-${collection.category_object.color}`}>
            {collection.category_object.name}
          </div>
        </Tooltip>
      )}
      {collection.project_address && (
        <Tooltip
          button={
            <span
              className="flex items-center justify-center w-10 h-10 dark:text-dark-madWhite text-light-madWhite dark:bg-madOnyx bg-madWhite border border-madGray rounded-full -mr-3"
              title="Collection contributing to project"
            >
              <Icon
                icon="fa6-solid:handshake"
                className="fa-solid leading-none fa-layer-group text-madGray m-1 text-lg"
              />
            </span>
          }
        >
          <div className="w-40">
            This collection includes a Project donation deducted from the creator royalties (
            {collection.project_percent / 1000}%)
          </div>
        </Tooltip>
      )}
    </div>
  )
}
