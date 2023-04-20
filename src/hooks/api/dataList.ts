import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { DataListFilter, DataListFilterParams } from '../../types/dataListFilter'
import { DataListInfo } from '../../types/dataListInfo'
import { domain } from '../../constants/domain'
import { useSelector } from 'react-redux'
import { getCurrentNetwork } from '../../store/web3'
import { getUserProfile } from '../../store/user'
import useClient from '../client'
import { log } from '../../utils/log'
import { defaultSorting } from '../../constants/filter'

export default function useDataListApi(
  route?: string,
  params?: DataListFilterParams,
  urlParamNames?: Array<string>,
  sortingOptions?: Array<DataListFilter>,
  noDataMessage = 'No items found, adjust the filters to find what you are looking for!'
) {
  const router = useRouter()
  const client = useClient()
  const network = useSelector(getCurrentNetwork)
  const profile = useSelector(getUserProfile)

  const passedRoute = useRef((): string => route)
  const passedParams = useRef((): DataListFilterParams => params)
  const passedUrlParamNames = useRef((): Array<string> => urlParamNames)
  const dataListSorting: DataListFilter[] = sortingOptions ? sortingOptions : defaultSorting

  const [dataListParamsLoading, setDataListParamsLoading] = useState<boolean>(false)
  const [dataListLoading, setDataListLoading] = useState<boolean>(false)
  const [dataListOrder, setDataListOrder] = useState<DataListFilter>(null)
  const [dataListData, setDataListData] = useState([])
  const [dataListPage, setDataListPage] = useState<number>(1)
  const [dataListInfo, setDataListInfo] = useState<DataListInfo>({})
  const [dataListAppend, setDataListAppend] = useState<number>(1)
  const [dataListSearchText, setDataListSearchText] = useState<string>(null)
  const [dataListSearchCategories, setDataListSearchCategories] = useState<string>(null)
  // NOTE: DataListFilter.id must be unique for a dataListFilters implementation
  // multiple filters must take this into account when configuring IDs
  const [dataListFilters, setDataListFilters] = useState<Array<DataListFilter>>([])
  const [dataListMessage, setDataListMessage] = useState<string>(null)
  const [dataListRequestParams, setDataListRequestParams] = useState(params)
  const [appState, setAppState] = useState<{ networkId: string; profileId: string }>({
    networkId: null,
    profileId: null
  })
  const [dataListPreviewIndex, setDataListPreviewIndex] = useState<number>(null)

  const readData = useCallback(
    (append = false, routeParams = {}, previousData = []): Promise<void> => {
      log('mad:dataList:useCallback', 'readData', 'info')
      if (!client) return
      setDataListLoading(true)
      log('mad:dataList:readData', `${domain.apiUrl}${passedRoute.current()}`)
      log('mad:dataList:readData', routeParams)
      return client
        .get(`${domain.apiUrl}${passedRoute.current()}`, {
          params: routeParams
        })
        .then((res) => {
          log('mad:dataList:readData', res)
          setDataListInfo({
            current_page: res.data.current_page,
            from: res.data.from,
            to: res.data.to,
            prev_page_url: res.data.prev_page_url,
            next_page_url: res.data.next_page_url,
            per_page: res.data.per_page
          })
          if (res.data.data.length > 0) {
            if (append) {
              setDataListData([...previousData, ...res.data.data])
            } else {
              setDataListData(res.data.data)
            }
          } else {
            if (!append || !previousData?.length) {
              setDataListData([])
              setDataListMessage(noDataMessage)
            }
          }
          setDataListLoading(false)
        })
        .catch((error) => {
          const message = error.response ? error.response.data.message : error.message
          setDataListMessage(message)
          setDataListLoading(false)
          log('mad:dataList:readData', error, 'error')
        })
    },
    [client, noDataMessage]
  )

  const reFetchData = () => {
    return readData(false, dataListRequestParams, dataListData)
  }

  const updateData = (id, newItem) => {
    const copy = [...dataListData]
    copy.map((a, i) => {
      if (a.id === id) {
        copy[i] = newItem
      }
    })
    setDataListData(copy)
  }

  // State mutators

  const setTextSearchFilter = (search) => {
    setDataListPage(1)
    setDataListAppend(1)
    setDataListSearchText(search)
  }

  const setCategoryFilter = (categories) => {
    setDataListPage(1)
    setDataListAppend(1)
    setDataListSearchCategories(categories)
  }

  const setFilter = (filter: DataListFilter, removeFilter = false, singleColumnFilter = false) => {
    setDataListPage(1)
    setDataListAppend(1)
    setDataListData([])
    let copy = [...dataListFilters]
    copy = copy.filter((a) => {
      if (singleColumnFilter) {
        return a.column !== filter.column
      }
      return a.id !== filter.id
    })
    if (removeFilter) {
      setDataListFilters(copy)
    } else {
      setDataListFilters([...copy, ...[filter]])
    }
  }

  const setOrder = (value: DataListFilter) => {
    setDataListPage(1)
    setDataListAppend(1)
    setDataListOrder(value)
  }

  const setLoadPage = (page: number) => {
    setDataListPage(page)
  }

  const setLoadMore = () => {
    setDataListLoading(true)
    setDataListAppend(dataListAppend + 1)
  }

  const setListPreview = (index: number | string) => {
    if (index === 'prev' && dataListData[dataListPreviewIndex - 1]) {
      setDataListPreviewIndex(dataListPreviewIndex - 1)
      return
    }
    if (index === 'next' && dataListData[dataListPreviewIndex + 1]) {
      setDataListPreviewIndex(dataListPreviewIndex + 1)
      return
    }
    if (index !== 'prev' && index !== 'next' && (index || index === 0)) {
      setDataListPreviewIndex(parseInt(index.toString()))
      return
    }
    setDataListPreviewIndex(null)
  }

  useEffect(() => {
    log('mad:dataList:useEffect', '', 'info')
    setDataListParamsLoading(true)
    if (dataListParamsLoading) return
    let appending = false
    const requestParams = passedParams.current() ? { ...passedParams.current() } : {}
    const urlParams = passedUrlParamNames.current() ? [...passedUrlParamNames.current()] : []
    Object.keys(router?.query).map((a) => {
      if (urlParams?.includes(a)) {
        requestParams[a] = router?.query[a]
      }
    })
    if (urlParams?.includes('owner_from_creator_uri')) {
      requestParams.owner = router?.query.creator_uri.toString()
    }
    requestParams.search = dataListSearchText
    requestParams.category = dataListSearchCategories
    // Load more appending else not appending, NOT both
    if (dataListAppend != requestParams.page && dataListAppend > 1) {
      requestParams.page = dataListAppend
      appending = true
    } else {
      requestParams.page = dataListPage
    }
    if (dataListOrder) {
      requestParams.order_by = dataListOrder.value
      requestParams.order_dir = dataListOrder.direction
    }
    if (dataListFilters) {
      dataListFilters.map((filter: DataListFilter) => {
        if (requestParams[filter.column]) {
          requestParams[filter.column] = `${requestParams[filter.column]},${filter.value}`
        } else {
          requestParams[filter.column] = filter.value
        }
      })
    }
    if (appState.networkId !== network?.id || appState?.profileId !== profile?.id) {
      setAppState({ networkId: network.id, profileId: profile?.id })
    }
    setDataListRequestParams(requestParams)
    readData(appending, requestParams, dataListData)
    setDataListParamsLoading(false)
    // @todo - address this hook dependencies error and adjust could cause stale closure
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    readData,
    dataListFilters,
    dataListOrder,
    dataListPage,
    dataListParamsLoading,
    dataListSearchCategories,
    dataListSearchText,
    dataListAppend,
    network.id,
    passedParams,
    passedUrlParamNames,
    profile?.id,
    router?.query,
    appState.networkId,
    appState?.profileId
  ])

  return {
    setTextSearchFilter,
    setCategoryFilter,
    setLoadMore,
    setLoadPage,
    setOrder,
    setFilter,
    dataListLoading,
    dataListOrder,
    dataListData,
    dataListPage,
    dataListSearchText,
    dataListSearchCategories,
    dataListFilters,
    dataListSorting,
    dataListMessage,
    dataListInfo,
    setDataListLoading,
    setDataListOrder,
    setDataListData,
    setDataListPage,
    setDataListSearchText,
    setDataListSearchCategories,
    setDataListFilters,
    setDataListMessage,
    readData,
    updateData,
    reFetchData,
    setListPreview,
    dataListPreviewIndex
  }
}
