import { Chain } from 'wagmi'
import { Network } from '../types/network'
import { defaultNetwork, environment } from './config'

export const networks: Network[] = [
  {
    id: 344106930, //0x1482a7b2
    name: 'staging-utter-unripe-menkar',
    description:
      'Blockchains should not be difficult or expensive to use. SKALE is the first blockchain network fully optimised for Web3 user experience and security. Zero Gas fees forever! With over 10 million transactions on SKALE, $50,000,000 has been saved in transaction fees for users.',
    label: 'SKALE Calypso V3',
    networkLabel: 'SKALE Chain | staging-utter-unripe-menkar',
    icon: '/chain-skale.svg',
    twitter: 'SkaleNetwork',
    notes: [
      'Eco-Friendly - Proof-of-Stake consensus combined with cutting-edge containerization',
      'Instant Finality - Blocks have instant finality on SKALE Chains',
      'On chain file storage - NFT images can trustlessly be stored on-chain',
      'Ethereum Native - interoperable and built in an integrated manner with Ethereum',
      'Built for a Billion users - supporting an unlimited number of independent blockchains'
    ],
    rpcUrl: 'https://staging-v3.skalenodes.com/v1/staging-utter-unripe-menkar',
    explorerUrl: 'https://staging-utter-unripe-menkar.explorer.staging-v3.skalenodes.com',
    mintFee: 0.0003,
    platformFee: 10,
    platformResaleFee: 2.5,
    minListingMinutes: 60,
    transak: false,
    metaport: 'staging3',
    tokenFaucet: '0xa9eC34461791162Cae8c312C4237C9ddd1D64336',
    currency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18,
      erc20Wrapper: '_ETH_0xa270484784f043e159f74C03B691F80B6F6e3c24',
      erc20: '0xECabAE592Eb56D96115FcF4c7F772ADB7BF573d0',
      erc20Symbol: 'ETH'
    },
    environments: [
      {
        environment: 'testnet',
        status: 1,
        active: 1
      },
      {
        environment: 'testnet2',
        status: 1,
        active: 1
      },
      {
        environment: 'local',
        status: 1,
        active: 1
      },
      {
        environment: 'local-rewrite',
        status: 1,
        active: 1
      }
    ],
    addresses: {
      '1.0': {
        erc721FactoryAddress: '0x68e9fB37425d5E0e3Ca8424C6FfC6a3064A478a9',
        erc721RouterAddress: '0x4B17D9dbdea9C2E090aaeA511d86c293eBaeFcBb',
        erc721MarketplaceAddress: '0x1AD5617A4daF50848561a0d08f2a36c18CEa0355',
        erc1155FactoryAddress: '0xaDE128D87aeC477B841f5E74ab79c908898CFa3b',
        erc1155RouterAddress: '0x618E3111E96fa59d537baD98A216ee96F7F197Ab',
        erc1155MarketplaceAddress: '0x39f615c936a74c4dEB7FEBAb00F7Bf7cb5087FFc',
        nullAddress: '0x0000000000000000000000000000000000000000',
        deployer: '0xD1c4c0A1eb7Fb44B003397D301EB9AFC916e052E'
      }
    }
  },
  {
    id: 476158412,
    name: 'staging-legal-crazy-castor',
    description:
      'Blockchains should not be difficult or expensive to use. SKALE is the first blockchain network fully optimised for Web3 user experience and security. Zero Gas fees forever! With over 10 million transactions on SKALE, $50,000,000 has been saved in transaction fees for users.',
    label: 'SKALE Europa V3',
    networkLabel: 'SKALE Chain | staging-legal-crazy-castor',
    icon: '/chain-skale.svg',
    twitter: 'SkaleNetwork',
    notes: [
      'Eco-Friendly - Proof-of-Stake consensus combined with cutting-edge containerization',
      'Instant Finality - Blocks have instant finality on SKALE Chains',
      'On chain file storage - NFT images can trustlessly be stored on-chain',
      'Ethereum Native - interoperable and built in an integrated manner with Ethereum',
      'Built for a Billion users - supporting an unlimited number of independent blockchains'
    ],
    rpcUrl: 'https://staging-v3.skalenodes.com/v1/staging-legal-crazy-castor',
    explorerUrl: 'https://staging-legal-crazy-castor.explorer.staging-v3.skalenodes.com',
    mintFee: 0.0003,
    platformFee: 10,
    platformResaleFee: 2.5,
    minListingMinutes: 60,
    transak: false,
    metaport: 'staging3',
    tokenFaucet: '0x436389289aEAFefD1d7471b7FbEc67539Bde3E34',
    currency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18,
      erc20Wrapper: '_ETH_0xa270484784f043e159f74C03B691F80B6F6e3c24',
      erc20: '0xD2Aaa00700000000000000000000000000000000', // Europa ETH unwrapped address
      erc20Symbol: 'ETH'
    },
    environments: [
      {
        environment: 'testnet',
        status: 0,
        active: 1,
        hidden: 1
      },
      {
        environment: 'testnet2',
        status: 1,
        active: 1
      },
      {
        environment: 'local',
        status: 0,
        active: 1,
        hidden: 1
      },
      {
        environment: 'local-rewrite',
        status: 0,
        active: 1,
        hidden: 1
      }
    ],
    addresses: {
      '1.0': {
        erc721FactoryAddress: '0x0000000000000000000000000000000000000000',
        erc721RouterAddress: '0x0000000000000000000000000000000000000000',
        erc721MarketplaceAddress: '0x0000000000000000000000000000000000000000',
        erc1155FactoryAddress: '0x0000000000000000000000000000000000000000',
        erc1155RouterAddress: '0x0000000000000000000000000000000000000000',
        erc1155MarketplaceAddress: '0x0000000000000000000000000000000000000000',
        nullAddress: '0x0000000000000000000000000000000000000000',
        deployer: '0xD1c4c0A1eb7Fb44B003397D301EB9AFC916e052E'
      }
    }
  },
  {
    id: 5,
    name: 'goerli',
    description:
      "Goerli Ethereum is a technology that's home to digital money, global payments, and applications. The community has built a booming digital economy, bold new ways for creators to earn online, and so much more. It's open to everyone, wherever you are in the world – all you need is the internet.",
    label: 'Goerli',
    networkLabel: 'Goerli',
    icon: '/chain-ethereum.svg',
    twitter: 'ethereum',
    notes: [
      'Ethereum offers the highest liquidity currently available in the NFT market',
      'Between 500-700k daily active wallets',
      'The original network for NFTs',
      'Ethereum NFTs are the most widely accepted NFTs in the industry',
      'PoS, the energy consumption of Ethereum has dropped by an incredible percentage',
      'NFTs on Ethereum typically sell for higher prices compared to NFTs on other chains',
      'Ethereum NFTs have the widest choice for wallets and Dapps'
    ],
    rpcUrl: 'https://goerli.infura.io/v3/' + process.env.REACT_INFURA_KEY,
    explorerUrl: 'https://goerli.etherscan.io',
    currency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    mintFee: 0.0003,
    platformFee: 10,
    platformResaleFee: 2.5,
    minListingMinutes: 60,
    transak: 'PRODUCTION',
    metaport: 'staging3',
    tokenFaucet: null,
    environments: [
      {
        environment: 'testnet',
        status: 1,
        active: 1
      },
      {
        environment: 'testnet2',
        status: 1,
        active: 1
      },
      {
        environment: 'local-rewrite',
        status: 1,
        active: 1
      },
      {
        environment: 'local',
        status: 1,
        active: 1
      }
    ],
    addresses: {
      '0.9': {
        erc721FactoryAddress: '0x208B50e7F4A9a2573CA7b3E98f0df84C9ae16A3b',
        erc721RouterAddress: '0x6ab5d4130322CF34BBAC25e45c3a5F3Cf289b156',
        erc721MarketplaceAddress: '0x9167a2F9aCB7d4604496cd42095d837514a92d58',
        erc1155FactoryAddress: '0x8B949Cb08b15F92AAF1fe06494C534C484440B3f',
        erc1155RouterAddress: '0x4Ea1689E63F12d2B27C445949986F32c65014bf0',
        erc1155MarketplaceAddress: '0x80df237219044192c5D4c948917cAfD436eDf812',
        nullAddress: '0x0000000000000000000000000000000000000000',
        deployer: '0xd1c4c0a1eb7fb44b003397d301eb9afc916e052e'
      },
      '1.0': {
        erc721FactoryAddress: '0x68DC5fB886094E57F7DdAce404F665471E7e3926',
        erc721RouterAddress: '0x09c9277D94984BF1Ec99fFf00091D6d349685e5d',
        erc721MarketplaceAddress: '0xBD476f8905C8f3842f34f112B489BcF6dEB84b33',
        erc1155FactoryAddress: '0x8938AD3B5A8C69278Bf13a36314EEEf7fe988A7d',
        erc1155RouterAddress: '0x655c4d5a5119b6BaeBb47A88f0aC3dcEA1374Fa1',
        erc1155MarketplaceAddress: '0x901c7Fd4DAF701841131408D2920CeE13E5F2050',
        nullAddress: '0x0000000000000000000000000000000000000000',
        deployer: '0xD1c4c0A1eb7Fb44B003397D301EB9AFC916e052E'
      }
    }
  },
  {
    id: 1564830818, //0x5d456c62
    name: 'honorable-steel-rasalhague',
    description:
      'Blockchains should not be difficult or expensive to use. SKALE is the first blockchain network fully optimised for Web3 user experience and security. Zero Gas fees forever! With over 10 million transactions on SKALE, $50,000,000 has been saved in transaction fees for users.',
    label: 'SKALE Calypso',
    networkLabel: 'SKALE Chain | honorable-steel-rasalhague',
    icon: '/chain-skale.svg',
    twitter: 'SkaleNetwork',
    notes: [
      'Eco-Friendly - Proof-of-Stake consensus combined with cutting-edge containerization',
      'Instant Finality - Blocks have instant finality on SKALE Chains',
      'On chain file storage - NFT images can trustlessly be stored on-chain',
      'Ethereum Native - interoperable and built in an integrated manner with Ethereum',
      'Built for a Billion users - supporting an unlimited number of independent blockchains'
    ],
    rpcUrl: 'https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague',
    explorerUrl: 'https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com',
    mintFee: 0,
    platformFee: 10,
    platformResaleFee: 2.5,
    minListingMinutes: 60,
    transak: false,
    metaport: 'mainnet',
    tokenFaucet: '0x02891b34B7911A9C68e82C193cd7A6fBf0c3b30A',
    currency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18,
      erc20Wrapper: '0xa5274efA35EbeFF47C1510529D9a8812F95F5735',
      erc20: '0x59ab97Ee239e02112652587F9Ef86CB6F762983b',
      erc20Symbol: 'ETH'
    },
    environments: [
      {
        environment: 'mainnet',
        status: 1,
        active: 1
      }
    ],
    addresses: {
      '1.0': {
        erc721FactoryAddress: '0x9E697063529fDbB8aD3D8Bf3C82Ab7b9872565a0',
        erc721RouterAddress: '0xD39A352624fFB5Fe3E8d0D3a4B0920Db1736E438',
        erc721MarketplaceAddress: '0x73492Dc3717c3c9f625E26348dd276a91dAc69a8',
        erc1155FactoryAddress: '0xB3C06e161339dFBeB7065B6C04185c8eC451c3fb',
        erc1155RouterAddress: '0xFea529c6ce893e412d5D9b92bCb5646ab20e71A6',
        erc1155MarketplaceAddress: '0x65054dDf1aA5616658512a389Db639e868B21149',
        nullAddress: '0x0000000000000000000000000000000000000000',
        deployer: '0xD1c4c0A1eb7Fb44B003397D301EB9AFC916e052E'
      }
    }
  },
  {
    id: 2046399126,
    name: 'elated-tan-skat',
    description:
      'Blockchains should not be difficult or expensive to use. SKALE is the first blockchain network fully optimised for Web3 user experience and security. Zero Gas fees forever! With over 10 million transactions on SKALE, $50,000,000 has been saved in transaction fees for users.',
    label: 'SKALE Europa',
    networkLabel: 'SKALE Chain | elated-tan-skat',
    icon: '/chain-skale.svg',
    twitter: 'SkaleNetwork',
    notes: [
      'Eco-Friendly - Proof-of-Stake consensus combined with cutting-edge containerization',
      'Instant Finality - Blocks have instant finality on SKALE Chains',
      'On chain file storage - NFT images can trustlessly be stored on-chain',
      'Ethereum Native - interoperable and built in an integrated manner with Ethereum',
      'Built for a Billion users - supporting an unlimited number of independent blockchains'
    ],
    rpcUrl: 'https://mainnet.skalenodes.com/v1/elated-tan-skat',
    explorerUrl: 'https://elated-tan-skat.explorer.staging-v3.skalenodes.com',
    mintFee: 0,
    platformFee: 10,
    platformResaleFee: 2.5,
    minListingMinutes: 60,
    transak: false,
    metaport: 'mainnet',
    tokenFaucet: '0x2B267A3e49b351DEdac892400a530ABb2f899d23',
    currency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18,
      erc20Wrapper: '0xa5274efA35EbeFF47C1510529D9a8812F95F5735',
      erc20: '0xa5274efA35EbeFF47C1510529D9a8812F95F5735',
      erc20Symbol: 'ETH'
    },
    environments: [
      {
        environment: 'mainnet',
        status: 0,
        active: 1,
        hidden: 1
      }
    ],
    addresses: {
      '1.0': {
        erc721FactoryAddress: '0x0000000000000000000000000000000000000000',
        erc721RouterAddress: '0x0000000000000000000000000000000000000000',
        erc721MarketplaceAddress: '0x0000000000000000000000000000000000000000',
        erc1155FactoryAddress: '0x0000000000000000000000000000000000000000',
        erc1155RouterAddress: '0x0000000000000000000000000000000000000000',
        erc1155MarketplaceAddress: '0x0000000000000000000000000000000000000000',
        nullAddress: '0x0000000000000000000000000000000000000000',
        deployer: '0xD1c4c0A1eb7Fb44B003397D301EB9AFC916e052E'
      }
    }
  },
  {
    id: 1666600000,
    name: 'harmony',
    description:
      'Harmony is an open and fast blockchain. Our mainnet runs Ethereum applications with 2-second transaction finality and 100 times lower fees.',
    label: 'Harmony',
    networkLabel: 'Harmony Mainnet Shard 0',
    icon: '/chain-harmony.svg',
    twitter: 'harmonyprotocol',
    notes: [
      '2.02 sec transaction finality',
      '$0.0001 average cost per transaction',
      '$1.09 Billion total value locked',
      'Collusion-resistant',
      'Eco friendly',
      'On-chain file storage',
      'Instant finality'
    ],
    rpcUrl: 'https://api.harmony.one',
    explorerUrl: 'https://explorer.harmony.one',
    mintFee: 0,
    platformFee: 10,
    platformResaleFee: 2.5,
    minListingMinutes: 10080,
    transak: 'PRODUCTION',
    tokenFaucet: null,
    currency: {
      name: 'ONE',
      symbol: 'ONE',
      decimals: 18
    },
    environments: [
      {
        environment: 'mainnet',
        status: 1,
        active: 1
      }
    ],
    addresses: {
      '0.9': {
        erc721FactoryAddress: '0x490B06Ba06B7d711B77a8E4f73ce0eD600Cd971B',
        erc721RouterAddress: '0x386E5664F46d0BF594dbCA682407398fA1833349',
        erc721MarketplaceAddress: '0x80e85f41EA978bfFB31fF58A77adD901ae523C4F',
        erc1155FactoryAddress: '0x7591d0581CcC10a92cbB378F4f0213b5f25cb362',
        erc1155RouterAddress: '0x405E3f3D7638D5C9AE00D619AF179fd99f44464f',
        erc1155MarketplaceAddress: '0x425A331bAc9DBEffdC3851201fEC99967E94505f',
        nullAddress: '0x0000000000000000000000000000000000000000',
        deployer: '0x94aCdC45e2423242C2E7030b25B20D79A7AD0a98'
      },
      '1.0': {
        erc721FactoryAddress: '0x0d4B2684aa1f73d5c060F6E6C779206eDFeB5EEd',
        erc721RouterAddress: '0x7A3D0Dd97789D546eDf183866B687905843ADD1A',
        erc721MarketplaceAddress: '0xbB7d736DDa85FefAD2Ff5b7FF3ed51dAcAaf6aA3',
        erc1155FactoryAddress: '0x8C19495529A32e10d41FB54489bb354e7fCb0396',
        erc1155RouterAddress: '0xa2221292347A46ae7a70F15F49E5B4b4D7Ec46B5',
        erc1155MarketplaceAddress: '0xBf1f200F7a3DF69304a194cf86585416Cc27eEb2',
        nullAddress: '0x0000000000000000000000000000000000000000',
        deployer: '0xD1c4c0A1eb7Fb44B003397D301EB9AFC916e052E'
      }
    }
  },
  {
    id: 998,
    name: 'polygon',
    description:
      'Polygon believes in Web3 for all. Polygon is a decentralised Ethereum scaling platform that enables developers to build scalable user-friendly dApps with low transaction fees without ever sacrificing on security.',
    label: 'Polygon',
    networkLabel: 'Polygon',
    icon: '/chain-polygon.svg',
    twitter: 'polygon',
    notes: [
      'Over 37k Dapps on polygon',
      'Carbon negative blockchain initiative',
      'Buy NFTs with low gas fees and high transaction speeds',
      'Minting on Polygon is very similar to Ethereum',
      'Dedicated blockchains, scalable consensus algorithms, custom Wasm execution environments',
      'Modular "security as a service", provided by a pool of professional validators',
      'Developer experience - Equivalent to Ethereum'
    ],
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    explorerUrl: 'https://mumbai.polygonscan.com/',
    mintFee: 0,
    platformFee: 10,
    platformResaleFee: 2.5,
    minListingMinutes: 10080,
    transak: false,
    tokenFaucet: null,
    currency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    environments: [
      {
        environment: 'mainnet',
        status: 1,
        active: 0
      },
      {
        environment: 'testnet',
        status: 1,
        active: 0
      },
      {
        environment: 'local',
        status: 1,
        active: 0
      }
    ],
    addresses: {
      '1.0': {
        erc721FactoryAddress: '',
        erc721RouterAddress: '',
        erc721MarketplaceAddress: '',
        erc1155FactoryAddress: '',
        erc1155RouterAddress: '',
        erc1155MarketplaceAddress: '',
        nullAddress: '0x0000000000000000000000000000000000000000'
      }
    }
  },
  {
    id: 80001,
    name: 'polygon-test',
    description:
      'Polygon believes in Web3 for all. Polygon is a decentralised Ethereum scaling platform that enables developers to build scalable user-friendly dApps with low transaction fees without ever sacrificing on security.',
    label: 'Polygon',
    networkLabel: 'Polygon',
    icon: '/chain-polygon.svg',
    twitter: 'polygon',
    notes: [
      'Over 37k Dapps on polygon',
      'Carbon negative blockchain initiative',
      'Buy NFTs with low gas fees and high transaction speeds',
      'Minting on Polygon is very similar to Ethereum',
      'Dedicated blockchains, scalable consensus algorithms, custom Wasm execution environments',
      'Modular "security as a service", provided by a pool of professional validators',
      'Developer experience - Equivalent to Ethereum'
    ],
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    explorerUrl: 'https://mumbai.polygonscan.com/',
    mintFee: 0.000000000000000001,
    platformFee: 10,
    platformResaleFee: 2.5,
    minListingMinutes: 10080,
    transak: false,
    tokenFaucet: null,
    currency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    environments: [
      {
        environment: 'mainnet',
        status: 1,
        active: 0
      },
      {
        environment: 'testnet',
        status: 1,
        active: 1
      },
      {
        environment: 'testnet2',
        status: 1,
        active: 1
      },
      {
        environment: 'local',
        status: 1,
        active: 1
      }
    ],
    addresses: {
      '1.0': {
        erc721FactoryAddress: '0x1e281625469C45f0173F2B67FEF8Dd3d33f442F1',
        erc721RouterAddress: '0x5CDE82eA5C3EAe4F16e8a4141573AE4E62eF1338',
        erc721MarketplaceAddress: '0xE567Eef5119b717f2e40AA996763671b47179326',
        erc1155FactoryAddress: '0xAa553D31E1faFBFC27D146513fBAB731B3bbd44E',
        erc1155RouterAddress: '0x81798AFF9a0010f3D33D9e2EF8cD03775955354e',
        erc1155MarketplaceAddress: '0xA5aDb5AD983024c0925868A0b6FBa6e3EC7a308D',
        nullAddress: '0x0000000000000000000000000000000000000000'
      }
    }
  },
  {
    id: 1,
    name: 'mainnet',
    description:
      "Ethereum is a technology that's home to digital money, global payments, and applications. The community has built a booming digital economy, bold new ways for creators to earn online, and so much more. It's open to everyone, wherever you are in the world – all you need is the internet.",
    label: 'Ethereum',
    networkLabel: 'Ethereum',
    icon: '/chain-ethereum.svg',
    twitter: 'ethereum',
    notes: [
      'Ethereum offers the highest liquidity currently available in the NFT market',
      'Between 500-700k daily active wallets',
      'The original network for NFTs',
      'Ethereum NFTs are the most widely accepted NFTs in the industry',
      'PoS, the energy consumption of Ethereum has dropped by an incredible percentage',
      'NFTs on Ethereum typically sell for higher prices compared to NFTs on other chains',
      'Ethereum NFTs have the widest choice for wallets and Dapps'
    ],
    rpcUrl: 'https://mainnet.infura.io/v3/',
    explorerUrl: 'https://etherscan.io',
    mintFee: 0.0003,
    platformFee: 10,
    platformResaleFee: 2.5,
    minListingMinutes: 10080,
    transak: 'PRODUCTION',
    metaport: 'mainnet',
    tokenFaucet: null,
    currency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    environments: [
      {
        environment: 'mainnet',
        status: 0,
        active: 1,
        hidden: 1
      }
    ],
    addresses: {
      '1.0': {
        erc721FactoryAddress: '',
        erc721RouterAddress: '',
        erc721MarketplaceAddress: '',
        erc1155FactoryAddress: '',
        erc1155RouterAddress: '',
        erc1155MarketplaceAddress: '',
        nullAddress: '0x0000000000000000000000000000000000000000'
      }
    }
  },
  {
    id: 997,
    name: 'cardano',
    description:
      'Cardano is a blockchain platform for changemakers, innovators, and visionaries, with the tools and technologies required to create possibility for the many, as well as the few, and bring about positive global change.',
    label: 'Cardano',
    networkLabel: 'Cardano',
    icon: '/chain-cardano.svg',
    twitter: 'cardano',
    notes: [
      'Security - Cardano establishes unrivaled security guarantees',
      'Speed - proof-of-stake consensus mechanism',
      'Energy efficiency - proof-of-stake blockchain',
      'Scalability - increasing transactions throughput as user demand grows.',
      'Ownership - meticulous records of the Cardano NFTs’ origins and history',
      'Sustainability - community driven governance for system improvements.'
    ],
    rpcUrl: '',
    explorerUrl: '',
    mintFee: 0,
    platformFee: 10,
    platformResaleFee: 2.5,
    minListingMinutes: 10080,
    transak: false,
    tokenFaucet: null,
    currency: {
      name: 'ADA',
      symbol: 'ADA',
      decimals: 18
    },
    environments: [
      {
        environment: 'mainnet',
        status: 0,
        active: 0
      },
      {
        environment: 'testnet',
        status: 1,
        active: 0
      },
      {
        environment: 'local',
        status: 1,
        active: 0
      }
    ],
    addresses: {
      '1.0': {
        erc721FactoryAddress: '',
        erc721RouterAddress: '',
        erc721MarketplaceAddress: '',
        erc1155FactoryAddress: '',
        erc1155RouterAddress: '',
        erc1155MarketplaceAddress: '',
        nullAddress: '0x0000000000000000000000000000000000000000'
      }
    }
  },
  {
    id: 1337,
    name: 'local',
    description: 'Local dev environment for developers running a local blockchain',
    label: 'Local',
    networkLabel: 'Local',
    icon: '/chain-local.svg',
    twitter: 'madnfts',
    notes: [
      'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.',
      'Curabitur blandit tempus porttitor.',
      'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
      'Nullam quis risus eget urna mollis ornare vel eu leo.',
      'Aenean lacinia bibendum nulla sed consectetur.',
      'Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.',
      'Cras jus Fto odio, dapibus ac facilisis in, egestas eget quam.'
    ],
    rpcUrl: 'https://local.infura.io/v3/',
    explorerUrl: 'https://local.etherscan.io',
    currency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
      erc20: '0x448af34701070939dcA610b36a6C98cdB1Dfbd16',
      erc20Symbol: 'MOCK'
    },
    mintFee: 0,
    platformFee: 10,
    platformResaleFee: 2.5,
    minListingMinutes: 10080,
    transak: false,
    tokenFaucet: null,
    environments: [
      {
        environment: 'local',
        status: 1,
        active: 0
      }
    ],
    addresses: {
      '1.0': {
        erc721FactoryAddress: '0x9f2867510494D06c59504355366877D4e03eEDdC',
        erc721RouterAddress: '0x2d21D37B04C7d2Be04061ca617f234C827F69368',
        erc721MarketplaceAddress: '0x9BBDF1C210551454Ef4B6Fa14293Dbee4BDD1534',
        erc1155FactoryAddress: '0xfcDeAA4Ba23cF5cF054716EbE41e337f8E38D651',
        erc1155RouterAddress: '0xCF00Db76af7835497b6C0DB5283c552971349685',
        erc1155MarketplaceAddress: '0xaCdbc9E46921984fa7a94495D9cb9541994AA60B',
        nullAddress: '0x0000000000000000000000000000000000000000',
        deployer: '0x6886d3D8D142ae4c102bc8Ea4F34f2aA5A8392ab'
      }
    }
  }
]

export const networkDefault: Network = networks.find((a) => a.name === defaultNetwork)

export const networksVisible: Network[] = networks.filter(
  (a) =>
    !!a.environments.find((b) => b.environment === environment && b.hidden !== 1 && b.active === 1)
)

export const networksEditable: Network[] = networks.filter(
  (a) => !!a.environments.find((b) => b.environment === environment && b.status === 1)
)

export const networksAvailable: Network[] = networks.filter(
  (a) => !!a.environments.find((b) => b.environment === environment && b.active === 1)
)

const walletConnectNetworks = {}
networksAvailable.map((n) => (walletConnectNetworks[n.id] = n.rpcUrl))

export const supportedChains: number[] = networksAvailable.map((a) => a.id)
export const supportedChainsWalletConnect = walletConnectNetworks

export const wagmiAdapters: Chain[] = networksVisible.map((network: Network) : Chain => {
  return {
    id: network.id,
    name: network.name,
    network: network.networkLabel,
    nativeCurrency: network.currency,
    rpcUrls: {
      public: { http: [network.rpcUrl] },
      default: { http: [network.rpcUrl] }
    },
    blockExplorers: {
      default: { name: 'Explorer', url: network.explorerUrl }
    },
  }
})