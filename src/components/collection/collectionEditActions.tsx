// @typed - MH
import React from 'react'
import { Icon } from '@iconify/react'
import Button from '../form/button'
import Link from '../common/link'
import { Collection } from '../../types/collection'

export default function CollectionEditActions({
  collection,
  contractAddress,
  updatable,
  publicMintState,
  handleUpdateCollection,
  handleSetPublicMintState,
  handleAddNft,
  handleCreateCollection,
  className = 'flex gap-2'
}: {
  collection: Collection
  contractAddress: string
  updatable: boolean
  publicMintState: boolean
  handleUpdateCollection: () => void
  handleSetPublicMintState: () => void
  handleAddNft: () => void
  handleCreateCollection: () => void
  className?: string
}): JSX.Element {
  return (
    <div className={className}>
      {updatable ? (
        <>
          <Button onClick={handleUpdateCollection} colour="madGray" hoverColour="madBlack">
            <Icon icon="fa-solid:save" className="mr-2" />
            <span>{updatable ? 'Update content' : 'Save'}</span>
          </Button>
          <Link
            external={true}
            href={`/collection/${contractAddress}`}
            className="relative flex items-center ring-1 uppercase rounded-full py-1.5 px-3 tracking-[-0.08em] duration-300 ring-madGray text-madGray hover:bg-madGray dark:hover:text-madBlack hover:text-madBlack"
          >
            <Icon icon="fa6-solid:eye" className="mr-2" />
            <span>View</span>
          </Link>
          {collection.base_uri !== 'mad://' && (
            <Button
              onClick={handleSetPublicMintState}
              colour={publicMintState ? 'madPink' : 'madBlue'}
              hoverColour="madBlack"
            >
              <Icon icon="fa6-solid:rocket" className="mr-2" />
              <span>{publicMintState ? 'Close public minting' : 'Open public minting'}</span>
            </Button>
          )}
          {collection.base_uri === 'mad://' && (
            <Button colour="madBlue" hoverColour="madBlack" onClick={handleAddNft}>
              <Icon icon="fa6-solid:fire-flame-curved" className="text-sm mr-2" />
              <span>Mint NFT</span>
            </Button>
          )}
        </>
      ) : (
        <Button onClick={handleCreateCollection} colour="madBlue" hoverColour="madBlack">
          <Icon icon="fa6-solid:rocket" className="mr-2" />
          <span>Deploy Contract</span>
        </Button>
      )}
    </div>
  )
}
