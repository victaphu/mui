import ERC20 from '../../constants/abi/ERC20.json'
import Web3 from 'web3'
import useToaster from '../toast'
import { useEffect, useState } from 'react'
import { formatContractError } from '../../utils/utils'
import { useSelector } from 'react-redux'
import { getCurrentNetwork } from '../../store/web3'
import { useWeb3React } from '@web3-react/core'
import { CallResponse, ContractAbi } from '../../types/global'
import { parseEther } from 'ethers'
import { log } from '../../utils/log'
import { fromWei } from 'web3-utils'

export default function useERC20() {
  const { library } = useWeb3React()
  const network = useSelector(getCurrentNetwork)
  const toaster = useToaster()
  const errorResponse = (error: Error, message?: string): CallResponse => {
    if (message) toaster.error(message, formatContractError(error))
    log('mad:erc20:errorResponse', error, 'error')
    return { error }
  }
  const successResponse = (response: Response): CallResponse => {
    log('mad:erc20:successResponse', response)
    return { response }
  }

  const [erc20Contract, setErc20Contract] = useState<ContractAbi>({})
  const [loaded, setLoaded] = useState<boolean>(false)

  /**
   * Load contracts based on the set type
   */
  useEffect(() => {
    log('mad:erc20:useEffect', '', 'info')
    if (!network || !library?.provider || !network?.currency?.erc20) return
    const web3 = new Web3(library?.provider)
    // @ts-ignore
    setErc20Contract(new web3.eth.Contract(ERC20.abi, network.currency.erc20))
    setLoaded(true)
  }, [library, network])

  /////////////////////////////////////////////
  // PUBLIC METHODS
  /////////////////////////////////////////////

  /**
   * Returns the account balance
   * @param address
   * @methodOf ERC20
   */
  const getBalance = async (address: string): Promise<CallResponse> => {
    log('mad:erc20:getBalance', address)
    try {
      const web3 = new Web3(library.provider)
      const balance = await erc20Contract.methods.balanceOf(address).call()
      return {
        error: null,
        response: web3.utils.fromWei(balance, 'ether')
      }
    } catch (e) {
      return errorResponse(e, null)
    }
  }

  /**
   * Mint X tokens
   * @param address
   * @param quantity
   */
  const mint = async (address: string, quantity: number): Promise<CallResponse> => {
    log('mad:erc20:mint', { address, quantity })
    try {
      return successResponse(
        await erc20Contract.methods
          .mint(address, parseEther(quantity.toString()))
          .send({ from: address })
      )
    } catch (error) {
      return errorResponse(error, 'Mint ERC20 error')
    }
  }

  /**
   * Approve X tokens for address - the marketplace address in our use cases
   * @param ownerAddress
   * @param address
   * @param amount
   */
  const approve = async (
    ownerAddress: string,
    address: string,
    amount: string
  ): Promise<CallResponse> => {
    log('mad:erc20:approve', { ownerAddress, address, amount })
    const balance = await getBalance(ownerAddress)
    if (balance.response < fromWei(amount, 'ether')) {
      return errorResponse(
        new Error(
          `You do not have enough ${network.currency.erc20Symbol} to pay for this transaction. Please top up your wallet then try again.`
        ),
        'Approve ERC20 error'
      )
    }
    try {
      return successResponse(
        await erc20Contract.methods.approve(address, amount).send({ from: ownerAddress })
      )
    } catch (error) {
      return errorResponse(error, 'Approve ERC20 error')
    }
  }

  /**
   * Check the current approved amount for the passed address combination
   * @param address1
   * @param address2
   */
  const allowance = async (address1: string, address2: string): Promise<CallResponse> => {
    log('mad:erc20:allowance', { address1, address2 })
    try {
      return successResponse(await erc20Contract.methods.allowance(address1, address2).call())
    } catch (error) {
      return errorResponse(error, 'Allowance ERC20 error')
    }
  }

  return {
    loaded,
    getBalance,
    mint,
    approve,
    allowance
  }
}
