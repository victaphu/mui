// @typed v1
import React, { useEffect, useRef } from 'react'
import Input from '../form/input'
import { AttributeComponent } from '../../types/containers'

export default function NftAttributeStatInputs({
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
      //setShowInput(false)
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
    <>
      <div className="flex text-center flex-col border border-madPink rounded-[50%] px-4 py-2 h-[5rem] w-[5rem] justify-center">
        <Input
          type="number"
          max={1000000000}
          countText={false}
          placeholder="1"
          inputRef={inputRefKey}
          focus={showInput}
          name="new-trait_type"
          value={attribute?.value || ''}
          onKeyPress={onKeyPress}
          onChange={(v) => handleChange('value', v.toString(), index)}
          className="p-0 m-0 dark:text-madPink light:text-madPink leading-none font-bold text-center placeholder-red-700 px-0 py-0 border-transparent"
        />
      </div>
      <div
        title={attribute?.trait_type}
        className="mt-1 w-full text-xs text-madPink leading-none font-normal uppercase text-center"
      >
        <Input
          wrapperClassName="relative"
          countClassName="absolute right-2 top-[1px] z-10 opacity-50"
          countText={false}
          max={16}
          placeholder="Title..."
          inputRef={inputRefValue}
          value={attribute?.trait_type || ''}
          name="new-trait_type"
          onChange={(v) => handleChange('trait_type', v.toString(), index)}
          onBlur={onBlur}
          onKeyPress={onKeyPress}
          className="w-[100px] py-[2px] pr-12 m-0 leading-none px-0 py-0 pl-2 border-transparent"
        />
      </div>
    </>
  )
}
