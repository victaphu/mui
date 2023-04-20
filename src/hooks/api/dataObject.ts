import { useEffect, useState } from 'react'
import client from '../../utils/client'
import { useRouter } from 'next/router'
import { domain } from '../../constants/domain'
import { useSelector } from 'react-redux'
import { getUserProfile } from '../../store/user'
import { log } from '../../utils/log'
import { KeyableObject } from '../../types/global'

export default function useDataObjectApi(
  route?: string,
  id?: string,
  idParamName?: string,
  urlParamNames?: Array<string>
): {
  dataObjectLoading
  dataObjectData
  dataObjectMessage
  setDataObjectLoading
  setDataObjectData
  setDataObjectMessage
  reloadData
} {
  const router = useRouter()
  const profile = useSelector(getUserProfile)
  const [dataObjectLoading, setDataObjectLoading] = useState<boolean>(false)
  const [dataObjectData, setDataObjectData] = useState([])
  const [dataObjectMessage, setDataObjectMessage] = useState<string>(null)
  const [dataParams, setDataParams] = useState<KeyableObject>(null)
  const [dataId, setDataId] = useState<string>(null)

  const readData = (identifier: string, params: KeyableObject = {}) => {
    setDataObjectLoading(true)
    let routeFormatted = `${domain.apiUrl}${route}/${identifier}`
    if (params.token_id) {
      routeFormatted = routeFormatted + '/' + params.token_id
      delete params.token_id
    }

    log('mad:dataList:useEffect:route', routeFormatted)
    log('mad:dataList:useEffect:params', params)
    client
      .get(routeFormatted, { params })
      .then((res) => {
        setDataObjectData(res.data)
        setDataObjectLoading(false)
        log('mad:dataObject:useEffect', res)
      })
      .catch((error) => {
        const message = error.response ? error.response.data.message : error.message
        setDataObjectMessage(message)
        setDataObjectLoading(false)
        log('mad:dataObject:useEffect', error, 'error')
      })
  }

  const reloadData = () => {
    readData(dataId, dataParams)
  }

  useEffect(() => {
    log('mad:dataObject:useEffect', '', 'info')
    if (router.asPath.indexOf('?') !== -1 || router.pathname.indexOf('[') !== -1) {
      if (
        router &&
        Object.keys(router.query).length !== 0 &&
        ((urlParamNames && urlParamNames.length) || idParamName) &&
        !dataObjectLoading
      ) {
        let idParam = id
        const params = {}
        if (urlParamNames) {
          Object.keys(router?.query).map((a) => {
            if (urlParamNames.includes(a)) {
              params[a] = router?.query[a]
            }
          })
        }
        if (idParamName && router?.query[idParamName]) {
          idParam = router?.query[idParamName].toString()
        }
        if (idParam) {
          setDataId(idParam)
          setDataParams(params)
          readData(idParam, params)
        }
      }
    } else if (id && id !== 'routed' && !dataObjectLoading) {
      setDataId(id)
      readData(id)
    } else if (id === 'routed' && !dataObjectLoading && router.query?.id) {
      const routedId: string = router.query?.id.toString()
      setDataId(routedId)
      readData(routedId)
    }
    // @todo - address this hook dependencies error and adjust could cause stale closure
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, profile])

  return {
    dataObjectLoading,
    dataObjectData,
    dataObjectMessage,
    setDataObjectLoading,
    setDataObjectData,
    setDataObjectMessage,
    reloadData
  }
}
