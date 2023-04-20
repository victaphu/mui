import { Profile } from './user'
import { Category } from './category'

export type Collection = {
  // Contract data
  contract_id: string // contract address / subgraph id
  token_standard: '721' | '1155'
  token_type: 0 | 1 | 2 | 3
  name: string
  symbol: string
  base_uri: string
  max_supply?: number
  royalties?: number
  mint_price?: number
  mint_price_exact?: string
  volume_price: number
  volume_price_exact: string
  volume: number
  paused: boolean
  public_mint_state: boolean
  updated_at?: string
  created_at?: string
  owner: string
  splitter?: string
  project_address?: string
  project_percent?: number
  ambassador_address?: string
  ambassador_percent?: number
  royalty_recipient?: string
  // API data
  id?: string
  minting_type?: string
  user_profile_id?: string
  chain?: number
  description?: string
  img_avatar?: string
  img_banner?: string
  img_banner_bg?: string
  launch_date_time?: string
  status?: 1 | 2 // 1=draft; 2=open;
  category?: number
  external_link?: string
  featured?: boolean
  version: '0.9' | '1.0'
  // API Calculated columns
  public_name?: string
  public_bio?: string
  category_object?: Category
  category_icon?: string
  category_icon_color?: string
  attribute_counts?: []
  floor_price?: number
  floor_price_exact?: string
  holders_calculated_count?: number
  current_supply?: number
  likes_boost_count?: number
  holders_count?: number
  nfts_count?: number
  orders_count?: number
  creator?: Profile
  // Additional UI columns
  // set on create collection if user selects to copy royalties from an existing collection
  royalty_split?: Collection
}
