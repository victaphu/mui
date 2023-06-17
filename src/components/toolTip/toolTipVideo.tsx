// @typed - MH
import { Icon } from '@iconify/react'
import React, { useRef } from 'react'
import Link from '../common/link'
import { Tooltip } from './toolTip'
// import { log } from '../../utils/log'

export const ToolTipVideo = ({
  placement = 'top',
  intro,
  title,
  src,
  className
}: {
  placement: string
  intro: string
  title: string
  src: string
  className?: string
}) => {
  const videoRef = useRef(null)
  // const playVideo = () => {
  //   try {
  //     videoRef.current.play()
  //   } catch (e) {
  //     log('mad:playVideo', e, 'error')
  //   }
  // }
  const pauseVideo = () => {
    videoRef.current.pause()
  }
  return (
    <div className={`inline-flex text-md font-medium ${className}`}>
      <Tooltip
        mouseOut={pauseVideo}
        placement={placement}
        button={<Icon icon="fa:question-circle" />}
      >
        <div className="text-center w-64">
          {intro}
          <p className="my-1 border-t border-gray-500 text-left pt-1">
            <span className="text-madPink">
              <Icon icon="fa6-solid:graduation-cap" /> Academy
            </span>{' '}
            - {title}
          </p>
          <video ref={videoRef} controls={true} src={src}>
            Your browser does not support the HTML5 Video element.
          </video>
        </div>
        <Link
          href="https://academy.madnfts.io"
          external={true}
          className="text-madBlue text-right block mt-1"
        >
          Visit MADAcademy
        </Link>
      </Tooltip>
    </div>
  )
}
