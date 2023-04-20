// @typed - MH
import React, { ReactNode, useEffect } from 'react'
import Info from './info'
import Label from './label'
import { Icon } from '@iconify/react'
export default function Input({
  name,
  onChange,
  onKeyPress,
  onBlur,
  focus,
  label,
  icon,
  type = 'text',
  placeholder,
  value,
  min,
  max,
  step,
  required = false,
  disabled = false,
  info,
  tooltip,
  className,
  wrapperClassName,
  countClassName,
  countText,
  inputRef
}: {
  name: string
  onChange: (a: string | number) => void
  onKeyPress?: (a) => void
  onBlur?: (a) => void
  focus?: boolean
  label?: string
  icon?: string
  type?: 'text' | 'number' | 'textarea'
  placeholder?: string
  value?: string | number
  min?: number
  max?: number
  step?: number
  required?: boolean
  disabled?: boolean
  info?: string
  tooltip?: ReactNode
  tooltipPlacement?: string
  className?: string
  wrapperClassName?: string
  countClassName?: string
  countText?: string | false
  inputRef?
}): JSX.Element {
  useEffect(() => {
    if (focus && inputRef) inputRef.current.focus()
  }, [focus, inputRef])
  return (
    <div className={`${wrapperClassName ?? ''}`}>
      <Label name={name} label={label} required={required} tooltip={tooltip} />
      <Info info={info} />
      <div className={`${icon && type !== 'textarea' ? 'flex' : ''} ${disabled ? 'disabled' : ''}`}>
        {icon && type !== 'textarea' && (
          <div className="bg-gray-500 rounded-l-full flex w-12 h-11 items-center justify-center">
            <Icon icon={icon} />
          </div>
        )}
        {type === 'textarea' ? (
          <textarea
            disabled={disabled}
            rows={4}
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              const newValue = e.target.value
              if (max && newValue) {
                onChange(newValue && newValue.toString().length <= max ? newValue : value)
              } else {
                onChange(newValue)
              }
            }}
            onKeyPress={onKeyPress}
            onBlur={onBlur}
            className={`text-gray-500 dark:text-gray-400 dark:placeholder-zinc-800 block w-full px-4 py-2 dark:bg-madOnyx bg-madWhite border border-madGray focus:border-madPink focus:outline-none focus:ring focus:ring-madPink dark:focus:text-dark-madWhite focus:text-light-madWhite rounded-2xl ${className}`}
          />
        ) : (
          <input
            ref={inputRef}
            disabled={disabled}
            id={name}
            type={type}
            placeholder={placeholder}
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const newValue = e.target.value
              if (type == 'text' && max && newValue) {
                onChange(newValue && newValue.toString().length <= max ? newValue : value)
              } else {
                onChange(newValue)
              }
            }}
            onKeyPress={onKeyPress}
            onBlur={onBlur}
            className={`block w-full px-4 py-1.5 text-gray-500 dark:text-gray-500 dark:placeholder-zinc-800 dark:bg-madOnyx bg-madWhite border border-madGray focus:border-madPink focus:outline-none focus:ring focus:ring-madPink dark:focus:text-dark-madWhite focus:text-light-madWhite rounded-full ${className} ${
              icon ? 'rounded-r-full' : 'rounded-full'
            }`}
          />
        )}
      </div>
      {(type === 'textarea' || type === 'text') && max && (
        <p className={`text-madGray text-sm ${countClassName}`}>
          {countText !== false ? (countText ? countText : 'Count') : ''}{' '}
          <span className="text-madPink">{value?.toString()?.length || 0}</span>/{max}
        </p>
      )}
    </div>
  )
}
