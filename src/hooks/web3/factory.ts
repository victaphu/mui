import MADFactory721 from '../../constants/abi/MADFactory721.json'
import MADFactory1155 from '../../constants/abi/MADFactory1155.json'
import Web3 from 'web3'
import md5 from 'js-md5'
import useToaster from '../toast'
import { useEffect, useState } from 'react'
import { Collection } from '../../types/collection'
import { formatContractError } from '../../utils/utils'
import { useSelector } from 'react-redux'
import { getUserProfile } from '../../store/user'
import { parseEther } from 'ethers'
import { CallResponse, ContractAbi } from '../../types/global'
import { getCurrentNetwork } from '../../store/web3'
import { log } from '../../utils/log'
import { useAccount } from 'wagmi'

export default function useFactory() {
  const { connector } = useAccount()
  const creator = useSelector(getUserProfile)
  const network = useSelector(getCurrentNetwork)
  const toaster = useToaster()
  const errorResponse = (error: Error, message?: string): CallResponse => {
    if (message) toaster.error(message, formatContractError(error))
    log('mad:factory:errorResponse', error, 'error')
    return { error }
  }
  const successResponse = (response: Response): CallResponse => {
    log('mad:factory:successResponse', response)
    return { response }
  }

  const [contractFactory, setContractFactory] = useState<ContractAbi>({})
  const [contractType, setContractType] = useState<string>('')
  const [contractVersion, setContractVersion] = useState<'0.9' | '1.0' | 'external'>('1.0')

  /**
   * Load contracts based on the set type
   */
  useEffect(() => {
    log('mad:factory:useEffect', '', 'info')
    if (!network || !connector || !contractVersion || !contractType) return
    const Abi = {
      MADFactory721,
      MADFactory1155
    }
    const selectedVersion = contractVersion === 'external' ? '0.9' : contractVersion
    const factoryAbi = contractType === '1155' ? Abi.MADFactory1155 : Abi.MADFactory721
    const factoryAddress =
      contractType === '1155'
        ? network.addresses[selectedVersion].erc1155FactoryAddress
        : network.addresses[selectedVersion].erc721FactoryAddress
    connector.getProvider().then(provider => {
      const web3 = new Web3()
      // @ts-ignore
      setContractFactory(new web3.eth.Contract(factoryAbi.abi, factoryAddress))
    })
  }, [network, contractType, contractVersion, connector])

  /////////////////////////////////////////////
  // HELPER METHODS
  /////////////////////////////////////////////

  /**
   * Generate salt creator.address + time (entropy factor)
   * @methodOf helper
   */
  const salt = (): string => {
    return md5(creator.creator_address + '/' + Date.now().toString())
  }

  /**
   * Format the payment splitter payees and percentages using the passed user submitted data
   * and current creator profile
   * @param data User submitted form data
   * @methodOf helper
   */
  const formatSplitter = (data: Collection): { ambassador; project } => {
    const payees = {
      ambassador: { address: null, percentage: 0 },
      project: { address: null, percentage: 0 }
    }
    if (creator.ambassador_percent && creator.ambassador_address) {
      payees.ambassador.address = creator.ambassador_address
      payees.ambassador.percentage = creator.ambassador_percent
    }
    if (data.project_address && data.project_percent > 0) {
      payees.project.address = data.project_address
      payees.project.percentage = data.project_percent
    }
    return payees
  }

  /////////////////////////////////////////////
  // CREATOR METHODS
  /////////////////////////////////////////////

  /**
   * Splitter deployment pusher.
   * @param splitterSalt Nonce/Entropy factor used by CREATE3 method. Must be always different to avoid address collision. to generate payment splitter deployment address.
   * @param ambassadorAddresses Ambassadors address to receive payouts
   * @param projectAddresses Project address to receive payouts
   * @param ambassadorShares Ambassadors shares 1%-20%
   * @param projectShares Project shares 1%-90%
   * @param ownerAddress
   * @methodOf MADFactory721 && MADFactory1155
   */
  const createSplitter = async (
    splitterSalt: string,
    ownerAddress: string,
    ambassadorAddresses?: string,
    ambassadorShares?: number,
    projectAddresses?: string,
    projectShares?: number
  ): Promise<CallResponse> => {
    log('mad:factory:createSplitter', {
      splitterSalt,
      ambassadorAddresses: ambassadorAddresses
        ? ambassadorAddresses
        : network.addresses[contractVersion].nullAddress,
      projectAddresses: projectAddresses
        ? projectAddresses
        : network.addresses[contractVersion].nullAddress,
      ambassadorShares: ambassadorShares ? ambassadorShares : 0,
      projectShares: projectShares ? projectShares : 0,
      contractFactory
    })
    try {
      return successResponse(
        await contractFactory.methods
          .splitterCheck(
            splitterSalt,
            ambassadorAddresses
              ? ambassadorAddresses
              : network.addresses[contractVersion].nullAddress,
            projectAddresses ? projectAddresses : network.addresses[contractVersion].nullAddress,
            ambassadorShares ? ambassadorShares : 0,
            projectShares ? projectShares : 0
          )
          .send({ from: ownerAddress })
      )
    } catch (e) {
      return errorResponse(e, 'Create splitter error')
    }
  }

  /**
   * Args passed as params in this function serve as common denominator for all token types.
   * Extra config options must be set directly by through token type specific functions in `MADRouter` contract.
   * Frontend must attest that salt values must have common pattern so to not replicate same output.
   * @param tokenType Values legend: 0=Minimal; 1=Basic; 2=Whitelist; 3=Lazy.
   * @param tokenSalt Nonce/Entropy factor used by CREATE3 method to generate collection deployment address.
   * @param name Name of the collection to be deployed.
   * @param symbol Symbol of the collection to be deployed.
   * @param price Public mint price of the collection to be deployed.
   * @param maxSupply Maximum supply of tokens to be minted of the collection to be deployed (Not used for ERC721Minimal token type, since it always equals to one).
   * @param baseURI The URL + CID to be added the tokenID and suffix (.json) by the tokenURI function in the collection to be deployed (baseURI used as tokenURI itself for the ERC721Minimal token type).
   * @param splitterAddress Previously deployed Splitter implementation so to validate and attach to collection.
   * @param royalty Creator royalty percentage 0% - 10%
   * @param ownerAddress
   * @methodOf MADFactory721 && MADFactory1155
   */
  const createCollection = async (
    tokenType: 0 | 1 | 2 | 3,
    tokenSalt: string,
    name: string,
    symbol: string,
    price: number,
    maxSupply: number,
    baseURI: string,
    splitterAddress: string,
    royalty: number,
    ownerAddress: string
  ): Promise<CallResponse> => {
    const formattedPrice = parseEther(price.toString())
    log('mad:factory:createCollection', {
      tokenType,
      tokenSalt,
      name,
      symbol,
      price,
      maxSupply,
      baseURI,
      splitterAddress,
      royalty,
      formattedPrice,
      contractFactory
    })
    try {
      return successResponse(
        await contractFactory.methods
          .createCollection(
            tokenType,
            tokenSalt,
            name,
            symbol,
            formattedPrice,
            maxSupply,
            baseURI,
            splitterAddress,
            royalty
          )
          .send({ from: ownerAddress })
      )
    } catch (e) {
      return errorResponse(e, 'Create collection error')
    }
  }

  /////////////////////////////////////////////
  // FACTORY OWNER METHODS
  /////////////////////////////////////////////

  /**
   * Returns current paused status for the factory
   * @methodOf MADFactory721 && MADFactory1155
   */
  const paused = async (): Promise<CallResponse> => {
    try {
      return successResponse(await contractFactory.methods.paused().call())
    } catch (e) {
      return errorResponse(e, 'Pause error')
    }
  }

  /**
   * Pauses the factory
   * @param ownerAddress
   * @methodOf MADFactory721 && MADFactory1155
   */
  const pause = async (ownerAddress: string): Promise<CallResponse> => {
    try {
      return successResponse(await contractFactory.methods.pause().send({ from: ownerAddress }))
    } catch (e) {
      return errorResponse(e, 'Pause error')
    }
  }

  /**
   * Unpauses the factory
   * @param ownerAddress
   * @methodOf MADFactory721 && MADFactory1155
   */
  const unpause = async (ownerAddress: string): Promise<CallResponse> => {
    try {
      return successResponse(await contractFactory.methods.unpause().send({ from: ownerAddress }))
    } catch (e) {
      return errorResponse(e, 'Unpause error')
    }
  }

  return {
    setContractType,
    setContractVersion,
    contractFactory,
    contractType,
    contractVersion,
    salt,
    formatSplitter,
    createSplitter,
    createCollection,
    paused,
    pause,
    unpause
  }
}
