import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'

const TitleContent = (props): JSX.Element => {
  const {
    showSidebar,
    titleHeader,
    titleText,
    titleSubText,
    paragraphText,
    paragraphHighlightedText,
    paragraphContinuation
  } = props
  const router = useRouter()
  const [iconClass, setIconClass] = useState<string>('store')
  useEffect(() => {
    switch (router.pathname) {
      case '/marketplace':
        setIconClass('store')
        break
      case '/collections':
        setIconClass('layer-group')
        break
      case '/creators':
        setIconClass('user-large')
        break
      default:
        break
    }
  }, [router])

  return (
    <>
      {!showSidebar ? (
        <></>
      ) : (
        <div className="flex w-full p-5 flex-col dark:bg-madBlack bg-madWhite border-b border-zinc-800">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-row">
              <div className="my-auto">
                <Icon icon={iconClass} className="w-8 fa-solid fa-store text-2xl text-madPink" />
              </div>
              <div className="" style={{ marginLeft: '5px' }}>
                <span className="tracking-[-0.08em] text-xl font-bold dark:text-dark-madWhite text-light-madWhite">
                  <span className="tracking-[-0.04em] inline-block align-text-bottom font-normal text-sm uppercase text-gray-500">
                    {titleHeader}
                  </span>
                  <br></br>
                  <span className="inline-block align-text-top" style={{ lineHeight: 0.4 }}>
                    <span>{titleText}</span>
                    <span className="text-madPink">{titleSubText}</span>.
                  </span>
                </span>
              </div>
            </div>
          </div>
          <p className="font-normal text-sm">
            {paragraphText}
            <span>{paragraphHighlightedText}</span> {paragraphContinuation}
          </p>
        </div>
      )}
    </>
  )
}

export default TitleContent
