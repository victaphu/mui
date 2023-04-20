// @typed v1
import React, { useState } from 'react'
import { Attribute } from '../../types/nft'
import NftAttributeControl from './nftAttributeControl'
import NftAttributeLevelInputs from './nftAttributeLevelInputs'
import { AttributeComponent } from '../../types/containers'

export default function NftAttributeLevels({
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
}: {
  attributes: Array<Attribute>
} & AttributeComponent): JSX.Element {
  const [isEditing, setIsEditing] = useState<number>(null) // index of attribute

  return (
    <div className="flex flex-row flex-wrap -mx-1">
      {attributes?.map((a, index) => (
        <div key={'levels-' + index} className="w-1/2 px-1 mb-2 relative hover-card">
          {isEditing === index ? (
            <NftAttributeLevelInputs
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
            <>
              <div className="flex border border-gray-700 rounded-full p-1">
                <div
                  className={`bg-madPink h-1 rounded-full`}
                  style={{
                    width: (parseInt(a.value.toString()) / a.max_value) * 100 + '%'
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <p
                  title={a.trait_type}
                  className="text-sm mb-1 text-gray-500 leading-none font-normal uppercase name-ellipsis w-1/2"
                >
                  {a.trait_type}:
                </p>
                <p className="text-sm font-normal text-gray-500 leading-none w-1/2 text-right name-ellipsis">
                  <span className="text-madPink">{a.value}</span>/
                  <span className="text-madPink">{a.max_value}</span>
                </p>
              </div>
            </>
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
      {handleSave && (
        <div key="levels-new" className={`w-1/2 mb-2 px-1 ${!showInput ? 'hidden' : ''}`}>
          <NftAttributeLevelInputs
            attribute={attribute}
            handleChange={handleChange}
            handleSaveClick={handleSaveClick}
            showInput={showInput}
            setShowInput={setShowInput}
            validate={validate}
          />
        </div>
      )}
    </div>
  )
}
