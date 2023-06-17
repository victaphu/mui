import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCurrentNetwork } from '../../store/web3'
import { getNetworkBalance } from '../../utils/network'
import { Icon } from '@iconify/react'
import { abbreviateNumber } from '../../utils/utils'
import useERC20 from '../../hooks/web3/erc20'
import { useAccount } from 'wagmi'

export default function Balance(): JSX.Element {
  const { address: account, connector } = useAccount()
  const network = useSelector(getCurrentNetwork)
  const erc20 = useERC20()

  const [balance, setBalance] = useState(null)
  const [networkBalance, setNetworkBalance] = useState(null)

  // Handle fetch balance and network detail
  useEffect(() => {
    async function fetchBalance() {
      // setBalance(await getNetworkBalance(account, library?.provider))
      setBalance(await getNetworkBalance(account, await connector.getProvider()))
    }
    if (network && connector && account) {
      fetchBalance().then()
    }
  }, [connector, network, account])

  // Handle fetch balance for ERC20 marketplaces
  useEffect(() => {
    async function fetchBalanceErc20() {
      const erc20Balance = await erc20.getBalance(account)
      setNetworkBalance(erc20Balance.response)
    }
    if (erc20?.loaded && network?.currency?.erc20Symbol && account) {
      fetchBalanceErc20().then()
    }
  }, [network, account, erc20])

  return (
    <>
      {account && balance ? (
        <div className="flex mt-4 p-4 border-zinc-800 border rounded-lg">
          <div className="flex flex-col justify-center">
            <h3 className="flex items-center">
              <Icon icon="fa6-solid:wallet" className="mr-2 h-3 text-madPink" /> Balance
            </h3>
            {network?.currency?.erc20Symbol && (
              <h4 className="text-madGray text-sm">Network Balance</h4>
            )}
          </div>
          <div className="ml-auto flex flex-col justify-center items-end text-right">
            <span className="ml-4">
              {abbreviateNumber(network?.currency?.erc20Symbol ? networkBalance : balance)}{' '}
              {network?.currency?.erc20Symbol || network?.currency?.symbol}
            </span>
            {network?.currency?.erc20Symbol && (
              <span className="text-madGray text-sm ml-4">
                {abbreviateNumber(balance)} {network?.currency?.symbol}
              </span>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
