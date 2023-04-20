import { Integration } from './social'
import { AcademyItemUser } from './academy'
import { Category } from './category'

export type User = {
  id: string
  address: string
  role: number
  status: number
  wp_id: number
  created_at: string
  updated_at: string
  short_address: string
  profile: Profile
  videos?: Array<AcademyItemUser>
  integrations?: Array<Integration>
}

export type Profile = {
  id?: string
  user_id?: string
  username?: string
  name?: string
  display_name?: string
  tag_line?: string
  bio?: string
  img_avatar?: string
  img_banner?: string
  creator_address?: string
  ambassador_percent?: number
  ambassador_address?: string
  category?: number
  verified?: boolean
  uri?: string
  project?: boolean
  project_description?: string
  volume?: number
  volume_price?: number
  volume_price_exact?: number
  created_collections_count?: number
  created_nfts_count?: number
  nft_likes_count?: number
  wp_id?: number
  created_at?: string
  updated_at?: string
  followers_count?: number
  likes_boost_count?: number
  nfts_count?: number
  listings_count?: number
  collections_count?: number
  public_name?: string
  description_color?: string
  collection_categories?: Array<Category>
  is_following?: Array<ProfileFollower>
  integrations?: Array<Integration>
  did_temp_level?: number
}

export type ProfileFollower = {
  user_profile_id: string
  follower_profile_id: string
}

export type DidActionStates = 'idle' | 'loading'

export type DidPanelStates = 'idle' | 'about' | 'achievements' | 'academy' | 'rating'
