// @typed v1
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useTokenRouter from '../hooks/web3/router'
import useCrudObjectApi from '../hooks/api/crudObject'
import { createDropUpdated, getCreateDrop } from '../store/createDrop'
import client from '../utils/client'
import { domain } from '../constants/domain'
import {
  getMinterStatus,
  formDataUpdated,
  loaderUpdated,
  statusUpdated,
  transactionAdded
} from '../store/minter'
import { getUserProfile } from '../store/user'
import { useRouter } from 'next/router'
import useToken from '../hooks/web3/token'
import useMarketplace from '../hooks/web3/marketplace'
import { DropActionState } from '../types/nft'
import { CreateDropContainerComponent } from '../types/containers'
import useWeb3 from '../hooks/web3/web3'

const DropContainer = ({ Component, className }: CreateDropContainerComponent): JSX.Element => {
  const dispatch = useDispatch()
  const router = useRouter()
  const profile = useSelector(getUserProfile)
  const createDropData = useSelector(getCreateDrop)
  const minterStatus = useSelector(getMinterStatus)
  const routerContract = useTokenRouter()
  const tokenContract = useToken()
  const marketplaceContract = useMarketplace()
  const [dropActionState, setDropActionState] = useState<DropActionState>('loading')
  const { getData } = useCrudObjectApi()
  const { account } = useWeb3()

  const copyFromId = useCallback(
    async (id: string) => {
      if (!profile) return
      setDropActionState('loading')
      const response = await client.get(`${domain.apiUrl}/nft/${id}`)
      if (response.data) {
        dispatch(
          createDropUpdated({
            nft: {
              id: 'empty',
              token_id: '',
              contract_id: response.data.contract_id,
              owner: profile.creator_address,
              uri: '',
              status: 1,
              total_supply: response.data.total_supply,
              name: response.data.name,
              symbol: '', // @todo are we removing the symbol field from token?
              description: response.data.description,
              image: response.data.image,
              category: response.data.category,
              unlockable_url: response.data.unlockable_url,
              external_url: response.data.external_url,
              explicit_content: response.data.explicit_content,
              last_price: 0,
              last_price_exact: 0,
              volume: 0,
              volume_price: 0,
              files: response.data.files,
              properties: response.data.properties,
              levels: response.data.levels,
              stats: response.data.stats,
              created_at: null,
              updated_at: null,
              // Calculated columns
              tags: response.data.tags.map(({ name }) => name).join(','),
              unhatched: true,
              public_name: response.data.public_name,
              description_color: response.data.description_color,
              category_object: response.data.category_object,
              likes_boost_count: 0,
              creator: profile,
              collection: response.data.collection,
              holders: [],
              orders: []
            }
          })
        )
        const collectionResponse = await client.get(
          `${domain.apiUrl}/collection/${response.data.contract_id}`
        )
        if (collectionResponse) {
          dispatch(createDropUpdated({ collection: collectionResponse.data }))
        }
      }
      setDropActionState('idle')
    },
    [dispatch, profile]
  )

  const syncNft = useCallback(async () => {
    if (!createDropData.nft?.collection?.contract_id) return
    setDropActionState('syncing')
    await getData(
      'sync/collection/nfts/' + createDropData.nft.collection.contract_id,
      null,
      true
    ).then(() => setDropActionState('idle'))
  }, [createDropData.nft?.collection?.contract_id, getData])

  const updateDrop = (data) => {
    dispatch(createDropUpdated({ ...createDropData, ...data }))
  }

  const updateDropNft = (data) => {
    const newData = { ...createDropData }
    newData.nft = {
      ...newData.nft,
      ...data
    }
    dispatch(createDropUpdated(newData))
  }

  const updateDropCollection = (data) => {
    const newData = { ...createDropData }
    newData.nft = {
      ...newData.nft,
      ...{
        collection: data || {},
        category: data?.category || null,
        category_object: data?.category_object || null
      }
    }
    dispatch(createDropUpdated(newData))
  }

  // @todo validate at this stage
  const createDrop = async () => {
    dispatch(loaderUpdated('Check your wallet...'))
    dispatch(statusUpdated('pending'))

    // Generate the next tokenID and pin the metadata
    const jsonMetaData = await tokenContract.formatDropJson(createDropData.nft)
    const currentSupply =
      createDropData.nft.collection.version === '0.9'
        ? await tokenContract.getCurrentSupply()
        : await tokenContract.getMintCount()
    const tokenId = currentSupply ? parseInt(currentSupply.toString()) + 1 : 1
    const tokenUri = await tokenContract.pinJson(jsonMetaData, tokenId)
    if (tokenUri.error || currentSupply.error) {
      dispatch(statusUpdated('idle'))
      dispatch(loaderUpdated(null))
      return
    }

    // Attempt to mint the NFT
    const minted = await routerContract.basicMintTo(
      account,
      createDropData.nft.collection.contract_id,
      createDropData.nft.total_supply,
      (
        await tokenContract.getPrice()
      ).response
    )
    if (minted.error) {
      dispatch(statusUpdated('idle'))
      dispatch(loaderUpdated(null))
      return
    }
    dispatch(createDropUpdated(createDropData))
    dispatch(
      transactionAdded({
        transactionHash: minted.response.transactionHash,
        blockHash: minted.response.blockHash,
        blockNumber: minted.response.blockNumber,
        gasUsed: minted.response.gasUsed,
        cumulativeGasUsed: minted.response.cumulativeGasUsed,
        from: minted.response.from,
        to: minted.response.to
      })
    )
    const newData = {
      ...createDropData,
      ...{ nft: { ...createDropData.nft, ...{ token_id: tokenId } } }
    }
    dispatch(formDataUpdated(newData))

    // Attempt to list for sale, we must set the token_id param
    if (createDropData.sale_type === 0 || createDropData.sale_type === 2) {
      dispatch(statusUpdated('listedPending'))
    } else {
      dispatch(statusUpdated('complete'))
    }
  }

  // Set the profile based on logged in user
  useEffect(() => {
    dispatch(createDropUpdated({ profile: profile, creator: profile }))
  }, [dispatch, profile])

  // Set the contracts based on selected contract
  useEffect(() => {
    if (createDropData.nft?.collection) {
      routerContract.setContractVersion(createDropData.nft.collection.version)
      routerContract.setContractType(createDropData.nft.collection.token_standard)
      tokenContract.setContractVersion(createDropData.nft.collection.version)
      tokenContract.setContractAddress(createDropData.nft.collection.contract_id)
      tokenContract.setContractType(createDropData.nft.collection.token_standard)
      tokenContract.setTokenType(createDropData.nft.collection.token_type)
      marketplaceContract.setContractVersion(createDropData.nft.collection.version)
      marketplaceContract.setContractType(createDropData.nft.collection.token_standard)
      marketplaceContract.setContractAddress(createDropData.nft.collection.contract_id)
    }
    // @todo - address this hook dependencies error and adjust could cause stale closure
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createDropData.nft?.collection])

  // Set the tokens ID when collection is changed
  useEffect(() => {
    const targetId = (tokenContract?.mintSupply + 1).toString()
    if (createDropData?.nft?.token_id.toString() === targetId) return
    const newData = { ...createDropData }
    newData.nft = {
      ...newData.nft,
      ...{ token_id: targetId }
    }
    dispatch(createDropUpdated(newData))
  }, [createDropData, dispatch, tokenContract?.mintSupply])

  // Process router.query.copy if set
  useEffect(() => {
    if (router.query && router.query.copy) {
      copyFromId(router.query.copy.toString()).then(() => {
        router.push({
          search: ''
        })
      })
    }
  }, [copyFromId, router])

  // set default data
  useEffect(() => {
    if (createDropData.nft) return
    dispatch(
      createDropUpdated({
        nft: {
          id: 'empty',
          token_id: '',
          contract_id: '',
          owner: profile.creator_address,
          uri: '',
          status: 1,
          total_supply: 0,
          name: '',
          symbol: '',
          description: '',
          image: '',
          category: null,
          unlockable_url: '',
          external_url: '',
          explicit_content: false,
          last_price: 0,
          last_price_exact: 0,
          volume: 0,
          volume_price: 0,
          files: [],
          properties: [],
          levels: [],
          stats: [],
          created_at: null,
          updated_at: null,
          // Calculated columns
          tags: [],
          unhatched: true,
          public_name: profile.public_name,
          description_color: null,
          category_object: null,
          likes_boost_count: 0,
          creator: profile,
          collection: {},
          holders: [],
          orders: []
        }
      })
    )
  }, [createDropData.nft, dispatch, profile])

  // Sync NFT after first minted or after minted and listed
  useEffect(() => {
    if (
      (minterStatus === 'complete' || minterStatus === 'listed') &&
      dropActionState !== 'syncing'
    ) {
      syncNft().then()
    }
  }, [minterStatus, dropActionState, syncNft])

  return (
    <>
      {createDropData.nft && (
        <Component
          className={className}
          createDropData={createDropData}
          createDrop={createDrop}
          updateDrop={updateDrop}
          updateDropNft={updateDropNft}
          updateDropCollection={updateDropCollection}
          syncNft={syncNft}
          copyFromId={copyFromId}
        />
      )}
    </>
  )
}
export default DropContainer
