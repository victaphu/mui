// @typed v1
import React, { useEffect, useRef } from 'react'
import Input from '../form/input'
import { AttributeComponent } from '../../types/containers'

export default function NftAttributePropertyInputs({
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

  useEffect(() => {
    if (isEditing && inputRefKey.current) {
      inputRefKey.current.focus()
    }
  }, [isEditing, inputRefKey])

  const onBlur = () => {
    if (index !== null) return
    if (!attribute || (!attribute.trait_type && !attribute.value)) {
      setShowInput(false)
    } else if (validate(attribute)) {
      handleSaveClick()
      setShowInput(false)
    }
  }

  const onKeyPress = (event) => {
    if (index === null && event.key === 'Enter') {
      handleSaveClick()
    }
    if (index !== null && event.key === 'Enter' && validate(attribute)) {
      setIsEditing(null)
    }
  }

  return (
    <div className="mb-2 flex text-center flex-col border border-gray-700 rounded-full px-4 pt-1.5 mr-2">
      <Input
        wrapperClassName="relative w-32"
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
        className="w-32 p-0 m-0 mb-1 px-1 py-[0px] pr-12 text-sm border-transparent block text-gray-500 uppercase"
      />
      <Input
        wrapperClassName="relative w-32"
        countClassName="absolute right-2 top-[1px] z-10 opacity-50"
        countText={false}
        max={16}
        placeholder="Value..."
        inputRef={inputRefValue}
        value={attribute?.value || ''}
        name="new-trait_type"
        onChange={(v) => handleChange('value', v.toString(), index)}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
        className="w-32 p-0 m-0 mb-1 px-1 py-[0px] pr-12 placeholder-red-700 text-sm border-transparent block dark:text-madPink light:text-madPink"
      />
    </div>
  )
}
