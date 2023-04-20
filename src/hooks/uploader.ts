import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../store/user'
import { uxAdded } from '../store/ux'
import useToaster from './toast'
import axios from 'axios'

export default function useUploader() {
  const user = useSelector(getUser)
  const toaster = useToaster()
  const dispatch = useDispatch()

  const [imgUploading, setImgUploading] = useState(false)
  const [imgData, setImgData] = useState<{ isDuplicate: boolean }>(null)
  const [percent, setPercent] = useState<number>(0)

  const getPresignedPostUrl = async (fileType: string, fileName: string) => {
    return axios.post(`/api/presign`, { fileType: fileType, fileName: fileName })
  }

  const awsUpload = async (url: string, file) => {
    return axios.put(url, file, {
      onUploadProgress: function (progressEvent) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setPercent(percentCompleted)
      },
      headers: {
        'Content-Type': file.type
      }
    })
  }

  const pinToIpfs = async (key: string) => {
    return axios.post(`/api/pin`, { key: key })
  }

  const uploadFile = async (file) => {
    event.preventDefault()
    dispatch(uxAdded({ key: 'imageUploading', value: true }))
    setImgUploading(true)
    setImgData(null)
    try {
      const key = user.id + '/' + file.name
      const signResponse = await getPresignedPostUrl(file.type, key)
      await awsUpload(signResponse.data.response, file)
      const ipfsResponse = await pinToIpfs(key)
      toaster.success('Success', 'File has been uploaded and pinned to IPFS')
      setImgData(ipfsResponse.data)
      setImgUploading(false)
      dispatch(uxAdded({ key: 'imageUploading', value: false }))
      return ipfsResponse.data
    } catch (error) {
      toaster.error('Error uploading file', error.error)
      setImgUploading(false)
      dispatch(uxAdded({ key: 'imageUploading', value: false }))
      return error
    }
  }

  return {
    imgUploading,
    setImgUploading,
    imgData,
    setImgData,
    percent,
    setPercent,
    getPresignedPostUrl,
    awsUpload,
    pinToIpfs,
    uploadFile
  }
}
