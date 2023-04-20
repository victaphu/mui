// @typed v1
import React from 'react'
import { Icon } from '@iconify/react'
import Link from '../common/link'
import Loader from '../common/loader'
import { formatImageUrl } from '../../utils/utils'
import NftActions from './nftActions'
import useNftOwner from '../../hooks/nftOwner'
import NftShare from './nftShare'
import useNftPrice from '../../hooks/nftPrice'
import Button from '../form/button'
import NftStats from './nftStats'
import Price from '../common/price'
import NftCounter from './nftCounter'
import UploadSingle from '../form/uploadSingle'
import Ping from '../common/ping'
import { CreateDropComponent, DataListItemComponent, NftComponent } from '../../types/containers'

const NftCardComponent = ({
  nft,
  view, // 'preview' | 'editable' | null
  className,
  startBurn,
  hideToggle,
  likeBoost,
  syncData,
  syncIpfs,
  nftActionState,
  setFileModalOpen,
  updateDropNft,
  hideViewButton,
  setListPreview,
  listIndex
}: NftComponent & CreateDropComponent & DataListItemComponent): JSX.Element => {
  const { floorPrice, floorPriceExact } = useNftPrice(nft)
  const { ownerBalance } = useNftOwner(nft)
  const nftColor = nft?.category_object?.color || nft?.collection?.category_object?.color

  return (
    <article
      className={`relative card-wrapper rounded-lg shadow-black/50 shadow-lg border-b-4 dark:bg-madCarbon bg-madWhite border-${nftColor} ${
        ownerBalance?.hidden ? 'opacity-40 hover:opacity-100' : ''
      } ${className}`}
    >
      {nftActionState === 'loading' && (
        <div className="animate-in fade-in zoom-in absolute rounded-lg top-0 left-0 right-0 bottom-0 dark:bg-madBlack bg-zinc-300 flex flex-col items-center justify-center z-top p-10">
          <Loader />
        </div>
      )}
      <>
        <div className="flex justify-between p-4 pb-0">
          <div className="w-3/5">
            <h3 className="font-bold text-left pr-1 name-ellipsis">
              {nft.token_id.toString().length < 6 && (
                <span className="text-madGray mr-1">#{nft.token_id}</span>
              )}{' '}
              {nft.name}
            </h3>
            <Link
              href={`/creator/${nft.creator.uri}`}
              className="text-sm font-normal leading-none text-left name-ellipsis"
            >
              <>
                <Icon icon="fa6-solid:user" className="text-madPink w-4 text-xs mr-1 shrink-0" />
                {view === 'preview' || view === 'editable'
                  ? nft.creator.public_name
                  : nft.public_name}
              </>
            </Link>
            {nft.collection && (
              <Link
                href={`/collection/${nft.collection.contract_id}`}
                className="text-sm text-left name-ellipsis"
              >
                <>
                  <Icon
                    icon="fa6-solid:layer-group"
                    className={`text-madPink text-xs mr-1 w-4 shrink-0`}
                  />
                  {nft.collection.name}
                </>
              </Link>
            )}
          </div>
          <NftActions
            nft={nft}
            view={view}
            startBurn={startBurn}
            setFileModalOpen={setFileModalOpen}
            hideToggle={hideToggle}
            syncData={syncData}
            syncIpfs={syncIpfs}
          />
        </div>
        <div className="w-full h-auto p-4 m-auto relative">
          {view === 'editable' ? (
            <UploadSingle
              className={`relative flex w-full flex-col rounded-lg justify-between p-5 pt-0 p-b-square items-end border-b-4 border-${nftColor}`}
              image={nft.image}
              saveFile={(a) => updateDropNft({ image: a })}
              deleteFile={() => updateDropNft({ image: null })}
            >
              {((nft?.collection?.token_standard === '1155' && nft?.total_supply) ||
                nft?.collection?.token_standard !== '1155') &&
                nft?.collection?.id &&
                nft?.name &&
                !nft?.image && <Ping text="Upload your NFT image" />}
            </UploadSingle>
          ) : (
            <div
              className={`relative flex w-full flex-col rounded-lg justify-between p-5 pt-0 p-b-square items-end border-b-4 border-${nftColor}`}
            >
              <Link
                href={`/nft/${nft?.token_id}/${nft?.contract_id}`}
                className="absolute flex top-0 left-0 right-0 h-full w-full"
              >
                <img
                  src={formatImageUrl(nft.image, 320, 320)}
                  alt={nft.name}
                  className="rounded top-0 left-1/2 transform -translate-x-1/2 object-center object-cover max-w-initial h-full m-auto absolute self-center"
                />
              </Link>
              <NftShare
                nft={nft}
                likeBoost={likeBoost}
                setListPreview={setListPreview}
                listIndex={listIndex}
                className={`${
                  view === 'preview' || view === 'editable' ? 'hidden' : ''
                } flex absolute bottom-5`}
              />
            </div>
          )}
        </div>
        <>
          <div className="flex w-full justify-center px-4 mb-2">
            <NftStats nft={nft} />
          </div>
          <div className="flex w-full items-center justify-between p-4 pt-2">
            <div className="pr-2">
              <Price
                price={view === 'preview' || view === 'editable' ? nft.price : floorPrice}
                priceExact={
                  view === 'preview' || view === 'editable'
                    ? (nft.price * 10e17).toString()
                    : floorPriceExact
                }
              />
            </div>
            <div className="ml-auto card-price flex justify-center rounded-full dark:bg-madBlack bg-zinc-300 py-2 px-4">
              <NftCounter nft={nft} />
            </div>
            {!hideViewButton && (
              <Button
                className="ml-2"
                colour="madPink"
                hoverColour="madBlack"
                href={`${
                  view === 'preview' || view === 'editable'
                    ? ''
                    : `/nft/${nft?.token_id}/${nft.collection.contract_id}`
                }`}
              >
                <span className="whitespace-nowrap">View</span>
              </Button>
            )}
          </div>
        </>
      </>
    </article>
  )
}
export default NftCardComponent
