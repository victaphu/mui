// @typed v1
import React, { useEffect, useRef, useState } from 'react'
import Input from '../form/input'
import { AttributeComponent } from '../../types/containers'

export default function NftAttributeLevelInputs({
  index = null,
  attribute,
  handleChange,
  handleSaveClick,
  showInput,
  setShowInput,
  setIsEditing,
  isEditing,
  validate
}: {
  index?: number
  setIsEditing?: (bool: number) => void
  isEditing?: number
} & AttributeComponent): JSX.Element {
  const inputRefKey = useRef<HTMLInputElement>()
  const inputRefValue = useRef<HTMLInputElement>()
  const [newLevelWidth, setNewLevelWidth] = useState<{ width: string }>({ width: null })

  useEffect(() => {
    if (isEditing && inputRefKey.current) {
      inputRefKey.current.focus()
    }
  }, [isEditing])

  useEffect(() => {
    setNewLevelWidth({
      width:
        (parseInt(attribute?.value ? attribute.value.toString() : '0') / attribute?.max_value ||
          0) *
          100 +
        '%'
    })
  }, [attribute])

  const validateMax = () => {
    if (
      !attribute?.max_value ||
      parseInt(attribute?.max_value?.toString()) < parseInt(attribute?.value.toString())
    ) {
      handleChange('max_value', attribute?.value?.toString())
    }
  }

  const validateMin = () => {
    if (
      !attribute?.value ||
      parseInt(attribute?.value.toString()) > parseInt(attribute?.max_value?.toString())
    ) {
      handleChange('value', attribute?.max_value?.toString())
    }
  }

  const onBlurMin = () => {
    validateMax()
  }

  const onBlurMax = () => {
    if (index === null && validate(attribute)) {
      handleSaveClick()
    }
    validateMin()
    if (index === null) return
    if (!attribute || (!attribute.trait_type && !attribute.value && !attribute.max_value)) {
      setShowInput(false)
    }
  }

  const onKeyPress = (event) => {
    if (index === null && event.key === 'Enter') {
      handleSaveClick()
    }
    if (index !== null && event.key === 'Enter') {
      setIsEditing(null)
    }
  }

  return (
    <>
      <div className="flex border border-gray-700 rounded-full p-1">
        <div className={`bg-madPink h-1 rounded-full`} style={newLevelWidth} />
      </div>
      <div className="flex ml-auto justify-between mt-1">
        <div>
          <Input
            wrapperClassName="relative w-24"
            countClassName="absolute right-2 top-[1px] z-10 opacity-50"
            countText={false}
            max={16}
            placeholder="Title..."
            inputRef={inputRefKey}
            focus={showInput}
            name="new-trait_type"
            value={attribute?.trait_type || ''}
            onChange={(v) => handleChange('trait_type', v.toString(), index)}
            onKeyPress={onKeyPress}
            className="py-[2px] pl-1 pr-12 border-transparent text-xs mb-1 text-gray-500 leading-none font-normal uppercase"
          />
        </div>
        <p className="text-sm font-normal leading-none w-1/2 text-right flex justify-between">
          <Input
            wrapperClassName="relative"
            countClassName="absolute right-2 top-[1px] z-10 opacity-50"
            countText={false}
            max={attribute?.max_value}
            min={0}
            type="number"
            placeholder="1"
            inputRef={inputRefValue}
            value={attribute?.value || ''}
            name="new-trait_type"
            onChange={(v) => handleChange('value', v.toString(), index)}
            onKeyPress={onKeyPress}
            onBlur={onBlurMin}
            className="placeholder-red-700 py-[2px] shrink-0 w-[50px] border-transparent text-center dark:text-madPink light:text-madPink"
          />{' '}
          <span className="p-1 m-auto">/</span>
          <Input
            wrapperClassName="relative"
            countClassName="absolute right-2 top-[1px] z-10 opacity-50"
            countText={false}
            type="number"
            placeholder="2"
            inputRef={inputRefValue}
            min={parseInt(attribute?.value?.toString()) || 1}
            value={attribute?.max_value || ''}
            name="new-trait_type"
            onChange={(v) => handleChange('max_value', v.toString(), index)}
            onBlur={onBlurMax}
            onKeyPress={onKeyPress}
            className="placeholder-red-700 py-[2px] shrink-0 w-[50px] border-transparent text-center dark:text-madPink light:text-madPink"
          />
        </p>
      </div>
    </>
  )
}
