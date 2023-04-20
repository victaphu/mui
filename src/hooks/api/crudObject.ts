import { useState } from 'react'
import useToaster from '../toast'
import { domain } from '../../constants/domain'
import useClient from '../client'
import { log } from '../../utils/log'

export default function useCrudObjectApi() {
  const [dataLoading, setDataLoading] = useState<boolean>(false)
  const toaster = useToaster()
  const client = useClient()

  const postData = (route, data = null, silent = false) => {
    setDataLoading(true)
    log('mad:crudObject:postData', route)
    log('mad:crudObject:postData', data)
    return client
      .post(`${domain.apiUrl}/${route}`, data)
      .then((res) => {
        setDataLoading(false)
        if (!silent) toaster.success('Success', res.data.message)
        log('mad:crudObject:postData', res)
        return res
      })
      .catch((error) => {
        setDataLoading(false)
        if (!silent) toaster.error('Error', error.response.data.message)
        log('mad:crudObject:postData', error, 'error')
      })
  }

  const putData = (route, data = null, silent = false) => {
    setDataLoading(true)
    log('mad:crudObject:putData', route)
    log('mad:crudObject:putData', data)
    return client
      .put(`${domain.apiUrl}/${route}`, data)
      .then((res) => {
        setDataLoading(false)
        if (!silent) toaster.success('Success', res.data.message)
        log('mad:crudObject:putData', res)
        return res
      })
      .catch((error) => {
        setDataLoading(false)
        if (!silent) toaster.error('Error', error.response.data.message)
        log('mad:crudObject:putData', error, 'error')
        return error
      })
  }

  const getData = (route, data = null, silent = false) => {
    setDataLoading(true)
    log('mad:crudObject:getData', route)
    log('mad:crudObject:getData', data)
    return client
      .get(`${domain.apiUrl}/${route}`, data)
      .then((res) => {
        setDataLoading(false)
        if (!silent) toaster.success('Success', res.data.message)
        log('mad:crudObject:getData', res)
        return res
      })
      .catch((error) => {
        setDataLoading(false)
        if (!silent) toaster.error('Error', error.response.data.message)
        log('mad:crudObject:getData', error)
        return error
      })
  }

  return {
    postData,
    putData,
    getData,
    dataLoading,
    setDataLoading
  }
}
