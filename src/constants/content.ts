import { Category } from '../types/category'

export const collectionCategories: Category[] = [
  {
    id: 1,
    name: 'Art',
    color: 'madBlueLight',
    icon: 'palette'
  },
  {
    id: 2,
    name: 'Photography',
    color: 'madPurple',
    icon: 'camera'
  },
  {
    id: 3,
    name: 'Games',
    color: 'madGreen',
    icon: 'gamepad'
  },
  {
    id: 4,
    name: 'Metaverse',
    color: 'madPinkLight',
    icon: 'globe'
  },
  {
    id: 5,
    name: 'Music',
    color: 'madYellow',
    icon: 'music'
  },
  {
    id: 6,
    name: 'Video',
    color: 'madOrange',
    icon: 'film'
  }
]
export const homeBanners = [
  {
    id: 1,
    title: "MADNFTs is the world's first and largest social NFT marketplace",
    video: null,
    link: '/marketplace',
    linkText: 'Visit Marketplace',
    bgImage: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/banners/MAD+NFT+BG+01.jpg',
    image: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/banners/MAD+NFT+01.jpg',
    imageMobile: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/banners/MAD+NFT+Mobile+01.jpg'
  },
  {
    id: 2,
    title: 'Academy modules and courses to learn about NFTs and web 3',
    video: null,
    link: '/academy',
    linkText: 'Visit Academy',
    bgImage: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/banners/MAD+NFT+BG+02.jpg',
    image: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/banners/MAD+NFT+02.jpg',
    imageMobile: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/banners/MAD+NFT+Mobile+02.jpg'
  },
  {
    id: 3,
    title: 'Our goal is to create a culture where creators are helping each other win',
    video: null,
    link: '/marketplace',
    linkText: 'Visit Marketplace',
    bgImage: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/banners/MAD+NFT+BG+03.jpg',
    image: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/banners/MAD+NFT+03.jpg',
    imageMobile: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/banners/MAD+NFT+Mobile+03.jpg'
  },
  {
    id: 4,
    title: 'We are helping Projects, Charities and DAOs onboard creators using split royalties',
    video: null,
    link: '/projects',
    linkText: 'Visit Projects',
    bgImage: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/banners/MAD+NFT+BG+04.jpg',
    image: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/banners/MAD+NFT+04.jpg',
    imageMobile: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/banners/MAD+NFT+Mobile+04.jpg'
  }
]
export const toolTipVideos = {
  collectionDescription: {
    placement: 'top',
    title:
      'Give you collection an engaging description and sell your NFTs to your potential buyers.',
    intro: 'Collection Description Explained',
    src: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/videos.clips/Collection+Description.mp4'
  },
  collectionPublish: {
    placement: 'bottom',
    title: 'Publish your collection and its NFTs are discoverable on the website by others.',
    intro: 'Publish Collection Explained',
    src: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/videos.clips/Publishing+a+Drop.mp4'
  },
  collectionCategory: {
    placement: 'top',
    title:
      'Your collection will be displayed in under this category and any NFTs you create will be assigned this category',
    intro: 'Collection Category Explained',
    src: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/videos.clips/Categories.mp4'
  },
  collectionAvatar: {
    placement: 'bottom',
    title:
      'Upload a logo or icon image for your collection, displayed in the collection listing page.',
    intro: 'Collection Icon Explained',
    src: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/videos.clips/Collection+Icon.mp4'
  },
  collectionBanner: {
    placement: 'top',
    title: 'Set a background image for your main collection page.',
    intro: 'Collection Banner Explained',
    src: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/videos.clips/Banners.mp4'
  },
  collectionProject: {
    placement: 'bottom',
    title:
      'Browse through our list of projects, charities and DAOs, that you can contribute towards. Show your support and configure the fee contribution percentage (%).',
    intro: 'Project Support Explained',
    src: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/videos.clips/Project+Support.mp4'
  },
  collectionTokenStandard: {
    placement: 'top',
    title:
      'Choose 721 “Single” for one of a kind or 1155 “Multiple” if you want to sell one NFT multiple times.',
    intro: 'Token Standard Explained',
    src: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/videos.clips/Token+Standards.mp4'
  },
  collectionName: {
    placement: 'bottom',
    title: 'Title your NFT collection so its easy for users to find.',
    intro: 'Collection Name Explained',
    src: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/videos.clips/Collection+Name.mp4'
  },
  collectionSymbol: {
    placement: 'bottom',
    title: 'This gives your NFTs a unique searchable symbol in the blockchain explorer.',
    intro: 'Collection Symbol Explained',
    src: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/videos.clips/Symbol.mp4'
  },
  collectionMaxSupply: {
    placement: 'top',
    title: 'Set the maximum number of NFTs you will create with this collection',
    intro: 'Max Supply Explained',
    src: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/videos.clips/Max+Supply.mp4'
  },
  collectionRoyalties: {
    placement: 'bottom',
    title:
      'Select the royalties percentage (%) of the resale value that you will receive on the marketplace.',
    intro: 'Collection Royalties Explained',
    src: 'https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/videos.clips/Royalties.mp4'
  }
}
