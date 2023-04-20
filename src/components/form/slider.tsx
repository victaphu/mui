// @typed - MH
import React from 'react'
export default function Slider({
  onChange,
  name,
  value,
  min = 1,
  max = 10,
  step = 1,
  disabled = false
}: {
  onChange: (value: string | number) => void
  name: string
  value?: string | number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}): JSX.Element {
  const items = Array.from({ length: max - min + 1 }, (v, k) => k + min)
  return (
    <div className={`my-4 ${disabled ? 'disabled' : ''}`}>
      <label
        htmlFor={name}
        className="text-xs tracking-[-0.16em] text-madGray px-0.5 flex justify-between"
      >
        {items.map((a) => (
          <span key={a} className="block w-4 text-center">
            {a}
          </span>
        ))}
      </label>
      <input
        disabled={disabled}
        id={name}
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        type="range"
        className="w-full h-2 bg-madGray rounded-lg appearance-none cursor-pointer dark:bg-madGray"
      />
    </div>
  )
}
