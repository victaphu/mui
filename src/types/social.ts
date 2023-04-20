export type Integration = {
  id: string
  user_id: string
  provider: string
  provider_id: string
  uri: string
  created_at: string
  updated_at: string
}

export type IntegrationConfig = {
  id: string
  oauthUri: string
  enabled: boolean
}
