import { useEffect, useState } from 'react'
import { Nft } from '../types/nft'
import { useSelector } from 'react-redux'
import { getCurrentNetwork } from '../store/web3'
import useWeb3 from './web3/web3'

export default function useNftPrice(nft: Nft): {
  floorPrice: number
  floorPriceExact: string
  cellingPrice: number
  cellingPriceExact: string
  lastPrice: number
  lastPriceExact: string
  symbol: string
  priceAction: boolean | null // null = no action
  priceActionChange: number
} {
  const [floorPrice, setFloorPrice] = useState<number>(null)
  const [floorPriceExact, setFloorPriceExact] = useState<string>(null)
  const [cellingPrice, setCellingPrice] = useState<number>(null)
  const [cellingPriceExact, setCellingPriceExact] = useState<string>(null)
  const [lastPrice, setLastPrice] = useState<number>(null)
  const [lastPriceExact, setLastPriceExact] = useState<string>(null)
  const [symbol, setSymbol] = useState<string>('ONE')
  const [priceAction, setPriceAction] = useState<boolean>(null)
  const [priceActionChange, setPriceActionChange] = useState<number>(null)
  const { account } = useWeb3()
  const network = useSelector(getCurrentNetwork)

  useEffect(() => {
    if (network) {
      setSymbol(network.currency.erc20Symbol || network.currency.symbol)
    }
    if (nft) {
      let floor = null
      let celling = null
      let floorExact = null
      let cellingExact = null
      if (nft.orders) {
        nft?.orders?.map((o) => {
          if (o.bid_price > 0) {
            floor = floor === null ? o.bid_price : o.bid_price < floor ? o.bid_price : floor
            floorExact =
              floorExact === null
                ? o.bid_price_exact
                : parseInt(o.bid_price_exact) < parseInt(floorExact)
                ? o.bid_price_exact
                : floorExact
            celling = o.bid_price > celling ? o.bid_price : celling
            cellingExact =
              parseInt(o.bid_price_exact) > parseInt(celling) ? o.bid_price_exact : celling
          } else {
            floor = floor === null ? o.start_price : o.start_price < floor ? o.start_price : floor
            floorExact =
              floorExact === null
                ? o.start_price_exact
                : parseInt(o.start_price_exact) < parseInt(floorExact)
                ? o.start_price_exact
                : floorExact
            celling = o.start_price > celling ? o.start_price : celling
            cellingExact =
              parseInt(o.start_price_exact) > parseInt(cellingExact)
                ? o.start_price_exact
                : cellingExact
          }
        })
      }
      const calcFloor = floor
        ? floor.toString()
        : nft.last_price && nft.last_price > 0
        ? nft.last_price
        : nft.collection.mint_price
        ? nft.collection.mint_price
        : '0'
      const calcFloorExact = floorExact
        ? floorExact
        : nft.last_price_exact && parseInt(nft.last_price_exact) > 0
        ? nft.last_price_exact
        : nft.collection.mint_price_exact
        ? nft.collection.mint_price_exact
        : '0'
      const calcCelling = celling ? celling.toString() : '0'
      const calcCellingExact = cellingExact ? cellingExact : '0'
      const calcLast = nft.last_price ? nft.last_price.toString() : '0'
      const calcLastExact = nft.last_price_exact ? nft.last_price_exact : '0'
      let calcChange = '0'
      if (calcLast != '0') {
        calcChange = ((parseFloat(calcFloor) / parseFloat(calcLast)) * 100 - 100).toFixed(2)
      } else {
        calcChange = '0'
      }
      setFloorPrice(parseFloat(calcFloor))
      setFloorPriceExact(calcFloorExact)
      setCellingPrice(parseFloat(calcCelling))
      setCellingPriceExact(calcCellingExact)
      setLastPrice(parseFloat(calcLast))
      setLastPriceExact(calcLastExact)
      setPriceAction(
        !parseInt(calcFloorExact) ||
          calcLastExact === '0' ||
          parseInt(calcFloorExact) === parseInt(calcLastExact)
          ? null
          : parseInt(calcLastExact) <= parseInt(calcFloorExact)
      )
      setPriceActionChange(parseFloat(calcChange))
    }
  }, [network, nft, account])

  return {
    floorPrice,
    floorPriceExact,
    cellingPrice,
    cellingPriceExact,
    lastPrice,
    lastPriceExact,
    symbol,
    priceAction,
    priceActionChange
  }
}
