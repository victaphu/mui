import { IntegrationConfig } from '../types/social'

export const environment = process.env.NEXT_PUBLIC_API_ENV
export const defaultNetwork = process.env.NEXT_PUBLIC_NETWORK

export const protectedPages: string[] = [
  '/dashboard',
  '/create',
  '/edit-collection',
  '/edit-profile',
  '/account/nfts'
]

export const collectionTypes = [
  {
    name: '721 Collection',
    id: '721'
  },
  {
    name: '1155 Collection',
    id: '1155'
  }
]
export const contractVersions = [
  {
    name: '0.9',
    id: '0.9'
  },
  {
    name: '1.0',
    id: '1.0'
  }
]

export const tokenTypes = [
  // {
  //   name: 'Minimal',
  //   id: '0'
  // },
  {
    name: 'Basic',
    id: '1'
  }
  // {
  //   name: 'Whitelist',
  //   id: '2'
  // },
  // {
  //   name: 'Lazy minting',
  //   id: '3'
  // }
]
export const mintingTypes = [
  {
    id: '1',
    name: 'Basic',
    description:
      'Create a collection and use the MAD UI to upload your NFT assets and metadata. Suitable for small collections, community tokens or any collection with a manageable number of NFTs.'
  },
  {
    id: '2',
    name: 'Advanced',
    description:
      'Upload your own NFT assets and metadata, then create and sell your collection on the MAD website using your custom base URI.'
  }
]

export const imageMimeTypes: string[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/webp',
  'image/gif'
]
export const audioMimeTypes: string[] = [
  'audio/mpeg',
  'audio/mp4',
  'audio/mpeg',
  'audio/ogg',
  'application/ogg',
  'audio/wav'
]
export const videoMimeTypes: string[] = [
  'video/mp4',
  'video/3gpp',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-ms-wmv',
  'video/x-m4v',
  'video/webm'
]
export const modelViewerMimeTypes: string[] = ['model/gltf-binary']

export const integrations: Array<IntegrationConfig> = [
  { id: 'twitter', oauthUri: '/provider/auth/twitter', enabled: false },
  { id: 'facebook', oauthUri: '/provider/auth/facebook', enabled: true },
  { id: 'github', oauthUri: '/provider/auth/github', enabled: true },
  { id: 'youtube', oauthUri: '/provider/auth/youtube', enabled: true },
  { id: 'tiktok', oauthUri: '/provider/auth/tiktok', enabled: false },
  { id: 'discord', oauthUri: '/provider/auth/discord', enabled: true }
]
