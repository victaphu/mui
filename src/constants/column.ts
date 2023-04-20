import { DataListTableColumn } from '../types/dataListTable'

export const nftColumns: DataListTableColumn[] = [
  {
    name: 'actions',
    type: 'actions',
    label: '',
    classNameTh: '',
    classNameTd: ''
  },
  {
    name: 'image',
    type: 'image',
    label: 'Image',
    default: '-',
    classNameTh: 'p-2 pl-0',
    classNameTd: 'p-2 pl-0'
  },
  {
    name: 'token_id',
    label: '#',
    default: '-',
    sortable: 'token_id',
    classNameTh: 'p-2',
    classNameTd: 'p-2'
  },
  {
    name: 'name',
    label: 'Name',
    default: '-',
    sortable: 'name',
    classNameTh: 'p-2',
    classNameTd: 'p-2'
  },
  {
    name: 'symbol',
    label: 'Symbol',
    default: '-',
    sortable: 'symbol',
    classNameTh: 'p-2',
    classNameTd: 'p-2'
  },
  {
    name: 'volume',
    label: 'No. Sales',
    type: 'number',
    sortable: 'volume',
    default: '0',
    classNameTh: 'p-2',
    classNameTd: 'p-2 text-center'
  },
  {
    name: 'volume_price',
    label: 'Volume',
    type: 'currency',
    mapColumn: 'volume_price_exact',
    sortable: 'volume_price',
    default: '0',
    classNameTh: 'p-2',
    classNameTd: 'p-2 text-center whitespace-nowrap'
  },
  {
    name: 'last_price',
    label: 'Last price',
    type: 'currency',
    mapColumn: 'last_price_exact',
    sortable: 'last_price',
    default: '0',
    classNameTh: 'p-2',
    classNameTd: 'p-2 text-center'
  },
  {
    name: 'likes_boost_count',
    label: 'No. Likes',
    type: 'number',
    sortable: 'likes_boost_count',
    default: '0',
    classNameTh: 'p-2',
    classNameTd: 'p-2 text-center'
  },
  {
    name: 'holders',
    label: 'No. Holders',
    type: 'length',
    default: '0',
    classNameTh: 'p-2',
    classNameTd: 'p-2 text-center'
  },
  {
    name: 'total_supply',
    label: 'Supply',
    default: '-',
    type: 'number',
    sortable: 'total_supply',
    classNameTh: 'p-2',
    classNameTd: 'p-2 text-center'
  },
  {
    name: 'uri',
    label: 'URI',
    default: '-',
    classNameTh: 'p-2',
    classNameTd: 'p-2'
  },
  {
    name: 'category_object',
    label: 'Category',
    type: 'category_object',
    default: '-',
    sortable: 'category',
    classNameTh: 'p-2',
    classNameTd: 'p-2'
  },
  {
    name: 'description',
    label: 'Description',
    type: 'long_text',
    default: '-',
    classNameTh: 'p-2',
    classNameTd: 'p-2',
    classNameInner: 'w-48'
  },
  {
    name: 'unlockable_url',
    label: 'Unlokcable URL',
    type: 'link',
    default: '-',
    classNameTh: 'p-2',
    classNameTd: 'p-2'
  },
  {
    name: 'external_url',
    label: 'External URL',
    type: 'link',
    default: '-',
    classNameTh: 'p-2',
    classNameTd: 'p-2'
  },
  {
    name: 'explicit_content',
    label: 'Explicit content',
    type: 'boolean',
    sortable: 'explicit_content',
    default: '-',
    classNameTh: 'p-2',
    classNameTd: 'p-2 text-center'
  },
  {
    name: 'files',
    label: 'Files',
    type: 'length',
    default: '0',
    classNameTh: 'p-2',
    classNameTd: 'p-2 text-center'
  },
  {
    name: 'properties',
    label: 'Properties',
    type: 'length',
    default: '0',
    classNameTh: 'p-2',
    classNameTd: 'p-2 text-center'
  },
  {
    name: 'levels',
    label: 'Levels',
    type: 'length',
    default: '0',
    classNameTh: 'p-2',
    classNameTd: 'p-2 text-center'
  },
  {
    name: 'stats',
    label: 'Stats',
    type: 'length',
    default: '0',
    classNameTh: 'p-2',
    classNameTd: 'p-2 text-center'
  },
  {
    name: 'tags',
    label: 'Tags',
    type: 'map',
    mapColumn: 'name',
    default: '-',
    classNameTh: 'p-2',
    classNameTd: 'p-2'
  },
  {
    name: 'unhatched',
    label: 'Hatched',
    type: 'boolean',
    default: '-',
    classNameTh: 'p-2',
    classNameTd: 'p-2 text-center'
  },
  {
    name: 'created_at',
    label: 'Created',
    type: 'date',
    sortable: 'created_at',
    default: '-',
    classNameTh: 'p-2',
    classNameTd: 'p-2 whitespace-nowrap'
  }
]
