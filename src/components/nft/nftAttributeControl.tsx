// @typed v1
import React from 'react'
import { Attribute } from '../../types/nft'
import Button from '../form/button'
import { Icon } from '@iconify/react'
import { Tooltip } from '../toolTip/toolTip'
import { AttributeComponent } from '../../types/containers'

export default function NftAttributeControl({
  index,
  attributes,
  handleDelete,
  handleChangeOrder,
  className,
  setIsEditing,
  isEditing
}: {
  index: number
  attributes: Array<Attribute>
  className?: string
  setIsEditing?: (bool: number) => void
  isEditing?: number
} & AttributeComponent): JSX.Element {
  return (
    <div
      className={`absolute left-0 margin-auto -top-6 flex gap-1 hover-hide bg-madWhite dark:bg-madBlack p-1 shadow shadow-madOnyx rounded-full animate-in fade-in duration-200 ${className}`}
    >
      {isEditing !== index ? (
        <>
          <Tooltip
            placement="bottom-2"
            button={
              <Button
                onClick={() => setIsEditing(index)}
                colour="madGray"
                hoverColour="madBlack"
                className="bg-madBlack text-xs w-7 h-7 px-[2px] justify-center"
              >
                <Icon icon="fa6-solid:pencil" />
              </Button>
            }
          >
            <div className="text-center">Edit attribute</div>
          </Tooltip>
          <Tooltip
            placement="bottom-2"
            button={
              <Button
                onClick={() => handleDelete(index)}
                colour="madGray"
                hoverColour="madBlack"
                className="bg-madBlack text-xs w-7 h-7 px-[2px] justify-center"
              >
                <Icon icon="fa6-solid:xmark" />
              </Button>
            }
          >
            <div className="text-center">Delete attribute</div>
          </Tooltip>
          <Tooltip
            placement="bottom-2"
            button={
              <Button
                onClick={() => handleChangeOrder(index, 'up')}
                disabled={index === 0}
                colour="madGray"
                hoverColour="madBlack"
                className={`bg-madBlack text-xs w-7 h-7 px-[2px] justify-center ${
                  index === 0 ? 'disabled' : ''
                }`}
              >
                <Icon icon="fa6-solid:arrow-up" />
              </Button>
            }
          >
            <div className="text-center">Move up</div>
          </Tooltip>
          <Tooltip
            placement="bottom-2"
            button={
              <Button
                onClick={() => handleChangeOrder(index, 'down')}
                disabled={index === attributes.length - 1}
                colour="madGray"
                hoverColour="madBlack"
                className={`bg-madBlack text-xs w-7 h-7 px-[2px] justify-center ${
                  index === attributes.length - 1 ? 'disabled' : ''
                }`}
              >
                <Icon icon="fa6-solid:arrow-down" />
              </Button>
            }
          >
            <div className="text-center">Move down</div>
          </Tooltip>
        </>
      ) : (
        <>
          <Tooltip
            placement="bottom-2"
            button={
              <Button
                onClick={() => setIsEditing(null)}
                colour="madGray"
                hoverColour="madBlack"
                className="bg-madBlack text-xs w-7 h-7 px-[2px] justify-center"
              >
                <Icon icon="fa6-solid:check" />
              </Button>
            }
          >
            <div className="text-center">Update attribute</div>
          </Tooltip>
          <Tooltip
            placement="bottom-2"
            button={
              <Button
                onClick={() => handleDelete(index)}
                colour="madGray"
                hoverColour="madBlack"
                className="bg-madBlack text-xs w-7 h-7 px-[2px] justify-center"
              >
                <Icon icon="fa6-solid:xmark" />
              </Button>
            }
          >
            <div className="text-center">Delete attribute</div>
          </Tooltip>
        </>
      )}
    </div>
  )
}
