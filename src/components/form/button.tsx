// @typed - MH
import React, { MouseEventHandler } from 'react'
import cn from 'classnames'
export default function Button({
  children,
  colour,
  hoverColour,
  darkColour,
  darkHoverColour,
  className,
  disabled,
  onClick,
  href,
  external,
  buttonRef
}: {
  children: JSX.Element | JSX.Element[] | string
  colour: string
  hoverColour: string
  darkColour?: string
  darkHoverColour?: string
  className?: string
  disabled?: boolean
  onClick?: MouseEventHandler
  href?: string // will render a element
  external?: boolean
  buttonRef?
}): JSX.Element {
  return (
    <>
      {href ? (
        <a
          className={cn(
            { 'cursor-not-allowed': disabled },
            'relative flex items-center border uppercase rounded-full py-1.5 px-3 tracking-[-0.02em] duration-300',
            `border-${colour} text-${colour} hover:bg-${colour} hover:text-${hoverColour} hover:border-${hoverColour}`,
            `dark:border-${darkColour} dark:text-${darkColour} dark:hover:bg-${darkColour} dark:hover:text-${darkHoverColour} dark:hover:border-${darkHoverColour}`,
            className
          )}
          href={href}
          target={external ? '_blank' : '_parent'}
          rel="noreferrer"
          ref={buttonRef}
        >
          {children}
        </a>
      ) : (
        <button
          className={cn(
            { 'cursor-not-allowed': disabled },
            'relative flex items-center border uppercase rounded-full py-1.5 px-3 tracking-[-0.08em] duration-300',
            `border-${colour} text-${colour} hover:bg-${colour} hover:text-${hoverColour} hover:border-${hoverColour}`,
            `dark:border-${darkColour} dark:text-${darkColour} dark:hover:bg-${darkColour} dark:hover:text-${darkHoverColour} dark:hover:border-${darkHoverColour}`,
            className
          )}
          disabled={disabled}
          onClick={onClick}
          ref={buttonRef}
        >
          {children}
        </button>
      )}
    </>
  )
}
