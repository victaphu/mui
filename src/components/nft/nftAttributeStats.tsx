// @typed v1
import React, { useState } from 'react'
import NftAttributeControl from './nftAttributeControl'
import NftAttributeStatInputs from './nftAttributeStatInputs'
import { AttributeComponent } from '../../types/containers'

export default function NftAttributeStats({
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
    <div className="flex flex-row flex-wrap -mx-2">
      {attributes?.map((stat, index) => {
        return (
          <div
            key={'stats-' + index}
            className="flex flex-col items-center mx-2 mb-3 relative hover-card hover:z-[1]"
          >
            {isEditing === index ? (
              <NftAttributeStatInputs
                attribute={stat}
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
                <div className="flex text-center flex-col border border-madPink rounded-[50%] px-4 py-2 h-[5rem] w-[5rem] justify-center">
                  <p
                    className={`text-lg text-madPink leading-none font-bold text-center name-ellipsis`}
                    title={stat.value.toString()}
                  >
                    {stat.value}
                  </p>
                </div>
                <span
                  title={stat.trait_type}
                  className="mt-1 w-full text-xs leading-none font-normal uppercase text-center text-gray-500"
                >
                  {stat.trait_type}
                </span>
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
        )
      })}
      {handleSave && (
        <div className={`${!showInput ? 'hidden' : ''} flex flex-col items-center mx-2 mb-3`}>
          <NftAttributeStatInputs
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
