import Web3 from 'web3'
import BN from 'bn.js'
import crypto from 'crypto'

import { useDispatch, useSelector } from 'react-redux'
import { backgroundFuelAdded, getBackgroundFuel, getCurrentNetwork } from '../../store/web3'
import { getUserProfile } from '../../store/user'
import { log } from '../../utils/log'
import { getNetworkBalance } from '../../utils/network'
import useWeb3 from './web3'

export default function useFuel() {
  const network = useSelector(getCurrentNetwork)
  const profile = useSelector(getUserProfile)
  const backgroundFuel = useSelector(getBackgroundFuel)
  const dispatch = useDispatch()
  const { account, library } = useWeb3()
  const DIFFICULTY = new BN(1)

  const createAddress = async (web3): Promise<{ address: string; privateKey: string }> => {
    if (backgroundFuel.address) return backgroundFuel
    const credentials = await web3.eth.accounts.create()
    dispatch(
      backgroundFuelAdded({
        privateKey: credentials.privateKey,
        address: credentials.address
      })
    )
    log('mad:fuel:createAddress', credentials)
    return credentials
  }

  const createData = async (receiverAddress: string) => {
    const web3 = new Web3(library?.provider)
    const data = web3.eth.abi.encodeFunctionCall(
      {
        name: network.id === 344106930 || network.id === 1564830818 ? 'pay' : 'mint',
        type: 'function',
        inputs: [
          {
            type: 'address',
            name: 'receiver'
          }
        ]
      },
      [receiverAddress]
    )
    log('mad:fuel:createData', data)
    return data
  }

  const mineFreeGas = (gasAmount, address, nonce, web3) => {
    log('mad:fuel:mineFreeGas', gasAmount)
    if (gasAmount >= 50000000) {
      log('mad:fuel:mineFreeGas', 'Unable to estimate gas', 'error')
      return
    }
    const nonceHash = new BN(web3.utils.soliditySha3(nonce).slice(2), 16)
    const addressHash = new BN(web3.utils.soliditySha3(address).slice(2), 16)
    const nonceAddressXOR = nonceHash.xor(addressHash)
    const maxNumber = new BN(2).pow(new BN(256)).sub(new BN(1))
    const divConstant = maxNumber.div(DIFFICULTY)
    let candidate
    while (true) {
      candidate = new BN(crypto.randomBytes(32).toString('hex'), 16)
      const candidateHash = new BN(web3.utils.soliditySha3(candidate).slice(2), 16)
      const resultHash = nonceAddressXOR.xor(candidateHash)
      const externalGas = divConstant.div(resultHash).toNumber()
      if (externalGas >= gasAmount) {
        break
      }
    }
    return candidate.toString()
  }

  const mineGasForTransaction = async (web3, tx) => {
    log('mad:fuel:mineGasForTransaction', tx)
    if (tx.from === undefined || tx.nonce === undefined) {
      log('mad:fuel:mineFreeGas', 'Not enough fields for mining gas (from, nonce)', 'error')
    }
    if (!tx.gas) {
      tx.gas = await web3.eth.estimateGas(tx)
    }
    const address = tx.from
    const nonce = web3.utils.isHex(tx.nonce) ? web3.utils.hexToNumber(tx.nonce) : tx.nonce
    const gas = web3.utils.isHex(tx.gas) ? web3.utils.hexToNumber(tx.gas) : tx.gas
    tx.gasPrice = mineFreeGas(gas, address, nonce, web3)
  }

  const send = async (web3, testKey, contractAddress, receiverAddress) => {
    const address = web3.eth.accounts.privateKeyToAccount(testKey).address
    const nonce = await web3.eth.getTransactionCount(address)
    const tx = {
      from: address,
      to: contractAddress,
      data: await createData(receiverAddress),
      nonce: nonce
    }
    log('mad:fuel:send:tx', tx)
    await mineGasForTransaction(web3, tx)
    const signed = await web3.eth.accounts.signTransaction(tx, testKey)
    return web3.eth.sendSignedTransaction(signed.rawTransaction)
  }

  const pow = async () => {
    const balance = await getNetworkBalance(account, library?.provider)
    if (parseFloat(balance.toString()) > 0.00001) {
      log('mad:fuel:pow', 'tokenFaucet not required: ' + balance.toString())
      return
    }
    if (!network.tokenFaucet) {
      log('mad:fuel:pow', 'tokenFaucet not supported for the current network', 'error')
      return new Promise((resolve) => resolve(false))
    }
    log('mad:fuel:pow', 'tokenFaucet init')
    const web3 = new Web3(library?.provider)
    const credentials = await createAddress(web3)
    try {
      const result = await send(
        web3,
        credentials.privateKey,
        network.tokenFaucet,
        profile.creator_address
      )
      log('mad:fuel:send', result, 'success')
      return result
    } catch (e) {
      log('mad:fuel:send', e, 'error')
      return e
    }
  }

  return {
    pow
  }
}
