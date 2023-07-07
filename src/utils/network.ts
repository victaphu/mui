import Web3 from 'web3'
import { networkDefault, networks } from '../constants/network'
import type { Network } from '../types/network'
import { ExternalProvider, Web3Provider } from '@ethersproject/providers'
import { log } from './log'
import { changeNetwork } from '../store/web3'

export default function getLibrary(provider: ExternalProvider) {
  return new Web3Provider(provider)
}

export function findNetworkById(chainId: string | number): Network {
  let network = networks.find((n) => n.id === parseInt(chainId.toString()))
  if (!network) network = networkDefault
  return network as Network
}

export function findNetworkByName(name: string | number): Network {
  let network = networks.find((n) => n.name === name)
  if (!network) network = networkDefault
  return network as Network
}

export const isMetaMaskInstalled = () => {
  // @ts-ignore
  return typeof window.web3 !== 'undefined'
}

export const getNetworkBalance = async (accountAddress: string, provider) => {
  if (!provider || !accountAddress) {
    return 0
  }
  try {
    const web3 = new Web3(provider)
    const balance = await web3.eth.getBalance(accountAddress)
    return web3.utils.fromWei(balance, 'ether')
  } catch (error) {
    log('mad:getNetworkBalance', error, 'error')
    return null
  }
}

export const requestNetworkChange = async (provider, network) => {
  if (provider && provider?.networkVersion !== network.id) {
    const web3 = new Web3(provider)
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3.utils.toHex(network.id) }]
      })
    } catch (err) {
      console.log('switching error', err, err.code)
      console.error(err)
      // This error code indicates that the chain has not been added to MetaMask
      if (err.code === 4902 || err.code === 32603) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainName: network.networkLabel,
              chainId: web3.utils.toHex(network.id),
              nativeCurrency: network.currency,
              rpcUrls: [network.rpcUrl]
            }
          ]
        })
      }
    }
  }
  return false
}

export const compareAndRequestNetworkChange = async (
  provider,
  dispatch,
  network,
  networkCompare
): Promise<boolean> => {
  if (networkCompare.id !== network?.id && provider) {
    await requestNetworkChange(provider, networkCompare)
    location.reload()
    return true
  } else if (!provider) {
    dispatch(changeNetwork(networkCompare))
  }
  return false
}

export const requestAddAsset = async (provider, tokenAddress, tokenSymbol, tokenDecimals) => {
  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    return provider.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: tokenAddress, // The address that the token is at.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: tokenDecimals, // The number of decimals in the token
          image: 'https://madnfts.io/chain-skale.svg'
        }
      }
    })
  } catch (error) {
    log('mad:requestAddAsset', error, 'error')
  }
}
