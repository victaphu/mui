// @typed - MH
import React from 'react'
import { Icon } from '@iconify/react'
import { abbreviateNumber, formatDate, formatImageUrl, trimSentence } from '../../utils/utils'
import NftShare from '../nft/nftShare'
import Link from '../common/link'
import Price from '../common/price'

export default function TableRow({
  className = 'border-b border-b-zinc-600 text-sm',
  data,
  columns
}: {
  className?: string
  data
  columns
}): JSX.Element {
  return (
    <tr key={data.id} className={className}>
      {columns.map((col) => (
        <td key={data.id + col.name} className={col.classNameTd}>
          {col.type === 'image' ? (
            <div className="w-12 h-12">
              <img
                alt="Table row image"
                className="w-full h-full object-cover"
                src={formatImageUrl(data[col.name] || col.default)}
              />
            </div>
          ) : col.type === 'actions' && data ? (
            <NftShare nft={data} className={'text-madGray'} />
          ) : col.type === 'number' ? (
            <>{abbreviateNumber(data[col.name])}</>
          ) : col.type === 'currency' ? (
            <Price price={data[col.name]} priceExact={data[col.mapColumn]} />
          ) : col.type === 'date' ? (
            <>{formatDate(data[col.name])}</>
          ) : col.type === 'long_text' ? (
            <div className={col.classNameInner}>
              {data[col.name] ? trimSentence(data[col.name], 60, true) : col.default}
            </div>
          ) : col.type === 'link' ? (
            <>
              {data[col.name] ? (
                <Link href={data[col.name] || ''} external={true} className="hover:text-madPink">
                  {data[col.name]}
                </Link>
              ) : (
                <>{col.default}</>
              )}
            </>
          ) : col.type === 'boolean' ? (
            <Icon
              icon={`fa6-solid:${data[col.name] ? 'check' : 'xmark'}`}
              className={`text-${data[col.name] ? 'madGreen' : 'madGray'}`}
            />
          ) : col.type === 'map' ? (
            <>
              {data[col.name] && data[col.name].length
                ? data[col.name].map((a, i) => (
                    <span key={a.id} className="whitespace-nowrap">
                      {a[col.mapColumn]}
                      {i < data[col.name].length - 1 && data[col.name].length > i ? ', ' : ''}
                    </span>
                  ))
                : col.default}
            </>
          ) : col.type === 'length' ? (
            <span className={data[col.name] && data[col.name].length ? '' : 'text-madGray'}>
              {data[col.name] ? data[col.name].length : col.default}
            </span>
          ) : col.type === 'category_object' ? (
            <>
              {data[col.name] ? (
                <span className={`text-${data[col.name].color}`}>{data[col.name].name}</span>
              ) : (
                <>{col.default}</>
              )}
            </>
          ) : (
            <>{data[col.name] ? data[col.name] : col.default}</>
          )}
        </td>
      ))}
    </tr>
  )
}
