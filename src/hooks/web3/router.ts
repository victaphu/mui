import MADRouter721 from '../../constants/abi/MADRouter721.json'
import MADRouter1155 from '../../constants/abi/MADRouter1155.json'
import Web3 from 'web3'
import md5 from 'js-md5'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserProfile } from '../../store/user'
import { CallResponse, ContractAbi } from '../../types/global'
import { getCurrentNetwork } from '../../store/web3'
import { useWeb3React } from '@web3-react/core'
import { parseEther } from 'ethers'
import usePayment from './payment'
import { log } from '../../utils/log'

export default function useTokenRouter() {
  const { library } = useWeb3React()
  const creator = useSelector(getUserProfile)
  const network = useSelector(getCurrentNetwork)
  const { approvePayer, errorResponse, successResponse } = usePayment()
  const [contractRouter, setContractRouter] = useState<ContractAbi>({})
  const [contractRouterAddress, setContractRouterAddress] = useState<string>('')
  const [contractType, setContractType] = useState<string>('')
  const [contractVersion, setContractVersion] = useState<'0.9' | '1.0' | 'external'>('1.0')

  /**
   * Load contracts from network settings and type
   */
  useEffect(() => {
    log('mad:router:useEffect', '', 'info')
    if (!network || !library?.provider || !contractType || !contractVersion) return
    const Abi = { MADRouter721, MADRouter1155 }
    const routerAbi = contractType === '1155' ? Abi.MADRouter1155 : Abi.MADRouter721
    const selectedVersion = contractVersion === 'external' ? '0.9' : contractVersion
    const routerAddress =
      contractType === '1155'
        ? network.addresses[selectedVersion].erc1155RouterAddress
        : network.addresses[selectedVersion].erc721RouterAddress
    const web3 = new Web3(library?.provider)
    // @ts-ignore
    setContractRouter(new web3.eth.Contract(routerAbi.abi, routerAddress))
    setContractRouterAddress(routerAddress)
  }, [network, contractType, contractVersion, library?.provider])

  /////////////////////////////////////////////
  // HELPER METHODS
  /////////////////////////////////////////////

  /**
   * Generate salt creator.address + time (entropy factor)
   * @methodOf contractHelpers
   */
  const salt = (): string => {
    return md5(creator.creator_address + '/' + Date.now().toString())
  }

  /////////////////////////////////////////////
  // OWNER METHODS
  /////////////////////////////////////////////

  /**
   * Set the public mint state to 'bool' on contract
   * @param ownerAddress
   * @param tokenAddress
   * @param bool
   * @param stateType
   * @methodOf MADRouter721 && MADRouter1155
   */
  const setMintState = async (
    ownerAddress: string,
    tokenAddress: string,
    bool: boolean,
    stateType: 0 | 1 | 2
  ): Promise<CallResponse> => {
    log('mad:router:setMintState', { ownerAddress, tokenAddress, bool, stateType })
    try {
      return successResponse(
        await contractRouter.methods
          .setMintState(tokenAddress, bool, stateType)
          .send({ from: ownerAddress })
      )
    } catch (error) {
      return errorResponse(error, 'Set public mint state error')
    }
  }

  /**
   * Set a contracts baseUri
   * @param ownerAddress
   * @param tokenAddress
   * @param baseUri
   * @methodOf MADRouter721 && MADRouter1155
   */
  const setBaseUri = async (
    ownerAddress: string,
    tokenAddress: string,
    baseUri: string
  ): Promise<CallResponse> => {
    log('mad:router:setMintState', { contractRouter, ownerAddress, tokenAddress, baseUri })
    try {
      return successResponse(
        await contractRouter.methods.setBase(tokenAddress, baseUri).send({ from: ownerAddress })
      )
    } catch (e) {
      return errorResponse(e, 'Set Base URI error')
    }
  }

  /**
   * Burn tokens
   * @param ownerAddress
   * @param contractAddress
   * @param ids
   * @param quantities
   * @param addresses
   * @methodOf MADRouter721 && MADRouter1155
   */
  const burn = async (
    ownerAddress: string,
    contractAddress: string,
    ids: number[],
    quantities?: number[],
    addresses?: string[]
  ): Promise<CallResponse> => {
    log('mad:router:burn', {
      contractRouter,
      ownerAddress,
      contractAddress,
      ids,
      quantities,
      addresses
    })
    try {
      if (contractType === '1155') {
        return successResponse(
          await contractRouter.methods
            .burn(contractAddress, ids, addresses, quantities)
            .send({ from: ownerAddress })
        )
      } else {
        return successResponse(
          await contractRouter.methods.burn(contractAddress, ids).send({ from: ownerAddress })
        )
      }
    } catch (error) {
      return errorResponse(error, 'Mint error')
    }
  }

  /////////////////////////////////////////////
  // MINTING METHODS
  /////////////////////////////////////////////

  /**
   * Mint X Basic tokens to address
   * @param ownerAddress
   * @param contractAddress
   * @param quantity
   * @param price
   * @methodOf MADRouter721 && MADRouter1155
   */
  const basicMintTo = async (
    ownerAddress: string,
    contractAddress: string,
    quantity: number,
    price: number
  ): Promise<CallResponse> => {
    const priceCalculated = (parseInt(price ? price.toString() : '0') + network.mintFee) * 10e17
    log('mad:router:basicMintTo', {
      contractRouter,
      ownerAddress,
      contractAddress,
      contractType,
      quantity,
      priceCalculated
    })
    const params = await approvePayer(
      ownerAddress,
      contractRouterAddress,
      priceCalculated.toString()
    )
    if (params.error) return params
    try {
      if (contractType === '1155') {
        return successResponse(
          await contractRouter.methods
            .basicMintTo(contractAddress, ownerAddress, 1, [parseInt(quantity.toString())])
            .send(params)
        )
      } else {
        return successResponse(
          await contractRouter.methods.basicMintTo(contractAddress, ownerAddress, 1).send(params)
        )
      }
    } catch (error) {
      return errorResponse(error, 'Mint error')
    }
  }

  /////////////////////////////////////////////
  // ROUTER OWNER METHODS
  /////////////////////////////////////////////

  /**
   * Get the router mint fee setting
   * @methodOf MADRouter721 && MADRouter1155
   */
  const getMintFee = async (): Promise<CallResponse> => {
    log('mad:router:getMintFee', '')
    try {
      const result = await contractRouter.methods.feeMint().call()
      return successResponse(result)
    } catch (e) {
      return errorResponse(e, 'Fee look up error')
    }
  }

  /**
   * Get the router burn fee setting
   * @methodOf MADRouter721 && MADRouter1155
   */
  const getBurnFee = async (): Promise<CallResponse> => {
    log('mad:router:getBurnFee', '')
    try {
      const result = await contractRouter.methods.feeBurn().call()
      return successResponse(result)
    } catch (e) {
      return errorResponse(e, 'Fee look up error')
    }
  }

  /**
   * Set the mint fee on the router
   * @param ownerAddress
   * @param mintFee
   * @param burnFee
   * @methodOf MADRouter721 && MADRouter1155
   */
  const setMintFees = async (
    ownerAddress: string,
    mintFee: string,
    burnFee: string
  ): Promise<CallResponse> => {
    log('mad:router:setMintFees', {
      mintFee: parseEther(mintFee),
      burnFee: parseEther(burnFee)
    })
    try {
      return successResponse(
        await contractRouter.methods
          .setFees(parseEther(mintFee), parseEther(burnFee))
          .send({ from: ownerAddress })
      )
    } catch (error) {
      return errorResponse(error, 'Set mint fee error')
    }
  }

  /**
   * Returns current paused status for the factory
   * @methodOf MADRouter721 && MADRouter1155
   */
  const paused = async (): Promise<CallResponse> => {
    log('mad:router:paused', '')
    try {
      return successResponse(await contractRouter.methods.paused().call())
    } catch (e) {
      return errorResponse(e, 'Pause error')
    }
  }

  /**
   * Pauses the router
   * @param ownerAddress
   * @methodOf MADRouter721 && MADRouter1155
   */
  const pause = async (ownerAddress: string): Promise<CallResponse> => {
    log('mad:router:pause', '')
    try {
      return successResponse(await contractRouter.methods.pause().send({ from: ownerAddress }))
    } catch (e) {
      return errorResponse(e, 'Pause error')
    }
  }

  /**
   * Unpauses the router
   * @param ownerAddress
   * @methodOf MADRouter721 && MADRouter1155
   */
  const unpause = async (ownerAddress: string): Promise<CallResponse> => {
    log('mad:router:unpause', '')
    try {
      return successResponse(await contractRouter.methods.unpause().send({ from: ownerAddress }))
    } catch (e) {
      return errorResponse(e, 'Unpause error')
    }
  }

  /**
   * Creator withdraw
   * @param tokenAddress
   * @param ownerAddress
   * @methodOf MADRouter721 && MADRouter1155
   */
  const withdrawContractFunds = async (
    tokenAddress: string,
    ownerAddress: string
  ): Promise<CallResponse> => {
    log('mad:router:withdrawContractFunds', { tokenAddress, ownerAddress })
    try {
      return successResponse(
        await contractRouter.methods
          .withdraw(tokenAddress, network.currency.erc20 || network.addresses.nullAddress)
          .send({ from: ownerAddress })
      )
    } catch (e) {
      return errorResponse(e, 'Withdraw error')
    }
  }

  return {
    setContractType,
    setContractVersion,
    contractRouter,
    contractType,
    salt,
    setMintState,
    setBaseUri,
    burn,
    basicMintTo,
    getMintFee,
    getBurnFee,
    setMintFees,
    paused,
    pause,
    unpause,
    withdrawContractFunds
  }
}
