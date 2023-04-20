import { Profile } from './user'

export type Feed = {
  id: string
  user_profile_id: string
  model_id: string
  model_type: string
  created_at: string
  template: string
  translated: Array<string>
  user_profile: Profile
  likes_count: number
  liked: Array<Profile>
  calculated: { parts: Array<FeedPart>; data }
}

export type FeedPart = {
  type: string
  phrase: string
  uri_phrase?: string
  prefix?: string
}

export type FeedActionStates = 'idle' | 'loading'
