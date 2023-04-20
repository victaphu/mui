// @typed - MH
import { Icon } from '@iconify/react'
import React, { ReactNode } from 'react'
export default function Switch({
  name,
  title,
  preTitle,
  subTitle,
  icon = 'shuffle',
  value,
  onChange,
  disabled = false,
  tooltip,
  colour = 'madPink',
  className = 'flex justify-between items-center'
}: {
  name: string
  title?: string
  preTitle?: string
  subTitle?: string
  icon?: string
  value?: boolean
  onChange: (a: boolean) => void
  disabled?: boolean
  tooltip?: ReactNode
  colour?: string
  className?: string
}): JSX.Element {
  return (
    <div className={className}>
      <div className="flex flex-row">
        <div className="my-auto">
          <Icon icon={icon} className={`text-3xl text-${colour}`} />
        </div>
        <div className="relative">
          <span className="tracking-[-0.08em] text-xl font-bold leading-3">
            <span className="tracking-[-0.04em] inline-block align-text-bottom font-normal text-sm uppercase leading-4 text-gray-500">
              {preTitle}
            </span>
            <br />
            <span className="inline-block align-text-top">
              {title && <span>{title}</span>}
              {subTitle && <span className={`text-${colour}`}>{subTitle}</span>}.
            </span>
          </span>
          <div className="absolute top-0 -right-2">{tooltip}</div>
        </div>
      </div>
      <label
        htmlFor={name}
        className={`inline-flex relative items-center cursor-pointer ml-2 ${
          disabled ? 'disabled' : ''
        }`}
      >
        <input
          disabled={disabled}
          className="sr-only peer"
          type="checkbox"
          checked={!!value}
          id={name}
          onChange={(e) => onChange(!!e.target.checked)}
        />
        <div className="w-9 h-5 bg-madWhite dark:bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-madPink dark:peer-focus:ring-madPink rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] dark:after:bg-dark-madWhite after:bg-light-madWhite after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-madPink" />
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300" />
      </label>
    </div>
  )
}
