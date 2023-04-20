import { useState } from 'react'
import client from '../../utils/client'
import useToaster from '../toast'
import { domain } from '../../constants/domain'
import { log } from '../../utils/log'

export default function useDataLikeObjectApi() {
  const [dataLikeLoading, setDataLikeLoading] = useState<boolean>(false)
  const toaster = useToaster()

  const postData = (route, id) => {
    setDataLikeLoading(true)
    log('mad:dataList:useEffect', route)
    log('mad:dataList:useEffect', id)
    return client
      .post(`${domain.apiUrl}${route}/${id}`)
      .then((res) => {
        setDataLikeLoading(false)
        toaster.success('Success', res.data.message)
        log('mad:dataList:useEffect', res)
        return res
      })
      .catch((error) => {
        setDataLikeLoading(false)
        toaster.error('Error', error.response.data.message)
        log('mad:dataList:useEffect', error, 'error')
        return error
      })
  }

  const callUpdate = (res, entity, updateData, value, field, dir = '+') => {
    if (updateData && res?.response?.status !== 401) {
      const newData = { ...entity }
      const current = newData[field] ? newData[field].toString() : '0'
      if (dir === '+') {
        newData[field] = parseInt(current) + value
        newData.liked = [true]
      } else {
        newData[field] = parseInt(current) - value
        newData.liked = null
      }

      updateData(entity.id, newData)
    }
  }

  return { postData, callUpdate, dataLikeLoading, setDataLikeLoading }
}
