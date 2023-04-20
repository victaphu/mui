import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getSidebarOpen } from '../store/ux'

function getWindowDimensions() {
  let innerWidth = null,
    innerHeight = null
  if (typeof window !== 'undefined') {
    innerWidth = window.outerWidth
    innerHeight = window.outerHeight
  }
  return {
    width: innerWidth,
    height: innerHeight
  }
}

export default function useWindow() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())
  const [containerWidth, setContainerWidth] = useState({ width: 'calc(100% - 420px)' })
  const sidebarCollapse = useSelector<boolean>(getSidebarOpen)

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setContainerWidth({
      width: sidebarCollapse
        ? 'calc(100% - 420px)'
        : windowDimensions.width < 768
        ? '100vw'
        : 'calc(100% - 72px)'
    })
  }, [sidebarCollapse, windowDimensions])

  return { ...windowDimensions, ...{ containerWidth: containerWidth } }
}
