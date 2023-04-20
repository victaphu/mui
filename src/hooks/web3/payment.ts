import useToaster from '../toast'
import { formatContractError } from '../../utils/utils'
import { CallResponse } from '../../types/global'
import useERC20 from './erc20'
import { log } from '../../utils/log'

export default function usePayment() {
  const toaster = useToaster()
  const erc20 = useERC20()
  const approvePayer = async (
    ownerAddress: string,
    approveAddress: string,
    price?: string
  ): Promise<CallResponse> => {
    let params
    if (erc20.loaded) {
      const result = await erc20.approve(ownerAddress, approveAddress, price)
      if (result.error) return result
      params = { from: ownerAddress }
    } else {
      params = { from: ownerAddress, value: price }
    }
    log('mad:usePayment:approvePayer', params)
    return params
  }
  const errorResponse = (error: Error, message?: string): CallResponse => {
    if (message) toaster.error(message, formatContractError(error))
    log('mad:usePayment:errorResponse', error, 'error')
    return { error }
  }
  const successResponse = (response: Response): CallResponse => {
    log('mad:usePayment:successResponse', response)
    return { response }
  }
  return {
    approvePayer,
    errorResponse,
    successResponse
  }
}
