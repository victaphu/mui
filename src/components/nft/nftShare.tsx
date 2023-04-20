// @typed v1
import { Icon } from '@iconify/react'
import React from 'react'
import useNftOwner from '../../hooks/nftOwner'
import Share from '../common/share'
import { Tooltip } from '../toolTip/toolTip'
import Loader from '../common/loader'
import { DataListItemComponent, NftComponent } from '../../types/containers'

export default function NftShare({
  nft,
  className,
  likeBoost,
  nftActionState,
  setListPreview,
  listIndex
}: NftComponent & DataListItemComponent): JSX.Element {
  const { ownerBalance, ownerOrder } = useNftOwner(nft)
  const btnClasses =
    'flex items-center justify-center w-8 h-8 mr-2 dark:bg-madBlack bg-madWhite rounded-full shadow-md shadow-black/50 hover:text-madPink text-sm duration-300'
  return (
    <div className={className}>
      {setListPreview && (
        <Tooltip
          button={
            <button
              className={btnClasses}
              onClick={() => {
                setListPreview(listIndex)
              }}
            >
              <Icon
                icon="fa6-solid:eye"
                className="fa-regular leading-none fa-heart m-1 text-sm hover:text-madPink duration-300"
              />
            </button>
          }
        >
          <div className="text-center">Preview NFT data</div>
        </Tooltip>
      )}
      {!ownerBalance && !ownerOrder && (
        <>
          <Tooltip
            button={
              <button
                className={btnClasses}
                onClick={() => {
                  likeBoost(1)
                }}
              >
                {nftActionState === 'loading' ? (
                  <Loader className="m-0" imgClassName="w-4 h-4" />
                ) : (
                  <Icon icon="fa6-solid:heart" />
                )}
              </button>
            }
          >
            <div className="text-center">
              Like this NFT <div className="text-madPink">+1</div>
            </div>
          </Tooltip>
          <Tooltip
            button={
              <button
                onClick={() => {
                  likeBoost(10)
                }}
                type="button"
                className={btnClasses}
              >
                {nftActionState === 'loading' ? (
                  <Loader className="m-0" imgClassName="w-4 h-4" />
                ) : (
                  <Icon icon="fa6-solid:rocket" />
                )}
              </button>
            }
          >
            <div className="text-center">
              Boost this NFT <div className="text-madPink">+10</div>
            </div>
          </Tooltip>
        </>
      )}
      {nft?.token_id && nft?.contract_id && (
        <Tooltip
          button={
            <Share
              model_id={nft?.id}
              model_type={'Nft'}
              url={`/nft/${nft?.token_id}/${nft?.contract_id}`}
              className="ml-0"
            />
          }
        >
          <div className="text-center">Share this NFT</div>
        </Tooltip>
      )}
    </div>
  )
}
