// @typed v1
import React, { useEffect, useState } from 'react'
import NftCardComponent from './nftCard'
import DropdownCollection from '../form/dropdownCollection'
import ContentCardComponent from '../common/contentCard'
import Button from '../form/button'
import { Icon } from '@iconify/react'
import NftCollection from './nftCollection'
import NftAttributeProperties from './nftAttributeProperties'
import NftAttributeLevels from './nftAttributeLevels'
import NftAttributeStats from './nftAttributeStats'
import Input from '../form/input'
import Tags from '../form/tags'
import AttributesContainer from '../../containers/attributes'
import UploadMulti from '../form/uploadMulti'
import NftContainer from '../../containers/nft'
import { ToolTipVideo } from '../toolTip/toolTipVideo'
import { Tooltip } from '../toolTip/toolTip'
import Ping from '../common/ping'
import Link from '../common/link'
import { CreateDropComponent } from '../../types/containers'

export default function NftCreate({
  createDropData,
  createDrop,
  updateDropNft,
  updateDropCollection,
  className
}: CreateDropComponent): JSX.Element {
  const [pingStep, setPingStep] = useState<number>(null)
  useEffect(() => {
    if (!createDropData.nft?.collection?.id) {
      setPingStep(1)
    } else if (
      createDropData.nft?.collection?.token_standard === '1155' &&
      !createDropData.nft?.total_supply
    ) {
      setPingStep(2)
    } else if (createDropData.nft?.collection?.id && !createDropData.nft?.name) {
      setPingStep(3)
    } else if (
      ((createDropData.nft?.collection?.token_standard === '1155' &&
        createDropData.nft?.total_supply) ||
        createDropData.nft?.collection?.token_standard !== '1155') &&
      createDropData.nft?.collection?.id &&
      createDropData.nft?.name &&
      !createDropData.nft?.image
    ) {
      // NOTE: this step is manually repeated in NftCardComponent for the image upload
      setPingStep(4)
    } else if (createDropData.nft?.collection?.id) {
      setPingStep(10)
    }
  }, [createDropData])
  return (
    <>
      <div className={`flex flex-col md:flex-row gap-4 ${className}`}>
        {createDropData.nft && (
          <div className="w-full md:w-1/2 mb-auto md:max-w-[400px]">
            <NftContainer
              Component={NftCardComponent}
              view="editable"
              nft={createDropData.nft}
              updateDropNft={updateDropNft}
            />
            {pingStep === 10 && (
              <>
                <div className="p-4 py-4 text-sm text-center text-madGray">
                  Make sure you have added all your data before minting your NFT. Head over to the{' '}
                  <Link href="/academy" className="inline text-madPink whitespace-nowrap">
                    <>
                      <Icon icon="fa6-solid:graduation-cap" className="mr-1" />
                      Academy
                    </>
                  </Link>{' '}
                  for tips on how to create your collection
                </div>
                <div className="flex justify-between mx-auto">
                  {createDropData.nft?.collection?.max_supply -
                    createDropData.nft?.collection?.current_supply ===
                  0 ? (
                    <div className="border border-zinc-800 bg-zinc-800 text-madWhite text-center text-sm mx-0 my-4 p-4 rounded">
                      <span className="text-madPink font-bold">MAX supply reached.</span> You have
                      minted the maximum number of NFTS with this contract and cannot mint any more.
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        createDrop()
                      }}
                      colour="madPink"
                      hoverColour="madBlack"
                      className="px-10 py-4 text-2xl w-full justify-center"
                    >
                      <>Mint now</>
                      <Icon
                        icon="fa6-solid:fire-flame-curved"
                        className="text-xl ml-2 animate-pulse"
                      />
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
        <div className="w-full">
          <ContentCardComponent
            className="rounded-b-none"
            title="Collection"
            titleIcon="fa6-solid:layer-group"
            collapsible={true}
          >
            <div className="py-3 pb-0">
              {pingStep === 1 && (
                <div className="relative">
                  <Ping text="Select your collection" />
                </div>
              )}
              <DropdownCollection
                className={'border-transparent rounded-md'}
                dropDownClassName="dropdown-menu-right"
                onChange={(obj) => {
                  updateDropCollection(obj)
                }}
                params={{ public_mint: false }}
                collectionId={createDropData.nft?.collection?.id}
                creatorAddress={createDropData.profile?.creator_address}
              />
              {createDropData.nft?.collection?.token_standard === '1155' && (
                <>
                  {pingStep === 2 && (
                    <div className="relative">
                      <Ping text="Set your NFTs supply" />
                    </div>
                  )}
                  {createDropData.nft?.collection?.max_supply -
                    createDropData.nft?.collection?.current_supply ===
                  0 ? (
                    <div className="border border-zinc-800 bg-zinc-800 text-madWhite text-center text-sm mx-0 my-4 p-4 rounded">
                      <span className="text-madPink font-bold">MAX supply reached.</span> You have
                      minted the maximum number of NFTS with this contract and cannot mint any more.
                    </div>
                  ) : (
                    <div className="w-full flex items-center mb-2 text-madGray">
                      <Input
                        min={0}
                        step={1}
                        max={
                          createDropData.nft?.collection?.max_supply -
                          createDropData.nft?.collection?.current_supply
                        }
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        wrapperClassName="grow"
                        className="bg-transparent focus:outline-none border-none text-right rounded-md"
                        value={createDropData.nft?.total_supply || ''}
                        onChange={(value) =>
                          updateDropNft({
                            total_supply:
                              +value < 0
                                ? 0
                                : +value >
                                  createDropData.nft?.collection?.max_supply -
                                    createDropData.nft?.collection?.current_supply
                                ? createDropData.nft?.collection?.max_supply -
                                  createDropData.nft?.collection?.current_supply
                                : value
                          })
                        }
                      />{' '}
                      <span className="mx-2">/ </span>
                      {createDropData.nft?.collection?.max_supply -
                        createDropData.nft?.collection?.current_supply}
                    </div>
                  )}
                </>
              )}
              {createDropData.nft.collection?.id && <NftCollection nft={createDropData.nft} />}
            </div>
          </ContentCardComponent>
          <ContentCardComponent
            className="rounded-t-none rounded-b-none pt-0"
            title="Description"
            titleIcon="fa6-solid:pencil"
            collapsible={true}
          >
            <div className="py-3 pb-0 -mb-1">
              <div className="relative">
                {pingStep === 3 && <Ping text="Give your NFT a name" />}
                <Input
                  max={255}
                  name="name"
                  type="text"
                  placeholder="NFT Name..."
                  className="border-transparent rounded-md pr-10"
                  countClassName="mb-1 opacity-40"
                  value={createDropData.nft?.name || ''}
                  required={true}
                  onChange={(val) => updateDropNft({ name: val })}
                />
                <ToolTipVideo
                  className="ml-2 absolute right-3 top-2"
                  placement="right-4"
                  intro="Title your NFT so its easy for users to find."
                  title="Naming NFTs"
                  src="https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/videos.clips/Naming+NFTs.mp4"
                />
              </div>
              <div className="relative">
                <Input
                  max={2000}
                  name="symbol"
                  type="textarea"
                  placeholder="NFT description..."
                  className="border-transparent rounded-md mb-0 pr-6"
                  countClassName="mb-1 opacity-40"
                  value={createDropData.nft?.description}
                  onChange={(val) => updateDropNft({ description: val })}
                />
                <ToolTipVideo
                  className="ml-2 absolute right-3 top-2"
                  placement="right-4"
                  intro="Give you NFT an engaging description and sell your NFT to your potential buyers."
                  title="Your NFT Description"
                  src="https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/videos.clips/Descriptions.mp4"
                />
              </div>
              <div className="relative">
                <Input
                  name="external_url"
                  type="text"
                  placeholder="https://external.link"
                  value={createDropData.nft?.external_url || ''}
                  required={false}
                  className="border-transparent rounded-md mb-2 pr-10"
                  onChange={(value) => updateDropNft({ external_url: value })}
                />
                <div className="ml-2 absolute right-3 top-2">
                  <Tooltip
                    placement="right-4"
                    button={<Icon icon="fa:question-circle" className="ml-2" />}
                  >
                    <div className="w-52">
                      Add an optional external URL for your NFT. This is displayed on your NFT for
                      users to click through to additional public content
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>
          </ContentCardComponent>
          <ContentCardComponent
            className="rounded-t-none rounded-b-none pt-0"
            title="Tags"
            titleIcon="fa6-solid:tag"
            collapsible={true}
            collapsedDefault={true}
            titleContent={
              <ToolTipVideo
                placement="top"
                intro="Learn how to tag your NFT, and make your NFT more discoverable by assigning appropriate tags"
                title="Tagging your NFT"
                src="https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/videos.clips/Tagging.mp4"
              />
            }
          >
            <div className="py-3 pb-1">
              <Tags
                tags={
                  createDropData.nft.tags.length
                    ? createDropData.nft.tags.toString().split(',')
                    : []
                }
                updateTags={(tags) => updateDropNft({ tags: tags.join(',') })}
              />
            </div>
          </ContentCardComponent>
          <ContentCardComponent
            className="rounded-t-none rounded-b-none pt-0"
            title="Additional Files"
            titleIcon="fa6-solid:image"
            collapsible={true}
            collapsedDefault={true}
            titleContent={
              <ToolTipVideo
                placement="top"
                intro="Upload additional files, videos, high res imagery and / or audio."
                title="Uploading Media"
                src="https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/videos.clips/Uploading+Media.mp4"
              />
            }
          >
            <div className="py-3 pb-0">
              <UploadMulti
                className="relative"
                placeholderImage={createDropData.nft.image}
                files={createDropData.nft.files}
                saveFiles={(assets) => {
                  updateDropNft({ files: assets })
                }}
                deleteFile={(assets) => {
                  updateDropNft({ files: assets })
                }}
              />
            </div>
          </ContentCardComponent>
          <ContentCardComponent
            className="rounded-t-none rounded-b-none pt-0"
            title="Properties"
            titleIcon="fa6-solid:list"
            collapsible={true}
            collapsedDefault={true}
            titleContent={
              <ToolTipVideo
                placement="top"
                intro="Learn how to add Properties; textual attributes that are displayed as rounded rectangles."
                title="NFT Properties"
                src="https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/videos.clips/Properties.mp4"
              />
            }
          >
            <div className="py-3 pb-1">
              <AttributesContainer
                Component={NftAttributeProperties}
                attributes={createDropData.nft?.properties}
                attributeType="properties"
                attributeTypeLabel="Property"
                onSave={(properties) => updateDropNft(properties)}
              />
            </div>
          </ContentCardComponent>
          <ContentCardComponent
            className="rounded-t-none rounded-b-none pt-0"
            title="Levels"
            titleIcon="fa6-solid:chart-line"
            collapsible={true}
            collapsedDefault={true}
            titleContent={
              <ToolTipVideo
                placement="top"
                intro="Learn how to add Levels; numerical attributes that are displayed as progress bars."
                title="NFT Levels"
                src="https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/videos.clips/Levels.mp4"
              />
            }
          >
            <div className="py-3 pb-1">
              <AttributesContainer
                Component={NftAttributeLevels}
                attributes={createDropData.nft?.levels}
                attributeType="levels"
                attributeTypeLabel="Level"
                onSave={(levels) => updateDropNft(levels)}
              />
            </div>
          </ContentCardComponent>
          <ContentCardComponent
            className="rounded-t-none pt-0"
            title="Stats"
            titleIcon="fa6-solid:chart-column"
            collapsible={true}
            collapsedDefault={true}
            titleContent={
              <ToolTipVideo
                placement="top"
                intro="Learn how to add stats to your NFTs; textual attributes that are displayed as circles."
                title="NFT Stats"
                src="https://s3.eu-west-2.amazonaws.com/madnft.io.cdn/videos.clips/Stats.mp4"
              />
            }
          >
            <div className="py-3 pb-1">
              <AttributesContainer
                Component={NftAttributeStats}
                attributes={createDropData.nft?.stats}
                attributeType="stats"
                attributeTypeLabel="Stat"
                onSave={(stats) => updateDropNft(stats)}
              />
            </div>
          </ContentCardComponent>
        </div>
      </div>
    </>
  )
}
