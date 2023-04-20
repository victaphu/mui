// @typed v1
import React from 'react'
import { Tooltip } from '../toolTip/toolTip'

const Ping = ({ text, className }: { text: string; className?: string }): JSX.Element => {
  return (
    <div className={`absolute -top-1 -left-1 z-10 ${className}`}>
      <Tooltip
        button={<div className="cursor-pointer animate-ping w-4 h-4 bg-madPink rounded-full" />}
      >
        <div className="text-center">{text}</div>
      </Tooltip>
    </div>
  )
}
export default Ping
