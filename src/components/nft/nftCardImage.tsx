// @typed v1
import React from 'react'
import Link from '../common/link'
import { formatImageUrl } from '../../utils/utils'
import { NftComponent } from '../../types/containers'

const NftCardImageComponent = ({ nft, className }: NftComponent): JSX.Element => {
  return (
    <Link href={`/nft/${nft.token_id}/${nft.contract_id}`} className={className}>
      <div className="w-[300px] p-b-square relative overflow-hidden rounded-lg">
        <img
          alt={'NFT Image'}
          className="rounded top-0 left-1/2 transform -translate-x-1/2 object-center object-cover max-w-initial h-full m-auto absolute self-center"
          src={formatImageUrl(nft.image, 400, 400)}
        />
        <div className="absolute bg-white dark:bg-black text-madWhite bg-opacity-70 bottom-0 left-0 right-0 p-4">
          <span className="text-madGray max-w-sm name-ellipsis">#{nft.token_id}</span> {nft.name}
        </div>
      </div>
    </Link>
  )
}
export default NftCardImageComponent
