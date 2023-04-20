export type DataListFilter = {
  id: string | number
  name: string
  value: string
  column?: string // filters use this
  direction?: 'asc' | 'desc' // sorting will use this as we use this type for the sorting too
  icon?: string
  default?: string | number
  count?: number
  authenticatedOnly?: boolean // set to true to hide if user is not logged in
}

export type DataListFilterGroup = {
  id: string
  options?: Array<DataListFilter>
  callback?: (selection: DataListFilter) => void
  value?: DataListFilter
  nullable?: boolean
  placeholder?: string
  icon?
  type?: string
}

export type DataListFilterParams = {
  search?: string
  category?: string | number
  page?: number
  order_by?: string
  order_dir?: string
  per_page?: number
  contract_id?: string
  owner?: string
  sales_only?: boolean
  likes_only?: boolean
  bids_only?: boolean
  projects?: boolean
  followers?: boolean
  following?: boolean
  watched?: boolean
  creator_uri?: string
  user_profile_id?: string
}
