import { Domain } from '../types/domain'
import { environment } from './config'

export const domains: Domain[] = [
  {
    id: 'local',
    apiUrl: 'http://localhost:8080/api',
    downloadPrefix: 'http://localhost:8080/download/',
    providerPrefix: 'http://localhost:8080',
    ipfsUploadUrl: 'https://api.pinata.cloud/pinning',
    ipfsReadUrl: 'https://ipfs.madnfts.io/ipfs/',
    madReadUrl: 'https://json.madnfts.io/',
    madSavePrefix: 'mad://',
    ipfsSavePrefix: 'ipfs://',
    defaultBaseUri: 'mad://',
    sessionTimeout: 60
  },
  {
    id: 'local-rewrite',
    apiUrl: '/api',
    downloadPrefix: 'http://localhost:8080/download/',
    providerPrefix: 'http://localhost:8080',
    ipfsUploadUrl: 'https://api.pinata.cloud/pinning',
    ipfsReadUrl: 'https://ipfs.madnfts.io/ipfs/',
    madReadUrl: 'https://json.madnfts.io/',
    madSavePrefix: 'mad://',
    ipfsSavePrefix: 'ipfs://',
    defaultBaseUri: 'mad://',
    sessionTimeout: 60
  },
  {
    id: 'testnet',
    downloadPrefix: 'https://api.testnet.madnfts.io/download/',
    providerPrefix: 'https://api.testnet.madnfts.io',
    apiUrl: 'https://api.testnet.madnfts.io/api',
    ipfsUploadUrl: 'https://api.pinata.cloud/pinning',
    ipfsReadUrl: 'https://ipfs.madnfts.io/ipfs/',
    madReadUrl: 'https://json.madnfts.io/',
    madSavePrefix: 'mad://',
    ipfsSavePrefix: 'ipfs://',
    defaultBaseUri: 'mad://',
    sessionTimeout: 7200
  },
  {
    id: 'mainnet',
    downloadPrefix: 'https://v1.api.mainnet.madnfts.io/download/',
    providerPrefix: 'https://v1.api.mainnet.madnfts.io',
    apiUrl: 'https://v1.api.mainnet.madnfts.io/api',
    ipfsUploadUrl: 'https://api.pinata.cloud/pinning',
    ipfsReadUrl: 'https://ipfs.madnfts.io/ipfs/',
    madReadUrl: 'https://json.madnfts.io/',
    madSavePrefix: 'mad://',
    ipfsSavePrefix: 'ipfs://',
    defaultBaseUri: 'mad://',
    sessionTimeout: 86400
  }
]
export const domain: Domain = domains.find((d) => d.id === environment)
