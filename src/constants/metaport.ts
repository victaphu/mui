import { interfaces } from '@skalenetwork/metaport'

export const metaportConfig: {
  staging3: interfaces.MetaportConfig
  mainnet: interfaces.MetaportConfig
} = {
  staging3: {
    openOnLoad: false,
    openButton: true,
    autoLookup: true,
    mainnetEndpoint: 'https://goerli.blockpi.network/v1/rpc/public',
    skaleNetwork: 'staging3',
    chains: [
      'mainnet',
      'staging-legal-crazy-castor', // Europa Staging
      'staging-utter-unripe-menkar' // Calypso Staging
    ],
    chainsMetadata: {
      'staging-legal-crazy-castor': {
        apps: null,
        alias: 'Europa Liquidity Hub',
        minSfuelWei: '1000000000000'
      },
      'staging-utter-unripe-menkar': {
        apps: null,
        alias: 'Calypso NFT Hub',
        minSfuelWei: '1000000000000',
        faucetUrl: 'https://sfuel.dirtroad.dev/staging'
      }
    },
    tokens: {
      mainnet: {
        eth: {
          chains: [
            'staging-legal-crazy-castor' // Enables M2S ETH Transfer
          ]
        }
      },
      'staging-legal-crazy-castor': {
        erc20: {
          wETH: {
            address: '0xa270484784f043e159f74C03B691F80B6F6e3c24', // wrapper token address
            name: 'ETH',
            symbol: 'ETH',
            wraps: {
              address: '0xD2Aaa00700000000000000000000000000000000', // unwrapped token address
              symbol: 'ETH'
            }
          }
        }
      }
    }
  },
  mainnet: {
    openOnLoad: false,
    openButton: true,
    autoLookup: true,
    skaleNetwork: 'mainnet',
    chains: [
      'mainnet',
      'elated-tan-skat', // Europa Staging
      'honorable-steel-rasalhague' // Calypso Staging
    ],
    chainsMetadata: {
      'elated-tan-skat': {
        apps: null,
        alias: 'Europa Liquidity Hub',
        minSfuelWei: '1000000000000'
      },
      'honorable-steel-rasalhague': {
        apps: null,
        alias: 'Calypso NFT Hub',
        minSfuelWei: '1000000000000',
        faucetUrl: 'https://sfuel.dirtroad.dev/staging'
      }
    },
    tokens: {
      mainnet: {
        eth: {
          chains: [
            'elated-tan-skat' // Enables M2S ETH Transfer
          ]
        }
      },
      'elated-tan-skat': {
        erc20: {
          wETH: {
            address: '0xa5274efA35EbeFF47C1510529D9a8812F95F5735', // wrapper token address
            name: 'ETH',
            symbol: 'ETH',
            wraps: {
              address: '0xD2Aaa00700000000000000000000000000000000', // Eurpoa unwrapped token address
              symbol: 'ETH'
            }
          }
        }
      }
    }
  }
}
