import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { Attribute } from '../../types/nft'
import { formatImageUrl } from '../../utils/utils'
import { audioMimeTypes, imageMimeTypes, videoMimeTypes } from '../../constants/config'
import Loader from '../common/loader'
import Button from '../form/button'
import Download from '../common/download'

const PlayerComponent = ({
  files,
  image,
  title,
  pagination = true,
  download = false
}: {
  files: Array<Attribute>
  image: string
  title?: string
  pagination?: boolean
  download?: boolean
}): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentDuration, setCurrentDuration] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [currentWidth, setCurrentWidth] = useState('')
  const [currentVolume, setCurrentVolume] = useState(null)
  const [current, setCurrent] = useState(null)
  const [loop, setLoop] = useState(false)
  const currentRef = useRef(null)
  const progressRef = useRef(null)

  const changeItem = useCallback(
    (direction = 'prev') => {
      let newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1
      newIndex = newIndex < 0 ? 0 : newIndex >= files.length ? files.length - 1 : newIndex
      setCurrentIndex(newIndex)
      const found = files.filter((a, i) => i === newIndex)
      setCurrent(found[0])
    },
    [currentIndex, files]
  )

  const convertTime = (value) => {
    const minute =
      Math.floor(value / 60).toString().length === 1
        ? '0' + Math.floor(value / 60)
        : Math.floor(value / 60)
    const second =
      Math.round(value % 60).toString().length === 1
        ? '0' + Math.round(value % 60)
        : Math.round(value % 60)
    return `${minute}:${second}`
  }

  const play = () => {
    currentRef.current.play()
  }

  const pause = () => {
    currentRef.current.pause()
  }

  const volumeUp = () => {
    const currentVol = currentRef.current.volume
    currentRef.current.volume = currentVol + 0.1 >= 1 ? 1 : currentVol + 0.1
    setCurrentVolume(currentRef.current.volume.toFixed(1))
  }

  const volumeDown = () => {
    const currentVol = currentRef.current.volume
    currentRef.current.volume = currentVol - 0.1 <= 0 ? 0 : currentVol - 0.1
    setCurrentVolume(currentRef.current.volume.toFixed(1))
  }

  useEffect(() => {
    if (files) {
      const found = files.filter((a, i) => i === 0)
      setCurrent(found[0])
    }
  }, [files])

  useEffect(() => {
    if (
      (current && currentRef && currentRef.current.tagName === 'AUDIO') ||
      (current && currentRef && currentRef.current.tagName === 'VIDEO')
    ) {
      const element = currentRef.current
      element.onloadedmetadata = () => {
        setCurrentDuration(convertTime(element.duration))
        setCurrentTime(convertTime(element.currentTime))
        setCurrentVolume(element.volume.toFixed(1))
        setCurrentWidth((element.currentTime / element.duration.toFixed(3)) * 100 + '%')
      }
      element.onended = () => {
        if (loop) {
          changeItem('next')
        }
      }
      setInterval(() => {
        setCurrentTime(convertTime(element.currentTime))
        setCurrentWidth((element.currentTime / element.duration.toFixed(3)) * 100 + '%')
      }, 1000)
    }
  }, [loop, current, changeItem])

  return (
    <div>
      {title && (
        <h2 className="dark:text-dark-madWhite text-light-madWhite text-xl mb-4 text-center">
          <strong>{title}</strong>
        </h2>
      )}
      <div className="relative">
        {current && (
          <div className="">
            {pagination && (
              <div className="mb-4 flex items-center justify-between">
                <Button
                  colour="madPink"
                  hoverColour="madBlack"
                  disabled={currentIndex === 0}
                  onClick={() => {
                    changeItem('prev')
                  }}
                  className={`${currentIndex === 0 ? 'disabled opacity-0' : ''}`}
                >
                  <Icon icon="fa6-solid:arrow-left" />
                </Button>
                {currentIndex + 1} / {files.length}
                <Button
                  colour="madPink"
                  hoverColour="madBlack"
                  disabled={currentIndex === files.length - 1}
                  onClick={() => {
                    changeItem('next')
                  }}
                  className={`${currentIndex === files.length - 1 ? 'disabled opacity-0' : ''}`}
                >
                  <Icon icon="fa6-solid:arrow-right" />
                </Button>
              </div>
            )}
            {current && imageMimeTypes.includes(current.display_type) ? (
              <div className="text-center flex flex-col">
                <img
                  src={formatImageUrl(current?.value)}
                  alt={current.trait_type}
                  ref={currentRef}
                  className="h-[216px] w-auto m-auto bg-madOnyx"
                />
                <span className="text-gray-500 text-xs mt-2">{current.display_type}</span>
                <span>{current.trait_type}</span>
                <div className="h-[59px]" />
              </div>
            ) : current &&
              (audioMimeTypes.includes(current.display_type) ||
                videoMimeTypes.includes(current.display_type)) ? (
              <div className="flex flex-col relative">
                {audioMimeTypes.includes(current.display_type) && (
                  <>
                    <img
                      src={formatImageUrl(image)}
                      alt={current.trait_type}
                      className="h-[216px] w-auto m-auto bg-madOnyx"
                    />
                    {/* eslint-disable react/no-unknown-property */}
                    <audio
                      playsInline={loop}
                      autoPlay={loop}
                      color="blue"
                      className="h-[216px] w-auto m-auto bg-madOnyx"
                      ref={currentRef}
                      controls={false}
                      src={formatImageUrl(current?.value)}
                    >
                      Your browser does not support the HTML5 Audio element.
                    </audio>
                  </>
                )}
                {videoMimeTypes.includes(current.display_type) && (
                  <video
                    autoPlay={loop}
                    playsInline={loop}
                    color="blue"
                    className="h-[216px] w-auto m-auto bg-madOnyx"
                    ref={currentRef}
                    controls={false}
                    src={formatImageUrl(current?.value)}
                  >
                    Your browser does not support the HTML5 Video element.
                  </video>
                )}
                <span className="text-gray-500 text-xs mt-2 m-auto">{current.display_type}</span>
                <div className="text-center">{current.trait_type}</div>
                <div className="flex items-center w-full  justify-between" ref={progressRef}>
                  <span className="start">{currentTime}</span>
                  <div className="progress-bar">
                    <div className="now" style={{ width: currentWidth }} />
                  </div>
                  <span className="end">{currentDuration}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 justify-center">
                  <Button
                    colour="madPink"
                    hoverColour="madBlack"
                    className={`px-1 w-8 h-8 justify-center ${loop ? '' : 'opacity-40'}`}
                    onClick={() => {
                      setLoop(!loop)
                    }}
                  >
                    <Icon icon="fa6-solid:infinity" />
                  </Button>
                  <Button
                    colour="madPink"
                    hoverColour="madBlack"
                    className="px-1 w-8 h-8 justify-center"
                    onClick={play}
                  >
                    <Icon icon="fa6-solid:play" />
                  </Button>
                  <Button
                    colour="madPink"
                    hoverColour="madBlack"
                    className="px-1 w-8 h-8 justify-center"
                    onClick={pause}
                  >
                    <Icon icon="fa6-solid:pause" />
                  </Button>
                  <Button
                    colour="madPink"
                    hoverColour="madBlack"
                    className={`px-1 w-8 h-8 justify-center ${
                      currentVolume === '0.0' ? 'disabled' : ''
                    }`}
                    disabled={currentVolume === '0.0'}
                    onClick={volumeDown}
                  >
                    <Icon icon="fa:volume-down" />
                  </Button>
                  <span className="text-gray-500">{currentVolume}</span>
                  <Button
                    colour="madPink"
                    hoverColour="madBlack"
                    disabled={currentVolume === '1.0'}
                    className={`px-1 w-8 h-8 justify-center ${
                      currentVolume === '1.0' ? 'disabled' : ''
                    }`}
                    onClick={volumeUp}
                  >
                    <Icon icon="fa:volume-up" />
                  </Button>
                </div>
              </div>
            ) : current ? (
              <div ref={currentRef} className="text-center flex flex-col">
                <Icon
                  ref={currentRef}
                  icon="fa6-solid:file-circle-question"
                  className="text-9xl m-auto my-4 h-[156px]"
                />
                <span className="text-gray-500 text-xs mt-2">{current.display_type}</span>
                <span>{current.trait_type}</span>
                <p className="text-gray-500 mt-4">
                  This file format is currently not displayable on the MAD website. The NFT creator
                  may use this format for downloadable assets.
                </p>
              </div>
            ) : (
              <div ref={currentRef} className="text-center flex flex-col">
                <Loader />
              </div>
            )}
            {current && download && <Download file={current} className="mt-8 text-xs" />}
          </div>
        )}
      </div>
    </div>
  )
}
export default PlayerComponent
