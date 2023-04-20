// @typed - MH
import { Icon } from '@iconify/react'
import React from 'react'
import { Collection } from '../../types/collection'
import { useRouter } from 'next/router'
import useCrudObjectApi from '../../hooks/api/crudObject'
import { createDropUpdated } from '../../store/createDrop'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile } from '../../store/user'
import Dropdown from '../form/dropdown'

export default function CollectionActions({
  collection,
  dropdownClassName
}: {
  collection?: Collection
  dropdownClassName?: string
}): JSX.Element {
  const router = useRouter()
  const { getData, dataLoading } = useCrudObjectApi()
  const dispatch = useDispatch()
  const profile = useSelector(getUserProfile)

  const addNft = () => {
    dispatch(
      createDropUpdated({
        nft: {
          id: 'empty',
          token_id: '',
          contract_id: collection.contract_id,
          owner: profile.creator_address,
          likes_boost_count: 0,
          creator: profile,
          collection: collection,
          tags: [],
          files: [],
          total_supply: 1
        }
      })
    )
    router.push('/create').then()
  }

  const syncCollection = () => {
    if (dataLoading) return
    getData('sync/collection/' + collection.contract_id).then()
  }

  const syncNfts = () => {
    if (dataLoading) return
    getData('sync/collection/nfts/' + collection.contract_id).then()
  }

  const syncOrders = () => {
    if (dataLoading) return
    getData('sync/collection/orders/' + collection.contract_id).then()
  }

  return (
    <Dropdown
      className={`overflow-hidden dark:bg-transparent dark:border-transparent light:bg-transparent light::border-transparent`}
      wrapperClassName="mb-0"
      dropdownClassName={dropdownClassName}
      name="dashboard-select"
      selectOptions={[
        {
          name: 'Create NFT',
          id: 'create-nft',
          callback: addNft
        },
        {
          name: 'Manage collection',
          id: `/edit-collection?id=${collection.contract_id}`
        },
        {
          id: 'spacer-1',
          name: 'spacer',
          spacer: true
        },
        {
          name: 'Sync Collection',
          id: 'sync-col',
          callback: syncCollection
        },
        {
          name: 'Sync NFTs',
          id: 'sync-nft',
          callback: syncNfts
        },
        {
          name: 'Sync Orders',
          id: 'sync-orders',
          callback: syncOrders
        }
      ]}
      returnObject={true}
      nullable={false}
      onChange={(a) => {
        if (a.callback) {
          a.callback()
        } else {
          router.push(a.id.toString())
        }
      }}
      placeholder={' '}
      placeholderTemplate={() => <Icon icon="fa6-solid:ellipsis-vertical" className="text-xl" />}
    />
  )
}
