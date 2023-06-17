import MADMarketplace721 from '../../constants/abi/MADMarketplace721.json'
import MADMarketplace1155 from '../../constants/abi/MADMarketplace1155.json'
import Web3 from 'web3'
import md5 from 'js-md5'
import { useEffect, useState } from 'react'
import { parseEther } from 'ethers'
import { useSelector } from 'react-redux'
import { getUserProfile } from '../../store/user'
import { CallResponse, ContractAbi } from '../../types/global'
import { getCurrentNetwork } from '../../store/web3'
import usePayment from './payment'
import { log } from '../../utils/log'
import { useAccount } from 'wagmi'

export default function useMarketplace() {
  const { connector } = useAccount()
  const network = useSelector(getCurrentNetwork)
  const trader = useSelector(getUserProfile)
  const { approvePayer, errorResponse, successResponse } = usePayment()

  const [contractMarketplace, setContractMarketplace] = useState<ContractAbi>({})
  const [contractMarketplaceAddress, setContractMarketplaceAddress] = useState<string>('')
  const [contractAddress, setContractAddress] = useState<string>('')
  const [contractType, setContractType] = useState<string>('')
  const [contractVersion, setContractVersion] = useState<'0.9' | '1.0' | 'external'>('1.0')
  const [tokenType, setTokenType] = useState<string>('')

  /**
   * Load contracts based on the set types
   * contractType - 721; 1155;
   * tokenType - 0=Minimal; 1=Basic; 2=Whitelist; 3=Lazy;
   * setContractAddress - 0.9; 1.0;
   */
  useEffect(() => {
    log('mad:marketplace:useEffect', '', 'info')
    if (!network || !connector) return
    if (!setTokenType || !contractType || !contractAddress || !contractVersion) return
    const Abi = {
      MADMarketplace721,
      MADMarketplace1155
    }
    const selectedVersion = contractVersion === 'external' ? '0.9' : contractVersion
    const marketplaceAddress =
      contractType === '721'
        ? network.addresses[selectedVersion].erc721MarketplaceAddress
        : network.addresses[selectedVersion].erc1155MarketplaceAddress
    const marketplaceAbi =
      contractType.toString() === '721' ? Abi.MADMarketplace721 : Abi.MADMarketplace1155
    connector.getProvider().then((provider) => {
      const web3 = new Web3(provider)
      setContractMarketplace(
        new web3.eth.Contract(
          // @ts-ignore
          marketplaceAbi.abi,
          marketplaceAddress
        )
      )
      setContractMarketplaceAddress(marketplaceAddress)
    })
  }, [connector, network, contractAddress, contractType, contractVersion, tokenType])

  /////////////////////////////////////////////
  // HELPER METHODS
  /////////////////////////////////////////////

  /**
   * Generate salt contractAddress + '/' + trader.address + '/' + time (entropy factor)
   * @methodOf helper
   */
  const salt = (): string => {
    return md5(contractAddress + '/' + trader.creator_address + '/' + Date.now().toString())
  }

  /**
   * Get the current block number
   * @methodOf helper
   */
  const getCurrentBlock = async (): Promise<number> => {
    const web3 = new Web3(await connector.getProvider())
    return web3.eth.getBlockNumber()
  }

  /////////////////////////////////////////////
  // PUBLIC METHODS
  /////////////////////////////////////////////

  /**
   * Returns the order info `orderHash`
   * @param orderHash
   */
  const getOrderInfo = async (orderHash: string): Promise<CallResponse> => {
    try {
      return successResponse(await contractMarketplace.methods.orderInfo(orderHash).call())
    } catch (e) {
      return errorResponse(e, 'Get approved error')
    }
  }

  /////////////////////////////////////////////
  // MARKETPLACE LISTING METHODS
  /////////////////////////////////////////////

  /**
   * List for fixed price sale
   * @param ownerAddress
   * @param id token ID
   * @param price Price to list item for
   * @param end End block for when to cancel the listing
   * @param quantity
   * @methodOf MADMarketplace721 & MADMarketplace1155
   */
  const fixedPrice = async (
    ownerAddress: string,
    id: number,
    price: number,
    end: number,
    quantity?: number
  ) => {
    log('mad:marketplace:fixedPrice', {
      contractMarketplace,
      contractAddress,
      contractType,
      ownerAddress,
      id: id.toString(),
      price: parseEther(price.toString()),
      end: parseInt(end.toString()),
      quantity: quantity ? parseInt(quantity.toString()) : 0
    })
    try {
      if (contractType === '1155') {
        return successResponse(
          await contractMarketplace.methods
            .fixedPrice(
              contractAddress,
              id.toString(),
              parseInt(quantity.toString()),
              parseEther(price.toString()),
              parseInt(end.toString())
            )
            .send({ from: ownerAddress })
        )
      } else {
        return successResponse(
          await contractMarketplace.methods
            .fixedPrice(
              contractAddress,
              id.toString(),
              parseEther(price.toString()),
              parseInt(end.toString())
            )
            .send({ from: ownerAddress })
        )
      }
    } catch (e) {
      return errorResponse(e, 'Create buy now listing error')
    }
  }

  /**
   * List for fixed english auction
   * @param ownerAddress
   * @param id tokenId
   * @param startPrice Price to list item for
   * @param end End block for when to cancel the listing
   * @param quantity 1155 assets only
   * @methodOf MADMarketplace721 & MADMarketplace1155
   */
  const englishAuction = async (
    ownerAddress: string,
    id: number,
    startPrice: number,
    end: number,
    quantity?: number
  ) => {
    log('mad:marketplace:englishAuction', {
      ownerAddress,
      id,
      startPrice: parseEther(startPrice.toString()),
      end,
      quantity
    })
    try {
      return successResponse(
        contractType === '721'
          ? await contractMarketplace.methods
              .englishAuction(contractAddress, id, parseEther(startPrice.toString()), end)
              .send({ from: ownerAddress })
          : await contractMarketplace.methods
              .englishAuction(contractAddress, id, quantity, parseEther(startPrice.toString()), end)
              .send({ from: ownerAddress })
      )
    } catch (e) {
      return errorResponse(e, 'Create auction listing error')
    }
  }

  /////////////////////////////////////////////
  // MARKETPLACE BUY / BID METHODS
  /////////////////////////////////////////////

  /**
   * Purchase a listed item via its order hash
   * @param buyerAddress
   * @param orderHash
   * @methodOf MADMarketplace721 & MADMarketplace1155
   */
  const buy = async (buyerAddress: string, orderHash: string) => {
    const info = await getOrderInfo(orderHash)
    const priceCalculated = info.response.startPrice
    const params = await approvePayer(buyerAddress, contractMarketplaceAddress, priceCalculated)
    log('mad:marketplace:buy', { buyerAddress, orderHash })
    if (params.error) return params
    try {
      return successResponse(await contractMarketplace.methods.buy(orderHash).send(params))
    } catch (e) {
      return errorResponse(e, 'Buy error')
    }
  }

  /**
   * Bid for fixed english auction
   * @param buyerAddress
   * @param orderHash
   * @param bidPrice
   * @methodOf MADMarketplace721 & MADMarketplace1155
   */
  const bid = async (buyerAddress: string, orderHash: string, bidPrice: number) => {
    const priceCalculated = parseEther(bidPrice.toString()).toString()
    const params = await approvePayer(buyerAddress, contractMarketplaceAddress, priceCalculated)
    log('mad:marketplace:bid', { buyerAddress, orderHash, priceCalculated })
    if (params.error) return params
    try {
      return successResponse(await contractMarketplace.methods.bid(orderHash).send(params))
    } catch (e) {
      return errorResponse(e, 'Bid error')
    }
  }

  /**
   * Cancel an open order, cannot use if there are bids
   * @param ownerAddress
   * @param orderHash
   * @methodOf MADMarketplace721 & MADMarketplace1155
   */
  const cancelOrder = async (ownerAddress: string, orderHash: string) => {
    log('mad:marketplace:cancelOrder', { ownerAddress, orderHash })
    try {
      return successResponse(
        await contractMarketplace.methods.cancelOrder(orderHash).send({ from: ownerAddress })
      )
    } catch (e) {
      return errorResponse(e, 'Cancel order error')
    }
  }

  /**
   * Claim for english auction
   * @param buyerAddress
   * @param orderHash
   * @methodOf MADMarketplace721 & MADMarketplace1155
   */
  const claim = async (buyerAddress: string, orderHash: string) => {
    log('mad:marketplace:claim', { buyerAddress, orderHash })
    try {
      return successResponse(
        await contractMarketplace.methods.claim(orderHash).send({ from: buyerAddress })
      )
    } catch (e) {
      return errorResponse(e, 'Claim error')
    }
  }

  return {
    setTokenType,
    setContractType,
    setContractAddress,
    setContractVersion,
    salt,
    getCurrentBlock,
    getOrderInfo,
    fixedPrice,
    englishAuction,
    buy,
    bid,
    cancelOrder,
    claim
  }
}
