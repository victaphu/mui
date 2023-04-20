import { Profile } from './user'
import { Tag } from './tag'
import { Category } from './category'
import { Collection } from './collection'

export type Nft = {
  id?: string
  token_id?: string
  contract_id?: string
  owner?: string
  uri?: string
  status?: 1 | 2
  total_supply?: number
  name?: string
  symbol?: string
  description?: string
  image?: string
  category?: number
  unlockable_url?: string
  external_url?: string
  explicit_content?: boolean
  royalties?: number // removed?
  price?: number // removed?
  last_price?: number
  last_price_exact?: string
  volume?: number
  volume_price?: number
  files?: Attribute[]
  properties?: Attribute[]
  levels?: Attribute[]
  stats?: Attribute[]
  created_at?: string
  updated_at?: string
  // Calculated columns
  tags?: Tag[] | string[]
  unhatched?: boolean
  public_name?: string
  description_color?: string
  category_object?: Category
  likes_boost_count?: number
  creator?: Profile
  collection?: Collection
  holders?: NftBalance[]
  orders?: NftOrder[]
}

export type NftMetaData = {
  name: string
  owner: string
  image: string
  category: number
  description: string
  external_url: string
  unlockable_url: string
  explicit_content: boolean
  tags: string[]
  attributes: Attribute[]
  files: Attribute[]
}

export type Attribute = {
  value?: number | string
  max_value?: number
  display_type?: string
  trait_type?: string
}

export type NftBalance = {
  owner?: string
  hidden?: boolean
  amount?: string
  contract_id?: string
  token_id?: string
  nft_id?: string
}

export type NftOrder = {
  nft_id?: string
  token_id?: string
  contract_id?: string
  seller?: string
  bidder?: string
  bidder_public_name?: string
  quantity?: number
  sale_type?: number
  hash?: string
  end_time?: number
  start_time?: string
  start_price?: number
  end_price?: number
  bid_price?: number
  start_price_exact?: string
  end_price_exact?: string
  bid_price_exact?: string
  // Calculated columns
  sale_type_icon?: string
}

export type CreateDrop = {
  step: number
  profile: Profile
  nft?: Nft
  sale_quantity?: number
  sale_type?: number
  sale_start?: number
  sale_end?: number
  sale_price?: number
}

export type NftActionStates = 'idle' | 'loading' | 'burnStateLoading' | 'burnStateComplete'

export type DropActionState = 'idle' | 'loading' | 'syncing'
