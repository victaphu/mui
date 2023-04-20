// @typed v1
import { Icon } from '@iconify/react'
import React, { useEffect } from 'react'
import useTimer from '../../hooks/timer'

export default function TimerComponent({
  time,
  text = 'Ended',
  className
}: {
  time: number
  text: string
  className?: string
}): JSX.Element {
  const timer = useTimer()

  useEffect(() => {
    if (!timer.endTime && time) {
      timer.setEndTime(time)
    }
  }, [time, timer])

  return (
    <p className={`text-sm font-normal whitespace-nowrap ${className}`}>
      {timer.countdown ? (
        <>
          <Icon icon="fa6-solid:stopwatch" className="mr-1.5" />
          {timer.countdown}
        </>
      ) : (
        text
      )}
    </p>
  )
}
