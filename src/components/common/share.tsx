// @typed - MH
import React, { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { InlineShareButtons } from 'sharethis-reactjs'
import Button from '../form/button'
import useCrudObjectApi from '../../hooks/api/crudObject'
import Loader from './loader'

export default function Share({
  url,
  className,
  btnClassName = 'flex items-center justify-center w-8 h-8 dark:text-dark-madWhite text-light-madWhite dark:bg-madBlack bg-madWhite rounded-full dark:hover:bg-dark-madCarbon hover:bg-light-madCarbon shadow-md shadow-black/50',
  model_id,
  model_type
}: {
  url: string
  className?: string
  btnClassName?: string
  model_id?: string
  model_type?: string
}): JSX.Element {
  const [showBox, setShowBox] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const { postData, dataLoading } = useCrudObjectApi()
  const shareWithMad = async () => {
    if (dataLoading) return
    await postData('share', { model_id, model_type })
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (showBox && popupRef.current && !popupRef.current.contains(event.target)) {
        setShowBox(false)
        event.preventDefault()
        event.stopPropagation()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [popupRef, setShowBox, showBox])

  return (
    <div className={`flex justify-center w-full relative ${className}`}>
      <button type="button" className={btnClassName}>
        <Icon
          icon="fa6-solid:share-nodes"
          className="fa-solid leading-none fa-share-nodes m-1 text-sm"
          onClick={() => {
            setShowBox(!showBox)
          }}
        />
      </button>
      {showBox ? (
        <div
          ref={popupRef}
          className="absolute rounded-md dropdown-box shadow-black/30 shadow-lg dark:bg-madCarbon bg-madWhite text-white top-[100%] w-[208px]"
        >
          <div>
            {model_id && model_type && (
              <Button
                onClick={shareWithMad}
                colour="madPink"
                hoverColour="madPink"
                className="rounded-md hover:bg-transparent transform hover:-translate-y-[4px] inline-flex h-[40px] w-[60px] m-[1px]"
              >
                {dataLoading ? (
                  <Loader imgClassName="w-6 h-6" />
                ) : (
                  <img
                    src="/logo.svg"
                    alt="Share via MADNFTs"
                    width="20"
                    height="10"
                    className="block m-auto"
                  />
                )}
              </Button>
            )}
            <InlineShareButtons
              config={{
                alignment: 'center', // alignment of buttons (left, center, right)
                color: 'social', // set the color of buttons (social, white)
                enabled: true, // show/hide buttons (true, false)
                font_size: 16, // font size for the buttons
                labels: null, // button labels (cta, counts, null)
                language: 'en', // which language to use (see LANGUAGES)
                networks: [
                  // which networks to include (see SHARING NETWORKS)
                  'whatsapp',
                  'linkedin',
                  'messenger',
                  'facebook',
                  'twitter'
                ],
                padding: 20, // padding within buttons (INTEGER)
                radius: 10, // the corner radius on each button (INTEGER)
                show_total: false,
                size: 40, // the size of each button (INTEGER)

                // OPTIONAL PARAMETERS
                url: url // (defaults to current url)
                // image: 'https://bit.ly/2CMhCMC',  // (defaults to og:image or twitter:image)
                // description: 'custom text',       // (defaults to og:description or twitter:description)
                // title: 'custom title',            // (defaults to og:title or twitter:title)
                // message: 'custom email text',     // (only for email sharing)
                // subject: 'custom email subject',  // (only for email sharing)
                // username: 'custom twitter handle' // (only for twitter sharing)
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
