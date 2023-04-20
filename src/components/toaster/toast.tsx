import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import cn from 'classnames'
import { Icon } from '@iconify/react'

const alertTypes = {
  error: {
    icon: <Icon icon="fa6-solid:circle-exclamation" className="w-7 h-7 text-2xl" />,
    color: 'bg-madPink'
  },
  success: {
    icon: <Icon icon="fa6-solid:circle-check" className="w-7 h-7 text-2xl" />,
    color: 'bg-madGreen'
  },
  warning: {
    icon: <Icon icon="fa6-solid:circle-exclamation" className="w-7 h-7 text-2xl" />,
    color: 'bg-warning'
  }
}

export default function Toast({
  type,
  title,
  message,
  expire,
  onExpire
}: {
  type: 'error' | 'success' | 'warning'
  title: string
  message: string
  expire?: number
  onExpire: () => void
}): JSX.Element {
  if (expire === undefined) expire = 4500

  const targetRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState<{
    width: number | undefined
    height: number | undefined
  }>({ width: undefined, height: undefined })

  const [visible, setVisible] = useState(false)
  const [shouldRemove, setShouldRemove] = useState(false)
  const [expirationTimeout, setExpirationTimeout] = useState<NodeJS.Timeout>()

  const close = () => {
    if (expirationTimeout) window.clearTimeout(expirationTimeout)
    setVisible(false)
    setShouldRemove(true)
    setTimeout(onExpire, 500)
  }

  useEffect(() => {
    setVisible(true)
    if (expire !== undefined && expire > 0) {
      setExpirationTimeout(
        setTimeout(() => {
          setVisible(false)
          setShouldRemove(true)
          setTimeout(onExpire, 500)
        }, expire)
      )
    }
  }, [expire, onExpire])

  useLayoutEffect(() => {
    if (targetRef.current) {
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight
      })
    }
  }, [])

  const typeData = alertTypes[type]
  return (
    <div
      style={{
        maxHeight: shouldRemove ? 0 : dimensions.height
      }}
      className={cn(
        'transition-all duration-500 ease-in-out',
        { 'mb-4': !shouldRemove },
        { 'mb-0': shouldRemove }
      )}
    >
      <div
        ref={targetRef}
        className={cn(
          'grid grid-cols-toast grid-rows-1',
          'rounded-md overflow-hidden',
          'text-base',
          'dark:bg-madBlack',
          'bg-madWhite shadow shadow-gray-900',
          'transition-opacity duration-500 ease-in-out shadow',
          { 'opacity-0': !visible },
          { 'opacity-100': visible }
        )}
      >
        <div
          className={cn(
            'col-start-1 col-span-1 row-start-1 row-span-1',
            'p-3 dark:text-dark-madBlack text-light-madBlack',
            `${typeData.color} `
          )}
        >
          {typeData.icon}
        </div>
        <div
          className={cn(
            'col-start-2 col-span-1 row-start-1 row-span-1',
            'overflow-hidden break-words',
            'p-3'
          )}
        >
          <div className="font-semibold">{title}</div>
          <p>{message}</p>
        </div>
        <div className={cn('col-start-3 col-span-1 row-start-1 row-span-1', 'p-3')}>
          <button onClick={close}>
            <Icon icon="fa:close" />
          </button>
        </div>
      </div>
    </div>
  )
}
