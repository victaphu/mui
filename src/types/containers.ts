import React, { Dispatch } from 'react'
import { Attribute, CreateDrop, Nft, NftActionStates } from './nft'
import { DidActionStates, DidPanelStates, Profile } from './user'
import { DataListFilter, DataListFilterGroup } from './dataListFilter'
import { DataListInfo } from './dataListInfo'
import { DataListTableColumn } from './dataListTable'
import { Feed, FeedActionStates } from './feed'

export type NftContainerComponent = {
  Component
  nft: Nft
  view?: 'preview' | 'editable'
  className?: string
}

export type NftComponent = {
  nft: Nft
  view?: 'preview' | 'editable'
  startBurn?: () => void
  hideToggle?: () => void
  likeBoost?: (number: number) => void
  syncIpfs?: () => void
  syncData?: () => void
  nftActionState?: string
  setFileModalOpen?: (bool: boolean) => void
  setNftActionState?: (state: NftActionStates) => void
  className?: string
}

export type CreateDropContainerComponent = {
  Component
  className?: string
}

export type CreateDropComponent = {
  className?: string
  createDropData?: CreateDrop
  createDrop?: () => void
  updateDrop?: (data) => void
  updateDropNft?: (data) => void
  updateDropCollection?: (data) => void
  syncNft?: () => void
  copyFromId?: (id: string) => void
}

export type DidContainerComponent = {
  Component
  profile: Profile
  className?: string
}

export type DidComponent = {
  profile: Profile
  className?: string
  didActionState?: DidActionStates
  setDidActionState?: (state: DidActionStates) => void
  showPanel?: DidPanelStates
  followToggle?: () => Promise<void>
  setShowPanel?: (state: DidPanelStates) => void
}

export type AttributeContainerComponent = {
  Component
  attributes: Array<Attribute>
  attributeType: string
  attributeTypeLabel: string
  onSave: (a) => void
}

export type AttributeComponent = {
  attributes?: Array<Attribute>
  attribute?: Attribute
  handleChange?: (key: string, value: string, index?: number) => void
  handleSave?: () => boolean
  handleDelete?: (index: number) => void
  handleChangeOrder?: (index: number, direction: 'up' | 'down') => void
  handleSaveClick?: () => void
  showInput?: boolean
  setShowInput?: (bool: boolean) => void
  validate?: (item: Attribute) => boolean
}

export type FeedContainerComponent = {
  Component
  feedData: Feed
  className?: string
}

export type FeedComponent = {
  className?: string
  isOwner?: boolean
  hasLiked?: boolean
  feedData: Feed
  feedActionState?: FeedActionStates
  setFeedActionState?: (state: FeedActionStates) => void
  feedLikeToggle?: () => void
}

export type DataListContainerComponent = {
  icon?: string
  intro?: string
  preTitle?: string
  title?: string
  dataListData
  dataListMessage: string
  dataListMessageClassName?: string
  dataListLoading: boolean
  dataListToggle?: boolean
  dataListSorting?: DataListFilter[]
  dataListOrder?: DataListFilter
  dataListFilterGroups?: DataListFilterGroup[]
  dataListFilters?: DataListFilter[]
  dataListInfo?: DataListInfo
  setLoadMore?: () => void
  setLoadPage?: (page) => void
  reFetchData?: () => Promise<void>
  setOrder?: (f: DataListFilter) => void
  setFilter?: (f: DataListFilter, removeFilter?: boolean, singleColumnFilter?: boolean) => void
  setFilterHeight?: Dispatch<number>
  exposedFilters?: boolean
  setDataListSearchText?: Dispatch<string>
  dataListSearchText?: string
  listRender: (a, index?) => React.ReactElement
  listRenderTableRow?: (a, index?) => React.ReactElement
  listRenderWrapper?: (children) => React.ReactElement
  previewRender?: (a, index?) => React.ReactElement
  previewRenderTitle?: (a, index?) => React.ReactElement
  setListPreview?: (target) => void
  dataListPreviewIndex?: number
  listClassName?: string
  wrapperClassName?: string
  filtersClassName?: string
  hideSpacer?: boolean
  hideLoader?: boolean
  searchPlaceholder?: string
  preListChildren?: React.ReactElement
  tableColumns?: DataListTableColumn[]
}

export type DataListItemComponent = {
  className?: string
  updateData?: (id, newData) => void
  reFetchData?: () => Promise<void>
  listIndex?: number
  hideViewButton?: boolean
  setListPreview?: (target) => void
}
