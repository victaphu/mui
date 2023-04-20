// @typed v1
import React, { useRef, useState } from 'react'
import useToaster from '../hooks/toast'
import { Attribute } from '../types/nft'
import Button from '../components/form/button'
import { Icon } from '@iconify/react'
import { AttributeContainerComponent } from '../types/containers'

export default function AttributesContainer({
  Component,
  attributes,
  attributeType,
  attributeTypeLabel,
  onSave
}: AttributeContainerComponent): JSX.Element {
  const toaster = useToaster()
  const buttonRef = useRef<HTMLButtonElement>()
  const [attributeNew, setAttributeNew] = useState<Attribute>(null)
  const [showInput, setShowInput] = useState<boolean>(false)

  const validate = (item): boolean => {
    return !!(
      item &&
      item.trait_type &&
      item.value &&
      (attributeType !== 'levels' ||
        (attributeType === 'levels' &&
          item.max_value &&
          parseInt(item.max_value) >= parseInt(item.value)))
    )
  }

  const handleChange = (key: string, value: string, index: number = null) => {
    if (index !== null) {
      const copy = [...attributes]
      copy[index] = { ...copy[index], ...{ [key]: value } }
      onSave({ [attributeType]: copy })
    } else {
      setAttributeNew({ ...attributeNew, ...{ [key]: value } })
    }
  }

  const handleSave = () => {
    if (validate(attributeNew)) {
      const copy = [...(attributes || []), ...[attributeNew]]
      onSave({ [attributeType]: copy })
      setAttributeNew(null)
      return true
    } else {
      toaster.error('Input error', 'Please correct the data to save your new ' + attributeTypeLabel)
      return false
    }
  }

  const handleDelete = (index: number) => {
    let copy = [...attributes]
    copy = copy.filter((a, i) => i != index)
    onSave({ [attributeType]: copy })
  }

  const handleChangeOrder = (index: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'down' ? (index || 0) + 1 : (index || 1) - 1
    const copy = [...attributes]
    const element = copy[index]
    copy.splice(index, 1)
    copy.splice(toIndex, 0, element)
    onSave({ [attributeType]: copy })
  }

  const handleSaveClick = () => {
    if (showInput) {
      const result = handleSave()
      if (result) {
        setShowInput(false)
        if (buttonRef?.current) buttonRef.current.focus()
      }
    } else {
      setShowInput(true)
    }
  }

  const handleCancel = () => {
    setAttributeNew(null)
    setShowInput(false)
  }

  return (
    <div>
      <Component
        attributes={attributes}
        attribute={attributeNew}
        handleSave={handleSave}
        handleChange={handleChange}
        handleDelete={handleDelete}
        handleChangeOrder={handleChangeOrder}
        handleSaveClick={handleSaveClick}
        showInput={showInput}
        setShowInput={setShowInput}
        validate={validate}
      />
      <div className="flex gap-2">
        <Button
          buttonRef={buttonRef}
          colour="madPink"
          hoverColour="madBlack"
          onClick={handleSaveClick}
          className={`text-xs ${attributes?.length > 0 ? 'mt-2' : ''}`}
        >
          <>
            <Icon icon={'fa6-solid:plus'} className="mr-2" />
            {showInput ? 'Save ' : 'Add '} {!showInput && attributes?.length > 0 ? 'another' : ''}{' '}
            {attributeTypeLabel}
          </>
        </Button>
        {showInput && (
          <Button
            colour="madGray"
            hoverColour="madBlack"
            onClick={handleCancel}
            className={`text-xs ${attributes?.length > 0 ? 'mt-2' : ''}`}
          >
            <>
              <Icon icon={'fa6-solid:xmark'} className="mr-2" />
              Cancel
            </>
          </Button>
        )}
      </div>
    </div>
  )
}
