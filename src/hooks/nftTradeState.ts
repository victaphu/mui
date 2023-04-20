import { useEffect, useState } from 'react'
import { Nft, NftOrder } from '../types/nft'
import { useWeb3React } from '@web3-react/core'

export default function useNftTradeState(nft: Nft): {
  inAuction: boolean
  buyable: boolean
  biddable: boolean
  buttonText: string
  latestOpenOrder: NftOrder
} {
  const [inAuction, setInAuction] = useState(false)
  const [buyable, setBuyable] = useState(false)
  const [biddable, setBiddable] = useState(false)
  const [buttonText, setButtonText] = useState('View')
  const [latestOpenOrder, setLatestOpenOrder] = useState(null)
  const { account } = useWeb3React()

  useEffect(() => {
    if (latestOpenOrder) return
    const openOrders = nft?.orders?.filter((n) => {
      return n.end_time * 1000 > new Date().getTime()
    })
    const order = openOrders && openOrders[0] ? openOrders[0] : nft?.orders ? nft?.orders[0] : null
    if (order) {
      setLatestOpenOrder(order)
      setBuyable(order?.sale_type === 0)
      setBiddable(order?.sale_type > 0)
      setButtonText(order?.sale_type === 0 ? 'Buy' : order?.sale_type > 0 ? 'Bid' : 'View')
      if (account?.toLowerCase() === nft.orders[0]?.seller?.toLowerCase() && biddable) {
        setInAuction(true)
      }
    } else {
      setButtonText('View')
    }
  }, [nft, setLatestOpenOrder, latestOpenOrder, account, biddable])

  return { inAuction, buyable, biddable, buttonText, latestOpenOrder }
}
