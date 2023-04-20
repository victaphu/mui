// @typed - MH
import React, { ReactNode } from 'react'

export default function Label({
  name,
  label,
  subLabel,
  required = false,
  className = 'mb-1 block',
  tooltip
}: {
  name: string
  label?: string
  subLabel?: string
  required?: boolean
  className?: string
  tooltip?: ReactNode
}): JSX.Element {
  return (
    <>
      {label && (
        <label htmlFor={name} className={className}>
          {label}
          {subLabel && <span className="text-madPink">{subLabel}</span>}
          {required && <span className="text-madPink">*</span>}
          {tooltip}
        </label>
      )}
    </>
  )
}
