import { useEffect, useState } from 'react'

export default function useTimer() {
  const [timer, setTimer] = useState<number>(0)
  const [countdownObject, setCountdownObject] = useState<{
    days?
    hours?
    minutes?
    seconds?
  }>({})
  const [countdown, setCountdown] = useState<string>('')
  const [startTime, setStartTime] = useState<number>(0)
  const [endTime, setEndTime] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((seconds) => seconds + 1)
    }, 1000)
    if (countdown === 'Closed') {
      clearInterval(interval)
      setTimer(0)
    }
    return () => clearInterval(interval)
  }, [countdown])

  useEffect(() => {
    if (!endTime) return
    const start = startTime ? startTime : new Date().getTime()
    const distance = parseInt(endTime.toString()) * 1000 - parseInt(start.toString())
    const days = distance > 0 ? Math.floor(distance / (1000 * 60 * 60 * 24)) : 0
    const hours =
      distance > 0 ? Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : 0
    const minutes = distance > 0 ? Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) : 0
    const seconds = distance > 0 ? Math.floor((distance % (1000 * 60)) / 1000) : 0
    if (distance > 0) {
      setCountdown(
        (days > 0 ? days + 'd ' : '') +
          (days < 100 ? hours + 'h ' : '') +
          (days < 1 ? minutes + 'm ' : '') +
          (days < 1 ? seconds + 's' : '')
      )
      setCountdownObject({
        days,
        hours,
        minutes,
        seconds
      })
    } else {
      setCountdown('Closed')
    }
  }, [timer, startTime, endTime])

  return {
    countdown,
    countdownObject,
    timer,
    setStartTime,
    setEndTime,
    startTime,
    endTime
  }
}
