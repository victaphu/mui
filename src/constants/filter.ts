import { DataListFilter } from '../types/dataListFilter'

export const defaultSorting: DataListFilter[] = [
  { id: 1, value: 'likes_boost_count', direction: 'desc', name: 'Most Popular' },
  { id: 2, value: 'likes_boost_count', direction: 'asc', name: 'Least Popular' },
  { id: 3, value: 'created_at', direction: 'desc', name: 'Newest First' },
  { id: 4, value: 'created_at', direction: 'asc', name: 'Oldest First' }
]
export const nftVisibilityFilters: DataListFilter[] = [
  { id: 'nft-visibility-1', name: 'Show NSFW', value: '1', column: 'explicit_content' },
  { id: 'nft-visibility-2', name: 'Synced assets only', value: '1', column: 'synced_only' }
]
export const saleFiltersBids: DataListFilter[] = [
  { id: 'sale-1', name: 'Buy now', value: '0', column: 'sale_type' },
  { id: 'sale-2', name: 'Auction', value: '2', column: 'sale_type' },
  {
    id: 'sale-3',
    name: 'My winning bids',
    value: '1',
    column: 'bids_only',
    authenticatedOnly: true
  }
]
export const accountNftFilters: DataListFilter[] = [
  { id: 'hidden-1', name: 'Show hidden', value: '1', column: 'hidden' }
]
export const creatorFilters: DataListFilter[] = [
  {
    id: 'cf-1',
    name: 'Verified accounts',
    value: '1',
    column: 'verified',
    icon: 'fa6-solid:trophy'
  },
  { id: 'cf-2', name: 'OG MAD Creator', value: '1', column: 'wp_id', icon: 'fa6-solid:crown' },
  { id: 'cf-3', name: 'Projects', value: '1', column: 'project', icon: 'fa6-solid:handshake' }
]
export const collectionFilters: DataListFilter[] = [
  { id: 'collect-2', name: '721 collections', value: '721', column: 'token_standard' },
  { id: 'collect-3', name: '1155 collections', value: '1155', column: 'token_standard' }
]
export const collectionSaleFilters: DataListFilter[] = [
  { id: 'col-sale-1', name: 'Minting NOW', value: '1', column: 'public_mint' },
  { id: 'col-sale-2', name: 'Buy now', value: '0', column: 'sale_type' },
  { id: 'col-sale-3', name: 'Auction', value: '2', column: 'sale_type' }
]
export const myCollectionSaleFilters: DataListFilter[] = [
  { id: 'col-sale-1', name: 'Currently minting', value: '1', column: 'public_mint' },
  { id: 'col-sale-2', name: 'Unpublished only', value: '1', column: 'status' },
  { id: 'col-sale-3', name: 'Published only', value: '2', column: 'status' }
]
export const academyFilters: DataListFilter[] = [
  { id: 'academy-1', name: 'Completed', value: '1', column: 'watched', icon: 'fa6-solid:check' },
  { id: 'academy-2', name: 'In progress', value: '2', column: 'watched', icon: 'fa6-solid:pause' },
  { id: 'academy-3', name: 'Unwatched', value: '3', column: 'watched', icon: 'fa6-solid:video' }
]
export const categoryFilters: DataListFilter[] = [
  {
    id: 'cateogry-1',
    name: 'Art',
    value: '1',
    column: 'category',
    icon: 'fa6-solid:palette'
  },
  {
    id: 'cateogry-2',
    name: 'Photography',
    value: '2',
    column: 'category',
    icon: 'fa6-solid:camera'
  },
  {
    id: 'cateogry-3',
    name: 'Games',
    value: '3',
    column: 'category',
    icon: 'fa6-solid:gamepad'
  },
  {
    id: 'cateogry-4',
    name: 'Metaverse',
    value: '4',
    column: 'category',
    icon: 'fa6-solid:globe'
  },
  {
    id: 'cateogry-5',
    name: 'Music',
    value: '5',
    column: 'category',
    icon: 'fa6-solid:music'
  },
  {
    id: 'cateogry-6',
    name: 'Video',
    value: '6',
    column: 'category',
    icon: 'fa6-solid:film'
  }
]
export const collectionSorting: DataListFilter[] = [
  { id: 'csort-1', value: 'likes_boost_count', direction: 'desc', name: 'Most Popular' },
  { id: 'csort-2', value: 'likes_boost_count', direction: 'asc', name: 'Least Popular' },
  { id: 'csort-3', value: 'volume', direction: 'desc', name: 'Highest Volume' },
  { id: 'csort-4', value: 'volume', direction: 'asc', name: 'Lowest Volume' },
  { id: 'csort-5', value: 'created_at', direction: 'desc', name: 'Newest First' },
  { id: 'csort-6', value: 'created_at', direction: 'asc', name: 'Oldest First' }
]
export const creatorSorting: DataListFilter[] = [
  { id: 'creatorsort-0', value: 'followers_count', direction: 'desc', name: 'Most Popular' },
  { id: 'creatorsort-1', value: 'likes_boost_count', direction: 'desc', name: 'Most Likes' },
  { id: 'creatorsort-3', value: 'volume', direction: 'desc', name: 'Highest Sales' },
  { id: 'creatorsort-5', value: 'volume_price', direction: 'desc', name: 'Highest Volume' },
  { id: 'creatorsort-7', value: 'nfts_count', direction: 'desc', name: 'Most NFTs created' },
  { id: 'creatorsort-9', value: 'created_at', direction: 'desc', name: 'Newest First' },
  { id: 'creatorsort-10', value: 'created_at', direction: 'asc', name: 'Oldest First' }
]
export const nftSorting: DataListFilter[] = [
  { id: 'nftsort-1', value: 'created_at', direction: 'desc', name: 'Newest First' },
  { id: 'nftsort-2', value: 'created_at', direction: 'asc', name: 'Oldest First' },
  { id: 'nftsort-3', value: 'likes_boost_count', direction: 'desc', name: 'Most Popular' },
  { id: 'nftsort-4', value: 'likes_boost_count', direction: 'asc', name: 'Least Popular' },
  { id: 'nftsort-5', value: 'volume', direction: 'desc', name: 'Highest Sales' },
  { id: 'nftsort-6', value: 'volume', direction: 'asc', name: 'Lowest Sales' },
  { id: 'nftsort-7', value: 'volume_price', direction: 'desc', name: 'Highest Volume' },
  { id: 'nftsort-8', value: 'volume_price', direction: 'asc', name: 'Lowest Volume' },
  { id: 'nftsort-9', value: 'last_price', direction: 'asc', name: 'Price low to high' },
  { id: 'nftsort-10', value: 'last_price', direction: 'desc', name: 'Price high to low' }
]
export const nftSortingMarketplace: DataListFilter[] = [
  { id: 'nftsort-1', value: 'on_sale_end_time', direction: 'desc', name: 'Newest First' },
  { id: 'nftsort-2', value: 'on_sale_end_time', direction: 'asc', name: 'Oldest First' },
  { id: 'nftsort-3', value: 'likes_boost_count', direction: 'desc', name: 'Most Popular' },
  { id: 'nftsort-4', value: 'likes_boost_count', direction: 'asc', name: 'Least Popular' },
  { id: 'nftsort-5', value: 'volume', direction: 'desc', name: 'Highest Sales' },
  { id: 'nftsort-6', value: 'volume', direction: 'asc', name: 'Lowest Sales' },
  { id: 'nftsort-7', value: 'volume_price', direction: 'desc', name: 'Highest Volume' },
  { id: 'nftsort-8', value: 'volume_price', direction: 'asc', name: 'Lowest Volume' },
  { id: 'nftsort-9', value: 'last_price', direction: 'asc', name: 'Price low to high' },
  { id: 'nftsort-10', value: 'last_price', direction: 'desc', name: 'Price high to low' }
]
export const nftCollectionSorting: DataListFilter[] = [
  { id: 'nftcollectionsort-1', value: 'token_id', direction: 'asc', name: 'Ascending' },
  { id: 'nftcollectionsort-2', value: 'token_id', direction: 'desc', name: 'Descending' },
  {
    id: 'nftcollectionsort-3',
    value: 'likes_boost_count',
    direction: 'desc',
    name: 'Most Popular'
  },
  {
    id: 'nftcollectionsort-4',
    value: 'likes_boost_count',
    direction: 'asc',
    name: 'Least Popular'
  },
  { id: 'nftcollectionsort-5', value: 'volume', direction: 'desc', name: 'Highest Volume' },
  { id: 'nftcollectionsort-6', value: 'volume', direction: 'asc', name: 'Lowest Volume' },
  { id: 'nftcollectionsort-7', value: 'last_price', direction: 'asc', name: 'Price low to high' },
  { id: 'nftcollectionsort-8', value: 'last_price', direction: 'desc', name: 'Price high to low' }
]

export const collectionNftsFilterGroups = [
  {
    id: 'sale-filter',
    value: null,
    nullable: true,
    placeholder: 'Sale',
    icon: 'fa6-solid:wallet',
    options: saleFiltersBids
  },
  {
    id: 'price-filter',
    value: null,
    nullable: true,
    placeholder: 'Price',
    icon: 'fa6-solid:dollar',
    type: 'price'
  },
  {
    id: 'visibility-filter',
    value: null,
    nullable: true,
    placeholder: 'Visibility',
    icon: 'uil:padlock',
    options: nftVisibilityFilters
  }
]
export const creatorFilterGroups = [
  {
    id: 'category-filter',
    value: null,
    nullable: true,
    placeholder: 'Categories',
    icon: 'fa6-solid:table-cells-large',
    options: categoryFilters
  },
  {
    id: 'creator-filter',
    value: null,
    nullable: true,
    placeholder: 'Creator type',
    icon: 'users',
    options: creatorFilters
  }
]
export const projectFilterGroups = [
  {
    id: 'category-filter',
    value: null,
    nullable: true,
    placeholder: 'Category',
    icon: 'fa6-solid:table-cells-large',
    options: categoryFilters
  }
]
export const collectionFilterGroups = [
  {
    id: 'sale-filter',
    value: null,
    nullable: true,
    placeholder: 'Sale',
    icon: 'wallet',
    options: collectionSaleFilters
  },
  {
    id: 'category-filter',
    value: null,
    nullable: true,
    placeholder: 'Category',
    icon: 'fa6-solid:table-cells-large',
    options: categoryFilters
  },
  {
    id: 'collection-filter',
    value: null,
    nullable: true,
    placeholder: 'Type',
    icon: 'fa6-solid:layer-group',
    options: collectionFilters
  }
]
export const myCollectionFilterGroups = [
  {
    id: 'sale-filter',
    value: null,
    nullable: true,
    placeholder: 'Status',
    icon: 'fa6-solid:wallet',
    options: myCollectionSaleFilters
  },
  {
    id: 'category-filter',
    value: null,
    nullable: true,
    placeholder: 'Category',
    icon: 'fa6-solid:table-cells-large',
    options: categoryFilters
  },
  {
    id: 'collection-filter',
    value: null,
    nullable: true,
    placeholder: 'Type',
    icon: 'fa6-solid:layer-group',
    options: collectionFilters
  }
]
export const marketplaceFilterGroups = [
  {
    id: 'sale-filter',
    value: null,
    nullable: true,
    placeholder: 'Sale',
    icon: 'fa6-solid:wallet',
    options: saleFiltersBids
  },
  {
    id: 'price-filter',
    value: null,
    nullable: true,
    placeholder: 'Price',
    icon: 'fa6-solid:dollar',
    type: 'price'
  },
  {
    id: 'category-filter',
    value: null,
    nullable: true,
    placeholder: 'Categories',
    icon: 'fa6-solid:table-cells-large',
    options: categoryFilters
  },
  {
    id: 'visibility-filter',
    value: null,
    nullable: true,
    placeholder: 'Visibility',
    icon: 'uil:padlock',
    options: nftVisibilityFilters
  }
]
export const academyFilterGroups = [
  {
    id: 'academy-filter',
    value: null,
    nullable: true,
    placeholder: 'Academy',
    icon: 'fa6-solid:graduation-cap',
    options: academyFilters
  }
]
export const creatorNftsFilterGroups = [
  {
    id: 'sale-filter',
    value: null,
    nullable: true,
    placeholder: 'Sale',
    icon: 'fa6-solid:wallet',
    options: saleFiltersBids
  },
  {
    id: 'category-filter',
    value: null,
    nullable: true,
    placeholder: 'Category',
    icon: 'fa6-solid:table-cells-large',
    options: categoryFilters
  },
  {
    id: 'account-filter',
    value: null,
    nullable: true,
    placeholder: 'Hidden',
    icon: 'fa6-solid:eye',
    options: accountNftFilters
  }
]
