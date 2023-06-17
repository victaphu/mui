// @typed v1
import React from 'react'
import { Icon } from '@iconify/react'
import { Tooltip } from '../toolTip/toolTip'
import useNftOwner from '../../hooks/nftOwner'
import useNftTradeState from '../../hooks/nftTradeState'
import Button from '../form/button'
import { NftComponent } from '../../types/containers'
import Dropdown from '../form/dropdown'
import { useRouter } from 'next/router'

export default function NftActions({
  nft,
  view,
  className = 'flex pl-2',
  hideToggle,
  syncData,
  syncIpfs,
  startBurn,
  setFileModalOpen,
  // allowBurn = true,
  allowCopy = true
}: NftComponent & { allowBurn?: boolean; allowCopy?: boolean }): JSX.Element {
  const { ownerBalance } = useNftOwner(nft)
  const { buttonText } = useNftTradeState(nft)
  const router = useRouter()
  const category = view === 'preview' ? nft.collection.category_object : nft.category_object
  const classes =
    'flex items-center justify-center w-10 h-10 bg-madWhite dark:bg-madBlack border border-madGray text-madGray rounded-full -mr-3'

  return (
    <div className={className}>
      {nft.files && nft.files.length ? (
        <Tooltip
          placement="bottom-6"
          button={
            <span className={classes + ' cursor-pointer'} onClick={() => setFileModalOpen(true)}>
              <Icon icon="fa6-solid:play" />
            </span>
          }
        >
          <div className="whitespace-nowrap">Additional NFT Files</div>
        </Tooltip>
      ) : null}
      {nft?.external_url && (
        <Tooltip
          placement="bottom-6"
          button={
            <span className={classes}>
              <Icon icon="fa6-solid:arrow-up-right-from-square" />
            </span>
          }
        >
          <div className="whitespace-nowrap text-center">External content: </div>
          <Button
            colour="madPink"
            hoverColour="madBlack"
            className="text-2xs m-auto justify-center mt-1 whitespace-nowrap"
            external={true}
            href={nft.external_url}
          >
            Click to view
          </Button>
        </Tooltip>
      )}
      {!nft.unhatched && (
        <Tooltip
          placement="bottom-6"
          button={
            <span className={classes}>
              <Icon icon="fa6-solid:egg" />
            </span>
          }
        >
          <div className="w-32 text-center">
            This NFT is unhatched, keep watch for when the creator unlocks the metadata
          </div>
        </Tooltip>
      )}
      {nft?.orders && nft?.orders[0] && (
        <Tooltip
          placement="bottom-6"
          button={
            <span className={classes}>
              <Icon icon={`fa6-solid:${nft.orders[0].sale_type_icon}`} />
            </span>
          }
        >
          <div className="w-28 text-center">
            This NFT is available to <strong>{buttonText}</strong>
          </div>
        </Tooltip>
      )}
      {category && (
        <Tooltip
          placement="bottom-6"
          button={
            <span className={classes.replace('madGray', category.color)}>
              <Icon icon={`fa6-solid:${category.icon}`} className={`text-${category.color}`} />
            </span>
          }
        >
          <span className={`text-${category.color}`}>
            <span className="whitespace-nowrap">
              <strong>{category.name}</strong> - {nft.collection.token_standard} Standard
            </span>
          </span>
        </Tooltip>
      )}

      <div className="ml-3">
        <Dropdown
          className={`overflow-hidden dark:bg-transparent dark:border-transparent light:bg-transparent light::border-transparent`}
          dropdownClassName="dropdown-menu-right"
          name="dashboard-select"
          selectOptions={[
            {
              name: 'View collection',
              id: 'view-collection',
              callback: () => {
                router.push(`/collection/${nft?.collection?.contract_id}`)
              }
            },
            {
              name: `${ownerBalance?.hidden ? 'Unhide' : 'Hide'} NFT`,
              id: 'hide-toggle',
              hidden: !ownerBalance,
              callback: hideToggle
            },
            {
              id: 'spacer-1',
              name: 'spacer',
              spacer: true
            },
            {
              name: 'Copy NFT',
              id: 'copy-nft',
              hidden: !!(!ownerBalance || view === 'preview') && allowCopy,
              callback: () => {
                router.push(`/create?copy=${nft?.id}`)
              }
            },
            {
              name: 'Burn NFT',
              id: 'burn-nft',
              hidden: true,
              // hidden: !!(!ownerBalance || view === 'preview') && allowBurn,
              callback: startBurn
            },
            {
              name: 'Sync IPFS',
              id: 'sync-ipfs',
              hidden: view === 'preview',
              callback: syncIpfs
            },
            {
              name: 'Sync Balances',
              id: 'sync-balances',
              hidden: view === 'preview',
              callback: syncData
            }
          ]}
          returnObject={true}
          nullable={false}
          onChange={(a) => {
            if (a.callback) {
              a.callback()
            } else {
              router.push(a.id.toString())
            }
          }}
          placeholder={' '}
          placeholderTemplate={() => (
            <Icon icon="fa6-solid:ellipsis-vertical" className="text-xl" />
          )}
        />
      </div>
    </div>
  )
}
