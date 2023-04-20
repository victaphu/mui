import React from 'react'
import { Icon } from '@iconify/react'
import cn from 'classnames'
import Button from '../form/button'

export default function Popup({
  closePopup,
  backClick,
  nextClick,
  title,
  children,
  position
}: {
  closePopup?: () => void
  backClick?: () => void
  nextClick?: () => void
  title?: JSX.Element | JSX.Element[] | string
  children: JSX.Element | JSX.Element[] | string
  position?: 'right'
}) {
  let className = 'relative z-[1] py-6 px-6 lg:px-4 h-auto m-auto w-full max-w-2xl'
  let wrapperClassName = 'flex justify-center items-center overflow-auto'
  let titleWrapperClassName = ''
  let titleClassName = 'mb-6 -mt-1 px-6 text-2xl text-center font-medium'
  if ('right' === position) {
    className = 'w-[500px] relative z-[1] py-20 px-0 h-full'
    wrapperClassName = 'flex justify-end items-start overflow-y-scroll'
    titleWrapperClassName = 'z-[1] fixed top-0 w-[500px] pt-6 px-6 dark:bg-madCarbon bg-madWhite'
    titleClassName = 'mb-[16px] -mt-1 px-6 text-2xl text-center font-medium'
  }
  return (
    <div
      className={cn(
        'fixed top-0 right-0 left-0 bottom-0',
        'w-full h-full md:inset-0',
        'dark:bg-madBlack bg-madWhite bg-opacity-80 dark:bg-opacity-80 z-50',
        wrapperClassName
      )}
    >
      <div className={cn('dark:bg-madCarbon bg-madWhite shadow-lg rounded-lg', className)}>
        <div className={titleWrapperClassName}>
          <div className="absolute top-4 left-4 z-[2] flex gap-2">
            {(backClick || nextClick) && (
              <Button
                onClick={backClick}
                colour="zinc-700"
                hoverColour="madPink"
                className={`w-10 h-10 ${!backClick ? 'disabled' : null}`}
              >
                <Icon icon="fa6-solid:arrow-left" className="w-4" />
              </Button>
            )}
            {nextClick && (
              <Button
                onClick={nextClick}
                colour="zinc-700"
                hoverColour="madPink"
                className={`w-10 h-10 ${!nextClick ? 'disabled' : null}`}
              >
                <Icon icon="fa6-solid:arrow-right" className="w-4" />
              </Button>
            )}
          </div>
          <div className="absolute top-4 right-4 z-[2]">
            {closePopup && (
              <Button
                onClick={closePopup}
                colour="zinc-700"
                hoverColour="madPink"
                className="w-10 h-10"
              >
                <Icon icon="fa:close" className="w-4" />
              </Button>
            )}
          </div>
          {title && <h3 className={titleClassName}>{title}</h3>}
        </div>
        {children}
      </div>
    </div>
  )
}
