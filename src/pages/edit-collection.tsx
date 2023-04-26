import { Collection } from '../types/collection'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { collectionTypes, mintingTypes } from '../constants/config'
import {
  formDataUpdated,
  loaderUpdated,
  statusUpdated,
  transactionAdded
} from '../store/collection'
import { createDropUpdated } from '../store/createDrop'
import { getUserProfile } from '../store/user'
import client from '../utils/client'
import useToaster from '../hooks/toast'
import useFactory from '../hooks/web3/factory'
import useToken from '../hooks/web3/token'
import useTokenRouter from '../hooks/web3/router'
import { Sidebar } from '../components/sidebar'
import { ToolTipVideo } from '../components/toolTip/toolTipVideo'
import Input from '../components/form/input'
import Dropdown from '../components/form/dropdown'
import Title from '../components/common/title'
import UploadSingle from '../components/form/uploadSingle'
import Switch from '../components/form/switch'
import Info from '../components/form/info'
import Label from '../components/form/label'
import CollectionMinter from '../components/minter/collection'
import Loader from '../components/common/loader'
import CollectionChainSelect from '../components/collection/collectionChainSelect'
import useCrudObjectApi from '../hooks/api/crudObject'
import { Tooltip } from '../components/toolTip/toolTip'
import { Icon } from '@iconify/react'
import Slider from '../components/form/slider'
import CollectionEditActions from '../components/collection/collectionEditActions'
import { domain } from '../constants/domain'
import { collectionCategories, toolTipVideos } from '../constants/content'
import { getSidebarOpen } from '../store/ux'
import useWindow from '../hooks/useWindow'
import Button from '../components/form/button'
import DropdownCollection from '../components/form/dropdownCollection'
import Withdraw from '../components/minter/withdraw'
import { log } from '../utils/log'
import useFuel from '../hooks/web3/fuel'
import { getCurrentNetwork } from '../store/web3'
import useWeb3 from '../hooks/web3/web3'

const EditCollectionPage = (): JSX.Element => {
  const dispatch = useDispatch()
  const { account } = useWeb3()
  const network = useSelector(getCurrentNetwork)
  const profile = useSelector(getUserProfile)
  const router = useRouter()
  const toaster = useToaster()
  const factoryContract = useFactory()
  const tokenContract = useToken()
  const routerContract = useTokenRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [fetchingCollection, setFetchingCollection] = useState<boolean>(false)
  const [formData, setFormData] = useState<Collection>(null)
  const { getData } = useCrudObjectApi()
  const sidebarOpen = useSelector<boolean>(getSidebarOpen)
  const { width } = useWindow()
  const { pow } = useFuel()
  const updateFormData = (data) => {
    setFormData({ ...formData, ...data })
  }

  const updateCollection = async () => {
    setLoading(true)
    try {
      return formData?.contract_id
        ? await client.put(`${domain.apiUrl}/collection/${formData.contract_id}`, formData)
        : await client.post(`${domain.apiUrl}/collection`, formData)
    } catch (e) {
      toaster.error('Unable to save collection', e.response?.data?.message)
      setLoading(false)
      return false
    }
  }

  const setPublicMintState = async () => {
    dispatch(loaderUpdated('Check you wallet...'))
    dispatch(statusUpdated('pending-publicMintState'))
    const state = await routerContract.setMintState(
      account,
      formData.contract_id,
      !formData.public_mint_state,
      0
    )
    if (state.error) {
      dispatch(statusUpdated('idle'))
      dispatch(loaderUpdated(null))
      return state
    }
    dispatch(formDataUpdated(formData))
    dispatch(
      transactionAdded({
        transactionHash: state.response.transactionHash,
        gasUsed: state.response.gasUsed,
        contractAddress: formData.contract_id
      })
    )
    dispatch(statusUpdated('complete-publicMintState'))
    return state
  }

  const handleAddNft = () => {
    dispatch(
      createDropUpdated({
        nft: {
          id: 'empty',
          token_id: '',
          contract_id: formData.contract_id,
          owner: profile.creator_address,
          likes_boost_count: 0,
          creator: profile,
          collection: formData,
          tags: [],
          files: [],
          total_supply: 1
        }
      })
    )
    router.push('/create').then()
  }

  const handleCreateCollection = async () => {
    setLoading(true)
    if (
      !formData ||
      !formData.token_type ||
      !formData.token_standard ||
      !formData.name ||
      !formData.symbol ||
      !formData.max_supply ||
      (!formData.base_uri && formData.minting_type === '2') ||
      (!formData.mint_price && formData.minting_type === '2')
    ) {
      toaster.error('Error', 'Please fill out all the required fields')
      setLoading(false)
      return
    }
    dispatch(loaderUpdated('Check you wallet...'))
    dispatch(statusUpdated('pending'))

    //await pow()

    // If we are using an existing splitter address
    let splitterAddress
    if (formData.royalty_split) {
      splitterAddress = formData.royalty_split.splitter
      log('mad:createCollection:splitter', splitterAddress)
    } else {
      const splitterData = factoryContract.formatSplitter(formData)
      const splitter = await factoryContract.createSplitter(
        factoryContract.salt(),
        account,
        splitterData.ambassador.address,
        splitterData.ambassador.percentage,
        splitterData.project.address,
        splitterData.project.percentage
      )
      if (splitter.error) {
        dispatch(statusUpdated('idle'))
        dispatch(loaderUpdated(null))
        setLoading(false)
        return
      }
      splitterAddress = splitter.response.events.SplitterCreated.returnValues.splitter
    }
    const collection = await factoryContract.createCollection(
      formData.token_type || 0,
      factoryContract.salt(),
      formData.name,
      formData.symbol,
      formData.mint_price ? parseFloat(formData.mint_price.toString()) : 0,
      formData.max_supply ? parseInt(formData.max_supply.toString()) : 0,
      formData.base_uri ? formData.base_uri : domain.defaultBaseUri,
      splitterAddress,
      formData.royalties ? parseInt(formData.royalties.toString()) * 100 : 0,
      account
    )
    if (collection.error) {
      dispatch(statusUpdated('idle'))
      dispatch(loaderUpdated(null))
      setLoading(false)
      return
    } else {
      dispatch(formDataUpdated(formData))
      dispatch(
        transactionAdded({
          transactionHash: collection.response.transactionHash,
          gasUsed: collection.response.gasUsed,
          contractAddress:
            collection.response?.events?.ERC721BasicCreated?.returnValues?.newCollection ||
            collection.response?.events?.ERC721LazyCreated?.returnValues?.newCollection ||
            collection.response?.events?.ERC1155BasicCreated?.returnValues?.newCollection ||
            collection.response?.events?.ERC1155LazyCreated?.returnValues?.newCollection
        })
      )
      dispatch(statusUpdated('complete'))
    }
    setLoading(false)
  }

  const handleUpdateCollection = async () => {
    const result = await updateCollection()
    if (result) {
      toaster.success('Success', 'Collection updated')
    }
    setLoading(false)
  }

  const handleSetPublicMintState = async () => {
    const response = await updateCollection()
    if (response) {
      const state = await setPublicMintState()
      if (!state.error) {
        const collection = await getData('sync/collection/' + formData.contract_id, null, true)
        setFormData(collection.data)
      }
    }
    setLoading(false)
  }

  const handleSetBaseUri = async () => {
    setLoading(true)
    dispatch(loaderUpdated('Check you wallet...'))
    dispatch(statusUpdated('pending-setBaseUri'))
    const baseUri = await routerContract.setBaseUri(
      account,
      formData.contract_id,
      formData.base_uri
    )
    if (baseUri.error) {
      dispatch(statusUpdated('idle'))
      dispatch(loaderUpdated(null))
      setLoading(false)
      return
    }
    dispatch(formDataUpdated(formData))
    dispatch(
      transactionAdded({
        transactionHash: baseUri.response.transactionHash,
        gasUsed: baseUri.response.gasUsed,
        contractAddress: formData.contract_id
      })
    )
    dispatch(statusUpdated('complete-setBaseUri'))
    setLoading(false)
  }

  useEffect(() => {
    const { id, type } = router.query
    if (fetchingCollection || loading) return

    // setup form data
    if (id && profile && !formData?.id) {
      setLoading(true)
      setFetchingCollection(true)
      client
        .get(`${domain.apiUrl}/collection/${id}`)
        .then((response) => {
          setFormData(response.data)
          setLoading(false)
          setFetchingCollection(false)
        })
        .catch(() => {
          router.push('/dashboard').then(() => {
            toaster.error(
              'We could not find your collection',
              'Please wait while the collection is synced from chain, this usually takes a few minutes.',
              50000
            )
          })
        })
    } else {
      if (!formData?.token_standard) {
        setFormData({
          ...formData,
          ...{
            token_type: 1,
            token_standard: type === '1155' ? '1155' : '721',
            version: '1.0',
            royalty_split: null
          }
        })
      }
    }
    // Load contract APIs based on selected standard
    if (formData?.token_standard) {
      factoryContract.setContractVersion(formData.version)
      factoryContract.setContractType(formData.token_standard)
    }
    if (formData?.contract_id) {
      tokenContract.setContractVersion(formData.version)
      tokenContract.setContractAddress(formData.contract_id)
      tokenContract.setContractType(formData.token_standard)
      tokenContract.setTokenType(formData.token_type)
      routerContract.setContractVersion(formData.version)
      routerContract.setContractType(formData.token_standard)
    }
  }, [
    factoryContract,
    fetchingCollection,
    formData,
    loading,
    profile,
    router,
    routerContract,
    toaster,
    tokenContract
  ])

  const [containerStyle, setContainerStyle] = useState<{ minWidth }>()
  useEffect(() => {
    const result = {
      minWidth:
        width < 768
          ? sidebarOpen
            ? 'calc(100vw + 420px)'
            : '100vw'
          : sidebarOpen
          ? 'calc(100% - 420px)'
          : 'calc(100% - 72px)'
    }
    setContainerStyle(result)
  }, [width, sidebarOpen])

  return (
    <section className="flex dark:bg-madBlack bg-madWhite">
      <Sidebar
        profile={profile}
        backButton={true}
        showProfileLinks={true}
        showProfileHeader={true}
      />
      <CollectionMinter collection={formData} />
      <div className="py-6 relative" style={containerStyle}>
        <div className="container min-w-full lg:min-w-[90%] lg:w-[90%] mx-auto items-center">
          {loading && (
            <Loader className="flex items-center bg-opacity-80 dark:bg-opacity-80 dark:bg-madCarbon bg-madWhite absolute top-0 left-0 right-0 bottom-0 z-10" />
          )}
          <Title
            className="flex flex-col md:flex-row md:items-end mb-6"
            title={formData?.id ? 'Manage' : 'Create'}
            subTitle="Collection"
          >
            <span className="ml-3">{formData?.id ? '' : 'Select your preferred chain'}</span>
          </Title>
          <div className="flex flex-col lg:flex-row gap-2">
            <div className="w-full lg:w-2/3">
              <CollectionChainSelect
                allowSelection={!formData?.id}
                selectedChain={formData?.chain}
              />
              {formData?.id && (
                <div className="dark:bg-madOnyx bg-zinc-200 rounded-xl p-4 my-2 flex flex-col gap-2">
                  <Label
                    name="payouts"
                    label="Collection"
                    subLabel="Content"
                    className="mb-3 block font-bold text-2xl"
                    tooltip={
                      <Tooltip
                        placement="bottom"
                        button={<Icon icon="fa-solid:question-circle" className="text-lg ml-2" />}
                      >
                        <div className="mb-2 font-normal">
                          <h5 className="mb-2 font-bold text-lg">Collection content</h5>
                          Update your collections content using the fields below, then publish your
                          collection so its NFTs are discoverable on madnfts.io by others.
                        </div>
                      </Tooltip>
                    }
                  />
                  <span className="text-sm text-gray-700">
                    <span className="text-madPink">*</span>Required field
                  </span>
                  <div className="flex flex-col gap-2 mb-4">
                    <Dropdown
                      disabled={!formData?.id}
                      label="Category"
                      name="category"
                      placeholder="Select category"
                      value={formData?.category || ''}
                      required={true}
                      nullable={false}
                      onChange={(obj) => {
                        updateFormData({ category: obj.id })
                      }}
                      selectOptions={collectionCategories}
                      tooltip={
                        <ToolTipVideo
                          placement={toolTipVideos.collectionCategory.placement}
                          intro={toolTipVideos.collectionCategory.intro}
                          title={toolTipVideos.collectionCategory.title}
                          src={toolTipVideos.collectionCategory.src}
                        />
                      }
                    />
                    <Input
                      disabled={!formData?.id}
                      label="Description"
                      name="description"
                      type="textarea"
                      placeholder="My new collection"
                      value={formData?.description || ''}
                      required={true}
                      onChange={(value) => updateFormData({ description: value })}
                      tooltip={
                        <ToolTipVideo
                          placement={toolTipVideos.collectionDescription.placement}
                          intro={toolTipVideos.collectionDescription.intro}
                          title={toolTipVideos.collectionDescription.title}
                          src={toolTipVideos.collectionDescription.src}
                        />
                      }
                    />
                    <Input
                      disabled={!formData?.id}
                      name="link"
                      type="text"
                      info="Optionally display an external link on your public collections page"
                      label="External link"
                      placeholder="https://external.link"
                      value={formData?.external_link || ''}
                      required={false}
                      onChange={(value) => updateFormData({ external_link: value })}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="w-full md:w-[35%]">
                      <Label
                        name="img_avatar"
                        label="Collection"
                        subLabel="Icon"
                        required={true}
                        tooltip={
                          <ToolTipVideo
                            placement={toolTipVideos.collectionDescription.placement}
                            intro={toolTipVideos.collectionDescription.title}
                            title={toolTipVideos.collectionDescription.intro}
                            src={toolTipVideos.collectionDescription.src}
                          />
                        }
                      />
                      <UploadSingle
                        className="h-52 w-full block border border-gray-700 border-dashed rounded-sm mt-4"
                        disabled={!formData?.id}
                        image={formData?.img_avatar}
                        saveFile={(a) => updateFormData({ img_avatar: a })}
                        deleteFile={() => updateFormData({ img_avatar: null })}
                      />
                    </div>
                    <div className="flex flex-col md:w-[65%]">
                      <Label
                        name="img_banner"
                        label="Collection"
                        subLabel="Banner"
                        required={true}
                        tooltip={
                          <ToolTipVideo
                            placement={toolTipVideos.collectionBanner.placement}
                            intro={toolTipVideos.collectionBanner.intro}
                            title={toolTipVideos.collectionBanner.title}
                            src={toolTipVideos.collectionBanner.src}
                          />
                        }
                      />
                      <UploadSingle
                        className="h-52 w-full block border border-gray-700 border-dashed rounded-sm mt-3"
                        disabled={!formData?.id}
                        image={formData?.img_banner}
                        saveFile={(a) => updateFormData({ img_banner: a })}
                        deleteFile={() => updateFormData({ img_banner: null })}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="dark:bg-madOnyx bg-zinc-200 rounded-xl p-4 flex flex-col gap-2">
                {formData?.id && (
                  <Info
                    info={`You can no longer edit the name, symbol, token standard, token type and project support settings.`}
                  />
                )}
                <span className="text-sm text-gray-700">
                  <span className="text-madPink">*</span>Required field
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Dropdown
                    disabled={!!formData?.id}
                    label="Token Standard"
                    name="type"
                    placeholder="Select standard"
                    value={formData?.token_standard === '1155' ? '1155' : '721'}
                    required={true}
                    nullable={false}
                    onChange={(obj) => {
                      factoryContract.setContractType(obj.id.toString())
                      updateFormData({ token_standard: obj.id, royalty_split: null })
                      return null
                    }}
                    selectOptions={collectionTypes}
                    tooltip={
                      <ToolTipVideo
                        placement={toolTipVideos.collectionTokenStandard.placement}
                        intro={toolTipVideos.collectionTokenStandard.intro}
                        title={toolTipVideos.collectionTokenStandard.title}
                        src={toolTipVideos.collectionTokenStandard.src}
                      />
                    }
                  />
                  {!formData?.id && (
                    <Dropdown
                      disabled={!!formData?.id}
                      label="Minting Type"
                      name="minting_type"
                      placeholder="Select token type"
                      value={formData?.minting_type ? formData?.minting_type.toString() : '1'}
                      required={true}
                      nullable={false}
                      onChange={(obj) => {
                        updateFormData({ minting_type: obj.id })
                        return null
                      }}
                      selectOptions={mintingTypes}
                      tooltip={
                        <Tooltip button={<Icon icon="fa-solid:question-circle" />}>
                          <div className="w-64">
                            {mintingTypes.map((a) => (
                              <div key={a.id} className="mb-2">
                                <strong>{a.name}:</strong> {a.description}
                              </div>
                            ))}
                          </div>
                        </Tooltip>
                      }
                    />
                  )}
                </div>
                <Input
                  disabled={!!formData?.id}
                  label="Name"
                  name="name"
                  type="text"
                  placeholder="My Collection"
                  value={formData?.name || ''}
                  required={true}
                  tooltipPlacement={'bottom'}
                  tooltip={
                    <ToolTipVideo
                      placement={toolTipVideos.collectionName.placement}
                      intro={toolTipVideos.collectionName.intro}
                      title={toolTipVideos.collectionName.title}
                      src={toolTipVideos.collectionName.src}
                    />
                  }
                  onChange={(value) => {
                    updateFormData({ name: value })
                  }}
                />
                <Input
                  disabled={!!formData?.id}
                  label="Symbol"
                  name="symbol"
                  type="text"
                  placeholder="MAD"
                  value={formData?.symbol || ''}
                  required={true}
                  onChange={(value) => updateFormData({ symbol: value })}
                  tooltip={
                    <ToolTipVideo
                      placement={toolTipVideos.collectionSymbol.placement}
                      intro={toolTipVideos.collectionSymbol.intro}
                      title={toolTipVideos.collectionSymbol.title}
                      src={toolTipVideos.collectionSymbol.src}
                    />
                  }
                />
                {(formData?.id ||
                  formData?.minting_type == '2' ||
                  formData?.base_uri === domain.defaultBaseUri) && (
                  <>
                    <div className="mb-2 flex items-end justify-center">
                      <Input
                        name="base_uri"
                        label="Base URI"
                        type="text"
                        placeholder={'ipfs://'}
                        value={formData?.base_uri || ''}
                        tooltip={
                          <Tooltip button={<Icon icon="fa-solid:question-circle" />}>
                            <div className="w-64">
                              <h5 className="mb-2 font-bold">Base URI</h5>
                              <p className="mb-2">
                                Set your BASE URI where your metadata files will be uploaded. Visit
                                the academy to find out how to manage your metadata files.
                              </p>
                              Your NFTs will remain &apos;unhatched&lsquo; until you upload a
                              correct metadata file for each NFT in the collection.
                            </div>
                          </Tooltip>
                        }
                        required={true}
                        onChange={(value) => updateFormData({ base_uri: value })}
                        wrapperClassName="w-full"
                        className={`${
                          formData?.id && formData.base_uri !== 'mad://'
                            ? 'rounded-tr-sm rounded-br-sm'
                            : 'rounded-full'
                        } dark:bg-madOnyx bg-madWhite w-full px-4 py-2 border border-gray-500 focus:border-madPink focus:outline-none focus:ring focus:ring-madPink dark:focus:text-dark-madWhite focus:text-light-madWhite`}
                      />
                      {formData?.id && (
                        <span className="dark:bg-madOnyx bg-madWhite px-3.5 py-2 border border-gray-500 text-gray-500 ml-2 rounded-full focus:outline-none focus:ring focus:ring-madPink whitespace-nowrap">
                          <Button
                            onClick={handleSetBaseUri}
                            colour="madGray"
                            hoverColour="madPink"
                            className="border-0 text h-auto p-0 lg:p-0 hover:bg-transparent dark:hover:bg-transparent"
                          >
                            Update
                          </Button>
                        </span>
                      )}
                    </div>
                  </>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    disabled={!!formData?.id}
                    label="Max Supply"
                    name="max_supply"
                    type="number"
                    placeholder="1"
                    min={1}
                    step={1}
                    value={formData?.max_supply || ''}
                    required={true}
                    tooltipPlacement={'bottom'}
                    tooltip={
                      <ToolTipVideo
                        placement={toolTipVideos.collectionMaxSupply.placement}
                        intro={toolTipVideos.collectionMaxSupply.intro}
                        title={toolTipVideos.collectionMaxSupply.title}
                        src={toolTipVideos.collectionMaxSupply.src}
                      />
                    }
                    onChange={(value) =>
                      updateFormData({
                        max_supply: value < 0 ? 0 : parseInt(value.toString()).toFixed(0)
                      })
                    }
                  />
                  {(formData?.minting_type === '2' && !formData?.id) ||
                  (formData?.id && parseFloat(formData?.mint_price.toString())) ? (
                    <div>
                      <Input
                        disabled={!!formData?.id}
                        label="Mint Price"
                        name="mint_price"
                        type="number"
                        placeholder="0"
                        value={formData?.mint_price || 0}
                        required={true}
                        tooltipPlacement={'bottom'}
                        tooltip={
                          <Tooltip button={<Icon icon="fa-solid:question-circle" />}>
                            <div className="mb-2 w-36">
                              <h5 className="mb-2 font-bold">Mint Price</h5>
                              Set your minting price buyers pay when minting NFTs in your
                              collection. A mint fee of {network.mintFee} is added to the mint price
                              you set
                            </div>
                          </Tooltip>
                        }
                        onChange={(value) => updateFormData({ mint_price: value })}
                      />
                      <div>
                        <p className="text-zinc-500 p-2 text-sm">
                          Price your collectors pay, mint fee + mint price:{' '}
                        </p>
                        <div className="p-2 rounded bg-madBlack">
                          Total:{' '}
                          {formData?.mint_price
                            ? parseFloat(formData?.mint_price.toString() || '0') +
                              parseFloat(network.mintFee || '0')
                            : network.mintFee}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3">
              {!formData?.id && (
                <div className="p-4 dark:bg-madOnyx bg-zinc-200 rounded-2xl w-full mb-2">
                  <Label
                    name="collections"
                    label="Select"
                    subLabel="Royalties"
                    className="mb-3 block font-bold text-2xl"
                  />
                  <div className="mb-4">
                    <Info info="Select a royalties setup from one of your existing collections to save on gas, or create a new payout configuration below." />
                  </div>
                  {account && formData?.token_standard === '721' && (
                    <DropdownCollection
                      onChange={(obj) => {
                        updateFormData(
                          obj
                            ? {
                                royalty_split: obj,
                                royalties: obj.royalties / 100,
                                royalty_recipient: obj.royalty_recipient,
                                project_percent: obj.project_percent,
                                project_address: obj.project_address
                              }
                            : { royalty_split: null }
                        )
                      }}
                      params={{ token_standard: formData?.token_standard, version: '1.0' }}
                      collectionId={formData?.royalty_split?.id}
                      creatorAddress={account}
                      displayType="minimal"
                      dropDownClassName="dropdown-menu-right"
                    />
                  )}
                  {account && formData?.token_standard === '1155' && (
                    <DropdownCollection
                      onChange={(obj) => {
                        updateFormData(
                          obj
                            ? {
                                royalty_split: obj,
                                royalties: obj.royalties / 100,
                                royalty_recipient: obj.royalty_recipient,
                                project_percent: obj.project_percent,
                                project_address: obj.project_address
                              }
                            : { royalty_split: null }
                        )
                      }}
                      params={{ token_standard: formData?.token_standard, version: '1.0' }}
                      collectionId={formData?.royalty_split?.id}
                      creatorAddress={account}
                      displayType="minimal"
                    />
                  )}
                </div>
              )}
              {formData?.id && <Withdraw collection={formData} />}
              <div className="p-4 dark:bg-madOnyx bg-zinc-200 rounded-2xl w-full mb-2">
                <Label
                  name="royalties"
                  label="Your"
                  subLabel="Royalties"
                  className="mb-3 block font-bold text-2xl"
                  tooltip={
                    <ToolTipVideo
                      placement={toolTipVideos.collectionRoyalties.placement}
                      intro={toolTipVideos.collectionRoyalties.intro}
                      title={toolTipVideos.collectionRoyalties.title}
                      src={toolTipVideos.collectionRoyalties.src}
                    />
                  }
                />
                {!formData?.id ? (
                  <Info info="Select the royalties percentage (%) of the resale value that you will receive on the marketplace." />
                ) : (
                  <Info info="Your royalties percentage (%) you will receive on marketplace sales. This cannot be changed." />
                )}
                <Slider
                  disabled={!!formData?.id}
                  value={
                    formData?.id && formData?.royalties
                      ? formData?.royalties / 100
                      : formData?.royalties
                      ? formData?.royalties
                      : 0
                  }
                  min={0}
                  max={10}
                  step={1}
                  name="royalties"
                  onChange={(value) => {
                    updateFormData({ royalty_split: null, royalties: value })
                  }}
                />
              </div>
              <div className="p-4 dark:bg-madOnyx bg-zinc-200 rounded-2xl w-full">
                <Label
                  name="project_address"
                  label="Project"
                  subLabel="Support"
                  className="mb-3 block font-bold text-2xl"
                  tooltip={
                    <ToolTipVideo
                      placement={toolTipVideos.collectionProject.placement}
                      intro={toolTipVideos.collectionProject.intro}
                      title={toolTipVideos.collectionProject.title}
                      src={toolTipVideos.collectionProject.src}
                    />
                  }
                />
                {!!formData?.id && !formData?.project_address && (
                  <Info info="This collection does not donate to a project. This cannot be changed." />
                )}
                {account && !formData?.id && (
                  <Dropdown
                    disabled={!!formData?.id}
                    name="project_address"
                    placeholder="Support a Project"
                    value={formData?.project_address || ''}
                    onChange={(obj) => {
                      updateFormData({ royalty_split: null, project_address: obj.id })
                    }}
                    selectOptionsRemote="/creators"
                    selectOptionsRemoteId="creator_address"
                    selectOptionsRemoteName="public_name"
                    selectOptionsRemoteConfig={{
                      params: { projects: true, per_page: 1000, projects_exclude: account }
                    }}
                  />
                )}
                {formData?.project_address && (
                  <Slider
                    disabled={!!formData?.id}
                    value={formData?.project_percent || 0}
                    min={0}
                    max={10}
                    step={1}
                    name="project_percent"
                    onChange={(value) => {
                      updateFormData({ royalty_split: null, project_percent: value })
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          {formData?.id && (
            <Switch
              className="flex items-center pr-8 mt-4"
              icon="fa6-solid:rocket"
              preTitle="Publish"
              title="Your"
              subTitle="Collection"
              value={formData?.status === 2}
              onChange={() => updateFormData({ status: formData?.status === 2 ? 1 : 2 })}
              name="publish"
              tooltip={
                <ToolTipVideo
                  placement={toolTipVideos.collectionPublish.placement}
                  intro={toolTipVideos.collectionPublish.intro}
                  title={toolTipVideos.collectionPublish.title}
                  src={toolTipVideos.collectionPublish.src}
                />
              }
            />
          )}
          <div className="mt-4">
            <CollectionEditActions
              collection={formData}
              contractAddress={formData?.contract_id}
              updatable={!!formData?.id}
              publicMintState={formData?.public_mint_state}
              handleUpdateCollection={handleUpdateCollection}
              handleSetPublicMintState={handleSetPublicMintState}
              handleAddNft={handleAddNft}
              handleCreateCollection={handleCreateCollection}
            />
          </div>
          {formData?.contract_id && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold">
                Collection<span>NFTs</span>.
              </h2>
              <div className="text-xs ml-0.5 mb-4">
                <span className="text-madGray">NFTs Minted:</span> {formData.nfts_count}/
                {formData.max_supply}
              </div>
              <div className="flex">
                <Button
                  colour="madPink"
                  hoverColour="madBlack"
                  href={`/collection/${formData.contract_id}`}
                >
                  View NFTs
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
export default EditCollectionPage
