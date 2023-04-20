// @typed v1
import React from 'react'
import ContentCardComponent from '../common/contentCard'
import NftCollection from './nftCollection'
import Tags from '../form/tags'
import NftAttributeProperties from './nftAttributeProperties'
import NftAttributeLevels from './nftAttributeLevels'
import NftAttributeStats from './nftAttributeStats'
import { NftComponent } from '../../types/containers'

export default function NftContent({ nft }: NftComponent): JSX.Element {
  return (
    <>
      <ContentCardComponent
        className="rounded-b-none"
        title="Collection"
        titleIcon="fa6-solid:layer-group"
        collapsible={true}
      >
        <div className="py-4 pb-2">
          <NftCollection nft={nft} />
        </div>
      </ContentCardComponent>
      <ContentCardComponent
        className="rounded-t-none rounded-b-none pt-0"
        title="Description"
        titleIcon="fa6-solid:circle-info"
        collapsible={true}
      >
        <div className="py-4 pb-3" style={{ whiteSpace: 'pre-line' }}>
          {nft.description || '-'}
        </div>
      </ContentCardComponent>
      <ContentCardComponent
        className="rounded-t-none rounded-b-none pt-0"
        title="Tags"
        titleIcon="fa6-solid:tag"
        collapsible={true}
      >
        <div className="py-4 pb-2">
          <Tags
            tags={
              nft.tags.length
                ? nft.tags.map(
                    // @ts-ignore
                    ({ name }) => name.toString()
                  )
                : []
            }
          />
        </div>
      </ContentCardComponent>
      {nft?.properties?.length > 0 && (
        <ContentCardComponent
          className="rounded-t-none rounded-b-none pt-0"
          title="Properties"
          titleIcon="fa6-solid:list"
          collapsible={true}
        >
          <div className="py-4 pb-0">
            <NftAttributeProperties attributes={nft?.properties} />
          </div>
        </ContentCardComponent>
      )}
      {nft?.levels?.length > 0 && (
        <ContentCardComponent
          className="rounded-t-none rounded-b-none pt-0"
          title="Levels"
          titleIcon="fa6-solid:chart-line"
          collapsible={true}
        >
          <div className="py-4 pb-0">
            <NftAttributeLevels attributes={nft?.levels} />
          </div>
        </ContentCardComponent>
      )}
      {nft?.stats?.length > 0 && (
        <ContentCardComponent
          className="rounded-t-none pt-0"
          title="Stats"
          titleIcon="fa6-solid:chart-column"
          collapsible={true}
        >
          <div className="py-4 pb-0">
            <NftAttributeStats attributes={nft.stats} />
          </div>
        </ContentCardComponent>
      )}
    </>
  )
}
