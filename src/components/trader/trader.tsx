import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from '@iconify/react'
import { Nft } from '../../types/nft'
import { tradeTypeAdded, tradeAssetAdded } from '../../store/trader'
import { useRouter } from 'next/router'
import useNftOwner from '../../hooks/nftOwner'
import useNftPrice from '../../hooks/nftPrice'
import useNftTradeState from '../../hooks/nftTradeState'
import { abbreviateNumber, trimAddress } from '../../utils/utils'
import Info from '../form/info'
import Button from '../form/button'
import useTimer from '../../hooks/timer'
import ContentCardComponent from '../common/contentCard'
import Price from '../common/price'
import { Tooltip } from '../toolTip/toolTip'
import Link from '../common/link'
import TimerComponent from '../common/timer'
import { compareAndRequestNetworkChange, findNetworkById } from '../../utils/network'
import { getCurrentNetwork } from '../../store/web3'
import { useAccount } from 'wagmi'

export default function Trader({
  nft,
  view,
  allowListing // represents single page view, we allow 'list for sale' tools on single page only
}: {
  nft: Nft
  view?: 'preview' | false
  allowListing?: boolean
}): JSX.Element {
  const dispatch = useDispatch()
  const router = useRouter()
  const { address: account, connector } = useAccount()
  const { ownerBalance, ownerOrder } = useNftOwner(nft)
  const { floorPrice, floorPriceExact, symbol } = useNftPrice(nft)
  const { inAuction, buyable, biddable, buttonText, latestOpenOrder } = useNftTradeState(nft)
  const timer = useTimer()
  const network = useSelector(getCurrentNetwork)

  useEffect(() => {
    if (!timer.endTime && latestOpenOrder?.end_time) {
      timer.setEndTime(latestOpenOrder?.end_time)
    }
  }, [nft, timer, latestOpenOrder])

  const onSaleBtnClick = async (type: string, asset) => {
    if (type === 'navigate') {
      router.push(`/nft/${nft.token_id}/${nft.contract_id}`).then()
    } else {
      const result = await compareAndRequestNetworkChange(
        // library?.provider,
        await connector.getProvider(),
        dispatch,
        network,
        findNetworkById(nft?.collection?.chain)
      )
      if (result === false) {
        dispatch(tradeAssetAdded({ ...asset, ...nft }))
        dispatch(tradeTypeAdded(type))
      }
    }
  }

  const onClaimAuction = async (asset) => {
    const result = await compareAndRequestNetworkChange(
      // library?.provider,
      await connector.getProvider(),
      dispatch,
      network,
      findNetworkById(nft?.collection?.chain)
    )
    if (result === false) {
      dispatch(tradeAssetAdded({ ...asset, ...nft }))
      dispatch(tradeTypeAdded('claimAuction'))
    }
  }

  return (
    <>
      <ContentCardComponent
        className="rounded-b-none mt-6"
        title="Trade"
        titleIcon="fa6-solid:wallet"
        collapsible={true}
      >
        <div className="py-4 pb-2">
          <div className="flex flex-wrap flex-row items-center w-full">
            <div className="grid sm:grid-cols-2 gap-4 items-end w-full border-gray-700 border-t pt-3">
              <div className="text-xl lg:text-2xl font-normal whitespace-nowrap dark:text-white">
                {nft.collection?.token_standard === '1155' && latestOpenOrder ? (
                  <>
                    {abbreviateNumber(latestOpenOrder?.start_price) || 0}{' '}
                    <span className="dark:text-white text-madBlack">{symbol}</span>
                    {allowListing && (
                      <span className="ml-2 text-sm text-madGray">
                        QTY: {latestOpenOrder ? abbreviateNumber(latestOpenOrder.quantity) : ''}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <Price price={floorPrice} priceExact={floorPriceExact} />
                  </>
                )}
              </div>
              {buyable || biddable ? (
                <p className={`text-sm font-normal whitespace-nowrap flex items-center mb-0.5`}>
                  <Icon icon="fa6-solid:stopwatch" className="mr-1.5" />
                  Ends:{' '}
                  {latestOpenOrder.end_time * 1000 < new Date().getTime() && latestOpenOrder.bidder
                    ? 'Sold'
                    : timer.countdown || 'Unlisted'}
                </p>
              ) : (
                <p className={`text-sm font-normal whitespace-nowrap flex items-center mb-0.5`}>
                  <Icon icon="fa6-solid:stopwatch" className="mr-1.5" />
                  Unlisted
                </p>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4 w-full items-center">
              {ownerBalance &&
                allowListing &&
                parseInt(ownerBalance?.amount) > 0 &&
                view !== 'preview' && (
                  <Button
                    onClick={() => onSaleBtnClick('sell', {})}
                    colour="madPink"
                    hoverColour="madBlack"
                    className="rounded-md justify-center mt-4"
                  >
                    <Icon icon="fa6-solid:wallet" className="mr-2" />
                    <span className="whitespace-nowrap">List for sale</span>
                  </Button>
                )}
              {nft.collection?.token_standard === '721' &&
                timer.countdown &&
                timer.countdown !== 'Closed' &&
                allowListing &&
                !ownerOrder &&
                (buyable || biddable) && (
                  <Button
                    onClick={() => onSaleBtnClick(buyable ? 'buy' : 'bid', latestOpenOrder)}
                    colour="madPink"
                    hoverColour="madBlack"
                    className="rounded-md justify-center mt-4"
                  >
                    {latestOpenOrder?.sale_type_icon && (
                      <Icon icon={latestOpenOrder?.sale_type_icon} className="mr-2" />
                    )}
                    <span className="whitespace-nowrap">{buttonText}</span>
                  </Button>
                )}
              {nft.collection?.token_standard === '1155' &&
                timer.countdown &&
                timer.countdown !== 'Closed' &&
                allowListing &&
                !ownerOrder &&
                (buyable || biddable) && (
                  <>
                    <Button
                      onClick={() => onSaleBtnClick(buyable ? 'buy' : 'bid', latestOpenOrder)}
                      colour="madPink"
                      hoverColour="madBlack"
                      className="rounded-md justify-center mt-4"
                    >
                      {latestOpenOrder?.sale_type_icon && (
                        <Icon icon={latestOpenOrder?.sale_type_icon} className="mr-2" />
                      )}
                      <span className="whitespace-nowrap">{buttonText}</span>
                    </Button>
                  </>
                )}
              {!allowListing && view !== 'preview' && (
                <Button
                  href={`/nft/${nft.id}/${nft.contract_id}`}
                  colour="madPink"
                  hoverColour="madBlack"
                  className="rounded-md justify-center mt-4"
                >
                  <span className="whitespace-nowrap">View</span>
                </Button>
              )}
              {nft.collection?.token_standard === '721' &&
                ownerOrder &&
                allowListing &&
                !latestOpenOrder.bidder && (
                  <Button
                    onClick={() => {
                      onSaleBtnClick('delist', latestOpenOrder)
                    }}
                    colour="madGray"
                    hoverColour="madBlack"
                    className="rounded-md justify-center mt-4"
                  >
                    <Icon icon={latestOpenOrder?.sale_type_icon} className="mr-2" />
                    <span className="whitespace-nowrap">Delist</span>
                  </Button>
                )}
              {nft.collection?.token_standard === '1155' &&
                ownerOrder &&
                allowListing &&
                !latestOpenOrder.bidder && (
                  <Button
                    onClick={() => {
                      onSaleBtnClick('delist', latestOpenOrder)
                    }}
                    colour="madGray"
                    hoverColour="madBlack"
                    className="rounded-md justify-center mt-4"
                  >
                    <Icon icon={latestOpenOrder?.sale_type_icon} className="mr-2" />
                    <span className="whitespace-nowrap">Delist</span>
                  </Button>
                )}
              {!allowListing && nft.collection?.token_standard === '1155' && latestOpenOrder && (
                <span className="mt-4 text-sm text-madGray">
                  QTY: {latestOpenOrder ? abbreviateNumber(latestOpenOrder.quantity) : ''}
                </span>
              )}
            </div>
            {inAuction && allowListing && (
              <div className="mt-5 p-4 pt-3 rounded border border-madGray">
                {timer.countdown === 'Closed' && latestOpenOrder.bidder && (
                  <Info
                    className="text-sm dark:text-madWhite font-bold"
                    info="This item is sold and awaiting the winner to claim their assets"
                  />
                )}
                {timer.countdown === 'Closed' && !latestOpenOrder.bidder && (
                  <Info
                    className="text-sm dark:text-madWhite font-bold"
                    info="This item is closed without any bids, you must manually de-list it from the marketplace and relist it for a new auction"
                  />
                )}
                {timer.countdown !== 'Closed' && !latestOpenOrder.bidder && (
                  <Info
                    className="text-sm text-madGray"
                    info="Your item is currently listed for auction on the marketplace and awaiting bids."
                  />
                )}
                {timer.countdown !== 'Closed' && latestOpenOrder.bidder && (
                  <Info
                    className="text-sm text-madGray"
                    info={
                      timer.countdown === 'Closed'
                        ? 'Your item is sold and awaiting claim from the auction winner. You have successfully sold this NFT and no more action is required.'
                        : 'Your item is up for auction and has open offers. You must wait for the auction to end before you receive your payment.'
                    }
                  />
                )}
              </div>
            )}
            {biddable && (
              <span className="mt-4">
                {account && latestOpenOrder?.bidder?.toLowerCase() === account?.toLowerCase() ? (
                  <span>
                    {latestOpenOrder?.end_time * 1000 < new Date().getTime()
                      ? 'You have won this auction'
                      : 'You are the top bidder'}
                    <Icon icon="fa6-solid:check" className="ml-2 text-madGreen" />
                    {latestOpenOrder?.end_time * 1000 < new Date().getTime() && (
                      <>
                        <div className="mt-5 p-4 pt-3 rounded border border-madGray">
                          <Info
                            className="text-sm text-madGray"
                            info="Congratulations! You have won this auction, you must now transfer your nft from the marketplace to your wallet."
                          />
                        </div>
                        <Button
                          onClick={() => {
                            onClaimAuction(latestOpenOrder)
                          }}
                          colour="madPink"
                          hoverColour="madBlack"
                          className="mt-4"
                        >
                          <Icon icon="fa6-solid:check" className="mr-2" />
                          <span className="whitespace-nowrap">Claim your NFT</span>
                        </Button>
                      </>
                    )}
                  </span>
                ) : latestOpenOrder ? (
                  <span className="whitespace-nowrap flex gap-2">
                    <span className="text-madGray">Top bidder: </span>
                    {latestOpenOrder?.bidder ? (
                      <Link href={`/creator/` + latestOpenOrder?.bidder} className="text-madPink">
                        <>
                          @
                          {latestOpenOrder?.bidder_public_name ||
                            trimAddress(latestOpenOrder.bidder)}
                        </>
                      </Link>
                    ) : (
                      <>No bids</>
                    )}
                  </span>
                ) : (
                  <span className="whitespace-nowrap flex gap-2">
                    <span className="text-madGray">Top bidder: </span>
                    {latestOpenOrder?.bidder ? (
                      <Link href={`/creator/` + latestOpenOrder?.bidder} className="text-madPink">
                        <>
                          @
                          {latestOpenOrder?.bidder_public_name ||
                            trimAddress(latestOpenOrder.bidder)}
                        </>
                      </Link>
                    ) : (
                      <>No bids</>
                    )}
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
      </ContentCardComponent>
      {allowListing && nft.collection?.token_standard === '1155' && nft.orders[1] && (
        <>
          <ContentCardComponent
            className="rounded-t-none pt-0"
            title="Listings"
            titleIcon="fa6-solid:list"
            collapsible={true}
            collapsedDefault={false}
          >
            <div className="max-h-[240px] overflow-y-auto mt-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-madGray">
                    <th className="font-light text-left p-2 pl-0">Price</th>
                    <th className="font-light text-left p-2">Qty</th>
                    <th className="font-light text-left p-2">Expiration</th>
                    <th className="font-light text-left p-2">Seller</th>
                    <th className="font-light text-left p-2">Bidder</th>
                    <th className="font-light text-left p-2" />
                  </tr>
                </thead>
                <tbody>
                  {nft.orders.map((a, index) => (
                    <tr
                      key={index}
                      className={`${
                        latestOpenOrder?.hash === a.hash ? 'hidden' : ''
                      } border-t border-gray-700`}
                    >
                      <td className="p-2 pl-0 whitespace-nowrap">
                        <Price price={a.start_price} priceExact={a.start_price_exact} />
                      </td>
                      <td className="p-2 text-madGray">{abbreviateNumber(a.quantity)}</td>
                      <td className="p-2 text-madGrsay whitespace-nowrap">
                        <TimerComponent time={a.end_time} text="Closed" />
                      </td>
                      <td className="p-2">
                        <Link href={`/creator/` + a?.seller} className="text-madPink">
                          <>@{trimAddress(a.seller)} </>
                        </Link>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {account && a?.bidder?.toLowerCase() === account?.toLowerCase() ? (
                          <Tooltip
                            button={
                              <Link href={`/creator/` + a?.bidder} className="text-madPink">
                                <>
                                  @{a?.bidder_public_name || trimAddress(a.bidder)}{' '}
                                  <Icon icon="fa6-solid:check" className="ml-1 text-madGreen" />
                                </>
                              </Link>
                            }
                          >
                            {latestOpenOrder?.end_time * 1000 < new Date().getTime()
                              ? 'You have won this auction'
                              : 'You are the top bidder'}
                          </Tooltip>
                        ) : a.bidder ? (
                          <Link href={`/creator/` + a?.bidder} className="text-madPink">
                            <>@{a?.bidder_public_name || trimAddress(a.bidder)}</>
                          </Link>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-2 pr-0 text-right">
                        {a.end_time * 1000 > new Date().getTime() ? (
                          <>
                            {account?.toLowerCase() !== a.seller.toLowerCase() ? (
                              <Button
                                onClick={() => {
                                  onSaleBtnClick(a.sale_type === 0 ? 'buy' : 'bid', a)
                                }}
                                colour="madBlack"
                                hoverColour="madWhite"
                                darkColour="madWhite"
                                darkHoverColour="madBlack"
                                className="p-1 text-xs"
                              >
                                <Icon
                                  icon={a.sale_type === 0 ? 'fa6-solid:wallet' : 'fa6-solid:gavel'}
                                  className="mr-2"
                                />
                                <span className="whitespace-nowrap">
                                  {a.sale_type === 0 ? 'buy' : 'bid'}
                                </span>
                              </Button>
                            ) : (
                              <Button
                                onClick={() => {
                                  onSaleBtnClick('delist', a)
                                }}
                                colour="madGray"
                                hoverColour="madBlack"
                                className="p-1 text-xs rounded-md"
                              >
                                <Icon
                                  icon={a.sale_type === 0 ? 'fa6-solid:wallet' : 'fa6-solid:gavel'}
                                  className="mr-2"
                                />
                                <span className="whitespace-nowrap">Delist</span>
                              </Button>
                            )}
                          </>
                        ) : (
                          <>
                            {account &&
                            account?.toLowerCase() === a.seller.toLowerCase() &&
                            !a.bidder ? (
                              <Button
                                onClick={() => {
                                  onSaleBtnClick('delist', a)
                                }}
                                colour="madGray"
                                hoverColour="madBlack"
                                className="p-1 text-xs rounded-md"
                              >
                                <Icon
                                  icon={a.sale_type === 0 ? 'fa6-solid:wallet' : 'fa6-solid:gavel'}
                                  className="mr-2"
                                />
                                <span className="whitespace-nowrap">Delist</span>
                              </Button>
                            ) : account && account?.toLowerCase() === a.bidder?.toLowerCase() ? (
                              <Button
                                onClick={() => {
                                  onClaimAuction(a)
                                }}
                                colour="madPink"
                                hoverColour="madBlack"
                                className="p-1 text-xs rounded-md"
                              >
                                <Icon icon="fa6-solid:check" className="mr-2" />
                                <span className="whitespace-nowrap">Claim</span>
                              </Button>
                            ) : (
                              <span>{a.bidder ? 'Sold' : 'Closed'}</span>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ContentCardComponent>
        </>
      )}
    </>
  )
}
