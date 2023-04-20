// @typed v1
import React, { useState } from 'react'
import NftAttributeControl from './nftAttributeControl'
import NftAttributePropertyInputs from './nftAttributePropertyInputs'
import { AttributeComponent } from '../../types/containers'

export default function NftAttributeProperties({
  attributes,
  attribute,
  handleSave,
  handleDelete,
  handleChange,
  handleChangeOrder,
  handleSaveClick,
  showInput,
  setShowInput,
  validate
}: AttributeComponent): JSX.Element {
  const [isEditing, setIsEditing] = useState<number>(null) // index of attribute

  return (
    <div className="flex flex-row flex-wrap">
      {attributes?.map((a, index) => (
        <div key={'properties-' + index} className="relative hover-card hover:z-[1]">
          {isEditing === index ? (
            <NftAttributePropertyInputs
              attribute={a}
              handleChange={handleChange}
              handleSaveClick={handleSaveClick}
              showInput={showInput}
              setShowInput={setShowInput}
              validate={validate}
              setIsEditing={setIsEditing}
              isEditing={isEditing}
              index={index}
            />
          ) : (
            <div className="mb-2 flex text-center flex-col border border-gray-700 rounded-full px-4 py-3.5 mr-2">
              <p className="text-sm mb-1 text-gray-500 leading-none font-normal uppercase">
                {a.trait_type}
              </p>
              <p className={`text-sm font-normal text-madPink leading-none`}>{a.value}</p>
            </div>
          )}
          {handleSave && (
            <NftAttributeControl
              attributes={attributes}
              handleChangeOrder={handleChangeOrder}
              handleDelete={handleDelete}
              setIsEditing={setIsEditing}
              isEditing={isEditing}
              index={index}
            />
          )}
        </div>
      ))}
      {handleSave && showInput && (
        <NftAttributePropertyInputs
          attribute={attribute}
          handleChange={handleChange}
          handleSaveClick={handleSaveClick}
          showInput={showInput}
          setShowInput={setShowInput}
          validate={validate}
        />
      )}
    </div>
  )
}
