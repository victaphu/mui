export type Network = {
  id: number
  name: string
  label: string
  networkLabel: string
  description: string
  icon: string
  twitter: string
  notes: string[]
  rpcUrl: string
  explorerUrl: string
  mintFee: number
  platformFee: number
  platformResaleFee: number
  minListingMinutes: number
  transak: string | false
  metaport?: string | false
  tokenFaucet: string
  currency: {
    name: string
    symbol: string
    decimals: number
    erc20Wrapper?: string
    erc20?: string
    erc20Symbol?: string
  }
  environments: Array<{ environment: string; status: 0 | 1; active: 0 | 1; hidden?: 0 | 1 }>
  addresses: {
    '0.9'?: NetworkAddresses
    '1.0': NetworkAddresses
  }
}

export type NetworkAddresses = {
  erc721FactoryAddress: string
  erc721RouterAddress: string
  erc721MarketplaceAddress: string
  erc1155FactoryAddress: string
  erc1155RouterAddress: string
  erc1155MarketplaceAddress: string
  nullAddress: string
  deployer?: string
}
