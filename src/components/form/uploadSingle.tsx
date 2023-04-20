// @typed - MH
import React from 'react'
import Loader from '../common/loader'
import { Icon } from '@iconify/react'
import { formatImageUrl } from '../../utils/utils'
import useUploader from '../../hooks/uploader'
import { domain } from '../../constants/domain'
import useToaster from '../../hooks/toast'
import { useSelector } from 'react-redux'
import { getImageUploading } from '../../store/ux'

export default function UploadSingle({
  children,
  className = '',
  image,
  saveFile,
  disabled = false
}: {
  children?: JSX.Element | JSX.Element[] | string
  className?: string
  image: string
  saveFile: (asset: string) => void
  deleteFile: () => void
  disabled?: boolean
}): JSX.Element {
  const { uploadFile, imgUploading, percent } = useUploader()
  const globalImageUploading = useSelector<boolean>(getImageUploading)

  const toaster = useToaster()
  const handleUploadFile = async (event) => {
    event.preventDefault()
    if (globalImageUploading || imgUploading) return
    if (!event.target?.files[0]) return
    const maxFileSize = 1024 * 1024 * 50
    if (event?.target?.files[0]?.size > maxFileSize) {
      toaster.error('Image error', 'File is too large, max 50mb')
      return
    }
    const response = await uploadFile(event.target.files[0])
    saveFile(domain.ipfsSavePrefix + response.IpfsHash)
  }

  return (
    <label
      className={`relative ${className} ${
        disabled ? 'disabled' : 'cursor-pointer'
      } bg-madOnyx hover-card`}
    >
      {globalImageUploading && (
        <div className="absolute z-[2] top-0 bottom-0 left-0 right-0 dark:bg-madCarbon bg-madWhite rounded-md text-center flex flex-col">
          <Loader className="flex flex-col justify-center my-auto" />
        </div>
      )}
      {imgUploading && (
        <div className="absolute z-[2] top-0 bottom-0 left-0 right-0 dark:bg-madCarbon bg-madWhite rounded-md text-center flex flex-col">
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
      {image && (
        <img
          src={formatImageUrl(image, 320, 320)}
          alt="NFT Display Image"
          className="rounded top-0 left-1/2 transform -translate-x-1/2 object-center object-cover max-w-initial h-full m-auto absolute self-center"
        />
      )}
      <div
        className={`absolute z-[1] top-0 bottom-0 left-0 right-0 flex items-center justify-center w-full bg-madOnyx bg-opacity-90 ${
          image ? 'hover-hide' : ''
        }`}
      >
        <div className="flex flex-col">
          <div className="mb-2 block relative flex items-center border uppercase rounded-full py-1.5 px-3 tracking-[-0.08em] duration-300 border-madPink text-madPink hover:bg-madPink hover:text-madBlack hover:border-madBlack m-auto">
            <Icon icon="fa6-solid:upload" className="mr-2" />
            {image ? 'Replace' : 'Upload'} Image
          </div>
          <p className="text-center font-normal text-gray-500 px-6">
            <strong>Max 50MB</strong>, Formats: JPG, PNG, GIF OR WEBP
          </p>
        </div>
      </div>
      {!globalImageUploading && !imgUploading && (
        <input
          disabled={disabled}
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.webp"
          onChange={handleUploadFile}
          className="absolute inset-0 w-full h-full ring-madPink/80 ring-opacity-0 rounded-full"
          style={{ zIndex: -666, opacity: 0 }}
        />
      )}
      {children}
    </label>
  )
}
