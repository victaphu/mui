// @typed v1
import { Icon } from '@iconify/react'
import React from 'react'
import { Tooltip } from '../toolTip/toolTip'
import { Attribute } from '../../types/nft'
import { audioMimeTypes, imageMimeTypes, videoMimeTypes } from '../../constants/config'
import { formatImageUrl } from '../../utils/utils'

export default function NftAttributeFile({ attribute }: { attribute: Attribute }): JSX.Element {
  return (
    <>
      <div className="flex items-center">
        <div className="shrink-0 mr-2">
          {imageMimeTypes.includes(attribute.display_type) ? (
            <img alt="preview" src={formatImageUrl(attribute.value.toString())} className="w-10" />
          ) : videoMimeTypes.includes(attribute.display_type) ? (
            <Icon icon="fa6-solid:file-video" className="w-10 text-5xl mr-1" />
          ) : audioMimeTypes.includes(attribute.display_type) ? (
            <Icon icon="fa6-solid:file-audio" className="w-10 text-5xl mr-1" />
          ) : (
            <Tooltip
              button={<Icon icon="fa6-solid:file-circle-question" className="w-10 text-5xl mr-1" />}
            >
              This file format ({attribute.display_type}) is currently not displayable on the MAD
              website.
            </Tooltip>
          )}
        </div>
        <div>
          <span className="name-ellipsis">{attribute.trait_type}</span>
        </div>
      </div>
    </>
  )
}
