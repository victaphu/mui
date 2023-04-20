// @typed - MH
import { ReactNode, useEffect, useRef, useState } from 'react'
export const Tooltip = ({
  button,
  children,
  placement = 'top',
  mouseOut,
  mouseOver,
  className = 'relative flex-col items-center group inline-flex'
}: {
  button: ReactNode
  children: ReactNode
  placement?: string
  mouseOut?: (event, state: boolean) => void
  mouseOver?: (event, state: boolean) => void
  className?: string
}) => {
  const popupRef = useRef(null)
  const [open, setOpen] = useState<boolean>(false)
  const placementClass = placement === 'top' ? 'bottom-2' : placement
  useEffect(() => {
    function handleHover(event) {
      setOpen(event.type !== 'mouseout')
      if (event.type === 'mouseout' && mouseOut) {
        mouseOut(event, open)
      } else if (mouseOver) {
        mouseOver(event, open)
      }
    }
    const ref = popupRef.current
    ref.addEventListener('mouseover', handleHover)
    ref.addEventListener('mouseout', handleHover)
    return () => {
      ref.removeEventListener('mouseover', handleHover)
      ref.removeEventListener('mouseout', handleHover)
    }
  }, [mouseOut, mouseOver, open, popupRef])

  return (
    <div ref={popupRef} className={className}>
      <div className="">{button}</div>
      <div
        className={`${
          open ? 'flex' : 'hidden'
        } ${placementClass} absolute flex-col items-center mb-6`}
      >
        <div className="relative z-50 px-3 pb-2 pt-2 dark:bg-madBlack bg-madWhite rounded-lg shadow-lg shadow-madOnyx text-xs min-w-[120px]">
          {children}
        </div>
      </div>
    </div>
  )
}
