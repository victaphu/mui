// @typed v1
import React from 'react'
import Copy from '../common/copy'
import Link from '../common/link'
import { abbreviateNumber, formatTokenUri, trimAddress } from '../../utils/utils'
import { NftComponent } from '../../types/containers'

export default function NftCollection({ nft, className }: NftComponent): JSX.Element {
  return (
    <div className={`text-sm ${className}`}>
      <p className="flex items-center justify-between whitespace-nowrap">
        Name: <span className="text-madPink ml-2">{nft.collection.name}</span>
      </p>
      <p className="flex items-center justify-between whitespace-nowrap">
        Symbol: <span className="text-madPink ml-2">{nft.collection.symbol}</span>
      </p>
      <p className="flex items-center justify-between whitespace-nowrap">
        Token Standard: <span className="text-madPink ml-2">{nft.collection.token_standard}</span>
      </p>
      <p className="flex items-center justify-between whitespace-nowrap">
        Contract Address:{' '}
        <span title={nft.collection.contract_id} className="text-madPink name-ellipsis ml-2">
          <Copy
            text={trimAddress(nft.collection.contract_id)}
            copy={nft.collection.contract_id}
            success={'Collection address copied'}
          />
        </span>
      </p>
      <p className="flex items-center justify-between">
        Token supply / Collection supply:{' '}
        <span className="text-madPink">
          {abbreviateNumber(nft.collection.current_supply)} /{' '}
          {abbreviateNumber(nft.collection.max_supply)}
        </span>
      </p>
      <p className="flex items-center justify-between whitespace-nowrap">
        Base URI:{' '}
        <span className="text-madPink inline name-ellipsis ml-2">
          <Copy text={nft.collection.base_uri} success={'Base URI copied'} />
        </span>
      </p>
      {nft.unhatched && nft.uri ? (
        <p className="flex items-center justify-between whitespace-nowrap">
          Token metadata:{' '}
          <Link
            external={true}
            className="text-madPink inline"
            href={formatTokenUri(nft.uri, nft.collection.contract_id)}
          >
            {trimAddress(nft.uri)}
          </Link>
        </p>
      ) : !nft.unhatched ? (
        <p className="flex items-center justify-between whitespace-nowrap">
          Token metadata: <span className="text-madPink">Unhatched</span>
        </p>
      ) : null}
    </div>
  )
}
