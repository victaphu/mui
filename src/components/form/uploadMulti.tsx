// @typed - MH
import React, { useRef, useState } from 'react'
import Loader from '../common/loader'
import { Icon } from '@iconify/react'
import Button from './button'
import { Attribute } from '../../types/nft'
import useUploader from '../../hooks/uploader'
import { domain } from '../../constants/domain'
import Popup from '../common/popup'
import Input from './input'
import NftAttributeFile from '../nft/nftAttributeFile'
import PlayerComponent from '../player/player'
import Label from './label'
import Download from '../common/download'

export default function UploadMulti({
  placeholderImage = '/bg-404.jpg',
  children,
  className,
  files,
  saveFiles,
  deleteFile
}: {
  placeholderImage?: string
  children?: JSX.Element | JSX.Element[] | string
  className?: string
  files: Array<Attribute>
  saveFiles: (assets: Array<Attribute>) => void
  deleteFile: (assets: Array<Attribute>) => void
}): JSX.Element {
  const { uploadFile, setImgData, imgUploading, percent } = useUploader()
  const [imageDetails, setImageDetails] = useState<Attribute>(null)
  const inputFocusRef = useRef()

  const handleChangeOrder = (index: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'down' ? (index || 0) + 1 : (index || 1) - 1
    const copy = [...files]
    const element = copy[index]
    copy.splice(index, 1)
    copy.splice(toIndex, 0, element)
    saveFiles(copy)
  }

  const uploadMultiFile = async (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    if (!file) return
    const response = await uploadFile(file)
    const data = files ? [...files] : []
    data.push({
      trait_type: file.name,
      display_type: file.type,
      value: domain.ipfsSavePrefix + response.IpfsHash
    })
    saveFiles(data)
  }

  const handleDeleteFileMulti = (value) => {
    let data = [...files]
    data = data.filter((image) => {
      return value.value != image.value
    })
    deleteFile(data)
    setImgData(null)
  }

  const handleEditFileMulti = (value, field) => {
    const data = [...files]
    data.map((image, index) => {
      if (imageDetails.value === image.value) {
        data[index] = { ...data[index], ...{ [field]: value } }
        setImageDetails(data[index])
      }
    })
    saveFiles(data)
  }

  const closePopup = () => {
    setImageDetails(null)
  }

  return (
    <div className={className}>
      {imageDetails && (
        <Popup title="Edit file" closePopup={closePopup}>
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="flex flex-col gap-4 w-full shrink-0 md:w-[260px]">
              <Input
                value={imageDetails.trait_type}
                name="trait_type"
                label="Name"
                info="Update the display name of your file"
                onChange={(v) => handleEditFileMulti(v, 'trait_type')}
                focus={true}
                inputRef={inputFocusRef}
              />
              <Input
                value={imageDetails.display_type}
                name="display_type"
                label="Type"
                info="Automatically set from files mime type"
                disabled={true}
                onChange={() => {}}
              />
              <div className="flex mt-4">
                <Button
                  colour="madPink"
                  hoverColour="madBlack"
                  onClick={() => setImageDetails(null)}
                >
                  Done
                </Button>
                <Download file={imageDetails} className="text-normal ml-2" />
              </div>
            </div>
            <div className="w-full">
              <Label name="player" label="File Preview" />
              <PlayerComponent
                files={[imageDetails]}
                title=""
                image={placeholderImage}
                pagination={false}
              />
            </div>
          </div>
        </Popup>
      )}
      {imgUploading && (
        <div className="absolute top-0 bottom-0 left-0 right-0 dark:bg-madCarbon bg-madWhite z-10 rounded-md text-center flex flex-col">
          <Loader className="flex flex-col justify-center mt-auto" />
          <div className="rounded rounded-full h-2 bg-madGray mx-4 my-2">
            <div style={{ width: percent + '%' }} className="rounded rounded-full h-2 bg-madPink" />
          </div>
          <div className="text-sm">{percent < 100 ? 1 : 2} / 2</div>
          <div className="text-sm text-madGray mb-auto">
            {percent < 100 ? <>Uploading {percent}%</> : <>Pinning to IPFS, please wait</>}
          </div>
        </div>
      )}
      <label className="relative fill-madBlue hover:fill-madBlack flex">
        <input
          type="file"
          onChange={uploadMultiFile}
          className="absolute inset-0 ring-madPink/80 ring-opacity-0 rounded-full"
          style={{ opacity: 0 }}
        />
        <div className="text-xs mb-2 block relative flex items-center border uppercase rounded-full py-1.5 px-3 tracking-[-0.08em] duration-300 border-madPink text-madPink hover:bg-madPink hover:text-madBlack hover:border-madBlack">
          <Icon icon="fa6-solid:upload" className="mr-2" />
          <span>Upload {files.length > 0 ? 'another' : ''} file</span>
        </div>
      </label>
      <p className="text-gray-500">
        <strong>Max 50MB</strong>, any format
      </p>
      {files && files.length > 0 && (
        <div className="flex flex-col w-full mt-4">
          {files.map((item, index) => (
            <div
              key={index}
              className="flex border-b border-zinc-700 justify-between items-center mb-2 pb-2"
            >
              <NftAttributeFile attribute={item} />
              <Button
                className={`dark:px-0 light:px-0 h-6 w-6 justify-center ml-auto shrink-0 ${
                  index === 0 ? 'disabled' : ''
                }`}
                disabled={index === 0}
                colour="madGray"
                hoverColour="madBlack"
                onClick={() => handleChangeOrder(index, 'up')}
              >
                <Icon icon="fa6-solid:arrow-up" className="h-3 w-3" />
              </Button>
              <Button
                className={`dark:px-0 light:px-0 h-6 w-6 justify-center ml-2 shrink-0 ${
                  index === files.length - 1 ? 'disabled' : ''
                }`}
                disabled={index === files.length - 1}
                colour="madGray"
                hoverColour="madBlack"
                onClick={() => handleChangeOrder(index, 'down')}
              >
                <Icon icon="fa6-solid:arrow-down" className="h-3 w-3" />
              </Button>
              <Button
                className="dark:px-0 light:px-0 h-6 w-6 justify-center ml-2 shrink-0"
                colour="madGray"
                hoverColour="madBlack"
                onClick={() => handleDeleteFileMulti(item)}
              >
                <Icon icon="fa6-solid:xmark" className="h-3 w-3" />
              </Button>
              <Button
                className="dark:px-0 light:px-0 h-6 w-6 justify-center ml-2 shrink-0"
                colour="madPink"
                hoverColour="madBlack"
                onClick={() => setImageDetails(item)}
              >
                <Icon icon="fa6-solid:pencil" className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      {children}
      {/*files && imgData && imgData?.isDuplicate && (
        <p className="dark:text-dark-madWhite text-light-madWhite relative z-10 text-sm p-2 mt-4 rounded-lg dark:bg-madBlack bg-madWhite">
          <Icon icon="fa:exclamation-circle" className="mr-2 text-madPink" />
          You have uploaded a duplicate asset, be sure you have the rights to use this asset before
          continuing
        </p>
      )*/}
    </div>
  )
}
