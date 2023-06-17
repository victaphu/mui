import SplitterImpl from '../../constants/abi/SplitterImpl.json'
import ERC721Basic from '../../constants/abi/ERC721Basic.json'
import ERC1155Basic from '../../constants/abi/ERC1155Basic.json'
import ERC721Lazy from '../../constants/abi/ERC721Lazy.json'
import ERC1155Lazy from '../../constants/abi/ERC1155Lazy.json'
import ERC721Minimal from '../../constants/abi/ERC721Minimal.json'
import ERC721Whitelist from '../../constants/abi/ERC721Whitelist.json'
import ERC1155Minimal from '../../constants/abi/ERC1155Minimal.json'
import ERC1155Whitelist from '../../constants/abi/ERC1155Whitelist.json'
import { Attribute, Nft, NftMetaData } from '../../types/nft'
import Web3 from 'web3'
import md5 from 'js-md5'
import axios from 'axios'
import useToaster from '../toast'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCurrentNetwork } from '../../store/web3'
import { CallResponse, ContractAbi } from '../../types/global'
import usePayment from './payment'
import useERC20 from './erc20'
import { log } from '../../utils/log'
import { fromWei } from 'web3-utils'
import { parseEther } from 'ethers'
import { useAccount } from 'wagmi'

export default function useToken() {
  const { connector } = useAccount()
  const network = useSelector(getCurrentNetwork)
  const toaster = useToaster()
  const { getBalance } = useERC20()
  const { approvePayer, errorResponse, successResponse } = usePayment()

  const [loaded, setLoaded] = useState<boolean>(false)
  const [mintSupply, setMintSupply] = useState<number>(0)
  const [tokenContract, setTokenContract] = useState<ContractAbi>({})
  const [contractAddress, setContractAddress] = useState<string>('')
  const [marketplaceAddress, setMarketplaceAddress] = useState<string>('')
  const [contractType, setContractType] = useState<string>('')
  const [contractVersion, setContractVersion] = useState<'0.9' | '1.0' | 'external'>('1.0')
  const [tokenType, setTokenType] = useState<number>(null)

  /**
   * Load contracts based on the set type
   */
  useEffect(() => {
    log('mad:token:useEffect', '', 'info')
    if (!network || !connector || !contractType || !contractAddress || tokenType === null)
      return

    setLoaded(false)
    const Abi = {
      ERC721Minimal,
      ERC721Basic,
      ERC721Whitelist,
      ERC721Lazy,
      ERC1155Minimal,
      ERC1155Basic,
      ERC1155Whitelist,
      ERC1155Lazy
    }
    // 0=Minimal; 1=Basic; 2=Whitelist; 3=Lazy.
    connector.getProvider().then(provider => {
      const tokenContractAbi = contractType === '1155' ? Abi.ERC1155Basic : Abi.ERC721Basic
      const web3 = new Web3(provider)
      const selectedVersion = contractVersion === 'external' ? '0.9' : contractVersion
      // @ts-ignore
      setTokenContract(new web3.eth.Contract(tokenContractAbi.abi, contractAddress))
      setMarketplaceAddress(
        contractType === '721'
          ? network.addresses[selectedVersion].erc721MarketplaceAddress
          : network.addresses[selectedVersion].erc1155MarketplaceAddress
      )
      setLoaded(true)
    })
  }, [connector, network, contractAddress, contractType, contractVersion, tokenType])

  // Set data when contracts change
  useEffect(() => {
    if (tokenContract.methods) {
      if (contractVersion === '0.9') {
        tokenContract.methods
          .getCurrentSupply()
          .call()
          .then((result) => {
            setMintSupply(parseInt(result))
          })
      } else {
        tokenContract.methods
          .getMintCount()
          .call()
          .then((result) => {
            setMintSupply(parseInt(result))
          })
      }
    }
  }, [contractVersion, tokenContract.methods])

  /////////////////////////////////////////////
  // HELPER METHODS
  /////////////////////////////////////////////

  /**
   * Generate salt contractAddress + '/' + creator.address + '/' + time (entropy factor)
   * @methodOf helper
   */
  const salt = (creatorAddress: string): string => {
    return md5(contractAddress + '/' + creatorAddress + '/' + Date.now().toString())
  }

  /**
   * Convert CreateDrop.properties & CreateDrop.levels & CreateDrop.stats
   * to a metadata attributes compatible format
   * @param data
   * @param withMax
   * @param display
   * @methodOf helper
   */
  const formatForAttributes = (
    data: Attribute[],
    withMax: number = null,
    display: string = null
  ): Array<Attribute> => {
    if (!data) {
      return []
    }
    const formatted = []
    data.map((item) => {
      const newData: Attribute = {
        trait_type: item.trait_type,
        value: item.value
      }
      if (withMax) {
        newData.max_value = item.max_value ? item.max_value : withMax
        newData.display_type = 'number'
      } else {
        newData.display_type = display
      }
      formatted.push(newData)
    })
    return formatted
  }

  /**
   * Format CreateDrop to a metadata attributes compatible array
   * @param drop
   * @methodOf helper
   */
  const formatAttributes = (drop: Nft): Array<Attribute> => {
    return [
      ...formatForAttributes(drop.levels, 100),
      ...formatForAttributes(drop.stats, null, 'number'),
      ...formatForAttributes(drop.properties)
    ]
  }

  /**
   * Convert CSV string of tags to an array
   * @param drop
   * @methodOf helper
   */
  const formatTags = (drop: Nft): Array<string> => {
    return drop.tags ? drop.tags.toString().split(',') : []
  }

  /**
   * Format CreateDrop to NFT metadata ready for IPFS
   * @param drop
   * @methodOf helper
   */
  const formatDropJson = (drop: Nft): NftMetaData => {
    return {
      name: drop.name,
      owner: drop.creator.creator_address,
      image: drop.image,
      category: drop.collection.category,
      description: drop.description,
      external_url: drop.external_url,
      unlockable_url: drop.unlockable_url,
      explicit_content: drop.explicit_content,
      tags: formatTags(drop),
      attributes: formatAttributes(drop),
      files: drop.files
    }
  }

  /**
   * Pin JSON to IPFS and return its hash
   * @param json Formatted NFT json data
   * @param tokenId
   * @methodOf helper
   */
  const pinJson = async (json, tokenId): Promise<CallResponse> => {
    log('mad:token:pinJson', { json, tokenId })
    try {
      const result = await axios.post(`/api/pin`, {
        pinJson: json,
        pinFolder: contractAddress,
        key: tokenId
      })
      log('mad:token:pinJson', result)
      // @todo this needs checking, user should remove or use previous file first
      // if (result.data.error) {
      //   toaster.error(
      //     'Failed to generate NFT metadata, a file already exists for this token ID',
      //     result.data.error
      //   )
      //   log('mad:token:pinJson', result, 'error')
      //   return { error: result.data.error }
      // }
      return { response: result }
    } catch (error) {
      log('mad:token:pinJson', error, 'error')
      toaster.error('Failed to upload NFT metadata', error.error)
      return { error }
    }
  }

  /////////////////////////////////////////////
  // OWNER METHODS
  /////////////////////////////////////////////

  /**
   * Approve `tokenId` for marketplace listing
   * 721 tokens only
   * @param address
   * @param tokenId token ID
   * @methodOf ERC721Basic & ERC1155Basic
   */
  const setApprove = async (address: string, tokenId: number): Promise<CallResponse> => {
    log('mad:token:setApprove', { address, tokenId })
    try {
      return successResponse(
        await tokenContract.methods.approve(marketplaceAddress, tokenId).send({ from: address })
      )
    } catch (e) {
      return errorResponse(e, 'Get approved error')
    }
  }

  /**
   * Approve or remove `marketplaceAddress` as an operator for the `contractAddress`
   * @param address
   * @param bool
   * @methodOf ERC721Basic & ERC1155Basic
   */
  const setApprovalForAll = async (address: string, bool: boolean): Promise<CallResponse> => {
    log('mad:token:setApprovalForAll', { address, bool })
    try {
      return successResponse(
        await tokenContract.methods
          .setApprovalForAll(marketplaceAddress, bool)
          .send({ from: address })
      )
    } catch (error) {
      return errorResponse(error, 'Set approval error')
    }
  }

  const withdrawSplitterFunds = async (ownerAddress: string): Promise<CallResponse> => {
    try {
      const splitterAddress = await tokenContract.methods.splitter().call()
      log('mad:token:withdrawSplitterFunds', { ownerAddress, splitterAddress })
      const web3 = new Web3(await connector.getProvider())
      const splitterContract = new web3.eth.Contract(
        // @ts-ignore
        SplitterImpl.abi,
        splitterAddress
      )
      return successResponse(
        await splitterContract.methods.releaseAll().send({ from: ownerAddress })
      )
    } catch (error) {
      return errorResponse(error, 'Withdraw marketplace error')
    }
  }

  /////////////////////////////////////////////
  // PUBLIC METHODS
  /////////////////////////////////////////////

  /**
   * Returns the account approved for `tokenId`
   * @param tokenId token ID
   * @methodOf ERC721Basic & ERC1155Basic
   */
  const getApproved = async (tokenId: number): Promise<CallResponse> => {
    log('mad:token:getApproved', { tokenId })
    try {
      return successResponse(await tokenContract.methods.getApproved(tokenId).call())
    } catch (e) {
      return errorResponse(e, 'Get approved error')
    }
  }

  /**
   * Check if the `marketplaceAddress` is allowed to manage all of the assets of `contractAddress`.
   * @param address
   */
  const getApprovedForAll = async (address: string): Promise<CallResponse> => {
    log('mad:token:getApprovedForAll', { address })
    try {
      return successResponse(
        await tokenContract.methods.isApprovedForAll(address, marketplaceAddress).call()
      )
    } catch (error) {
      return errorResponse(error, 'Get approval error')
    }
  }

  /**
   * Returns the token URI
   * @param tokenId token ID
   * @methodOf ERC721Basic & ERC1155Basic
   */
  const getTokenUri = async (tokenId: number): Promise<CallResponse> => {
    log('mad:token:getTokenUri', { tokenId })
    try {
      return successResponse(await tokenContract.methods.tokenURI(tokenId).call())
    } catch (e) {
      return errorResponse(e, 'Get token URI error')
    }
  }

  /**
   * Get the current supply
   * @methodOf ERC721Basic & ERC1155Basic
   */
  const getCurrentSupply = async (): Promise<CallResponse> => {
    log('mad:token:getCurrentSupply', '')
    try {
      return tokenContract.methods.totalSupply().call()
    } catch (error) {
      return errorResponse(error)
    }
  }

  /**
   * Get the current supply
   * @methodOf ERC721Basic & ERC1155Basic
   */
  const getMintCount = async (): Promise<CallResponse> => {
    log('mad:token:getMintCount', '')
    try {
      return tokenContract.methods.getMintCount().call()
    } catch (error) {
      return errorResponse(error)
    }
  }

  /**
   * Get the current supply
   * @methodOf ERC721Basic & ERC1155Basic
   */
  const getMaxSupply = async (): Promise<CallResponse> => {
    log('mad:token:getMaxSupply', '')
    try {
      return tokenContract.methods.maxSupply().call()
    } catch (error) {
      return errorResponse(error)
    }
  }

  /**
   * Get the current mint price
   * @methodOf ERC721Basic & ERC1155Basic
   */
  const getPrice = async (): Promise<CallResponse> => {
    log('mad:token:getPrice', '')
    try {
      return successResponse(await tokenContract.methods.price().call())
    } catch (error) {
      return errorResponse(error)
    }
  }

  /**
   * Get the current mint fee count available to withdraw
   * @methodOf ERC721Basic & ERC1155Basic
   */
  const getFeeCount = async (): Promise<CallResponse> => {
    log('mad:token:getFeeCount', '')
    try {
      return tokenContract.methods.feeCount().call()
    } catch (error) {
      return errorResponse(error)
    }
  }

  /**
   * Get the contracts balance
   * @methodOf ...
   */
  const getBalances = async (): Promise<CallResponse> => {
    log('mad:token:getBalances', '')
    try {
      const web3 = new Web3(await connector.getProvider())
      const erc20 = await getBalance(contractAddress)
      const native = await web3.eth.getBalance(contractAddress)
      const mintFee = await getFeeCount()
      return {
        response: {
          erc20: network.currency.erc20 ? parseFloat(erc20.response) : 0,
          native: parseFloat(native),
          mintFee: parseInt(mintFee.toString()) / 10e17
        }
      }
    } catch (error) {
      return errorResponse(error)
    }
  }

  /**
   * Get the contracts splitter balance
   * @methodOf ...
   */
  const getSplitterBalances = async (ownerAddress: string): Promise<CallResponse> => {
    log('mad:token:getSplitterBalances', { ownerAddress })
    try {
      const splitterAddress = await tokenContract.methods.splitter().call()
      const web3 = new Web3(await connector.getProvider())
      const splitterContract = new web3.eth.Contract(
        // @ts-ignore
        SplitterImpl.abi,
        splitterAddress
      )
      return {
        response: {
          erc20: network.currency.erc20
            ? parseFloat(
                (
                  parseInt(
                    await splitterContract.methods
                      .releasable(network.currency.erc20, ownerAddress)
                      .call()
                  ) / 10e17
                ).toString()
              )
            : 0,
          native: parseFloat(await splitterContract.methods.releasable(ownerAddress).call())
        }
      }
    } catch (error) {
      return errorResponse(error)
    }
  }

  /**
   * Mint X Basic tokens to address, only if public mint = true
   * @param ownerAddress
   * @param quantity
   * @methodOf ERC721Basic & ERC1155Basic
   */
  const publicMint = async (ownerAddress: string, quantity: number): Promise<CallResponse> => {
    // network.mintFee is not set for 0.9
    const mintPrice = await getPrice()
    console.log(mintPrice)
    const priceFormatted = parseEther(
      (
        parseFloat(fromWei(mintPrice.response.toString())) * quantity +
        (contractVersion !== '0.9' ? network.mintFee : 0)
      ).toString()
    )

    log('mad:token:publicMint', {
      tokenContract,
      contractAddress,
      contractType,
      ownerAddress,
      quantity,
      mintPrice: mintPrice.response,
      priceFormatted
    })
    const params = await approvePayer(ownerAddress, contractAddress, priceFormatted.toString())
    if (params.error) return params
    try {
      if (contractType === '1155') {
        return successResponse(await tokenContract.methods.mint(1, 1).send(params))
      }
      return successResponse(await tokenContract.methods.mint(1).send(params))
    } catch (error) {
      return errorResponse(error, 'Mint error')
    }
  }

  return {
    loaded,
    contractAddress,
    mintSupply,
    setContractVersion,
    setContractAddress,
    setContractType,
    setTokenType,
    salt,
    formatForAttributes,
    formatAttributes,
    formatDropJson,
    pinJson,
    setApprove,
    setApprovalForAll,
    getApproved,
    getApprovedForAll,
    getTokenUri,
    getCurrentSupply,
    getMintCount,
    getMaxSupply,
    getFeeCount,
    getPrice,
    getBalances,
    getSplitterBalances,
    publicMint,
    withdrawSplitterFunds
  }
}
