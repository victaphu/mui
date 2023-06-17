// @typed - MH
import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { networks, networksEditable } from '../../constants/network'
import { Network } from '../../types/network'
import { environment } from '../../constants/config'
import { useDispatch, useSelector } from 'react-redux'
import { changeNetwork, getCurrentNetwork } from '../../store/web3'
import { requestNetworkChange } from '../../utils/network'
import { useNetwork, useSwitchNetwork } from 'wagmi'
export default function CollectionChainSelect({
  allowSelection,
  selectedChain,
  className
}: {
  allowSelection: boolean
  selectedChain?: number
  className?: string
}): JSX.Element {
  const [currentChain, setCurrentChain] = useState<Network>()
  const currentNetwork = useSelector(getCurrentNetwork)
  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!selectedChain && !currentNetwork) return
    Object.values(networks).map((chain) => {
      if (selectedChain ? chain.id === selectedChain : chain.id === currentNetwork.id)
        setCurrentChain(chain)
    })
  }, [selectedChain, currentNetwork])

  return (
    <div className={className}>
      {allowSelection && (
        <div className="flex flex-wrap justify-between mb-0 -mx-1">
          {Object.values(networksEditable).map((chain) => (
            <div
              onMouseEnter={() => (chain.id ? setCurrentChain(chain) : null)}
              onMouseLeave={() => setCurrentChain(currentNetwork)}
              onClick={() => {
                if (
                  chain.environments.find((b) => b.environment === environment && b.active === 1)
                ) {
                  // if (library && library?.provider) {
                  //   requestNetworkChange(library.provider, chain).then()
                  // } else {
                  //   dispatch(changeNetwork(chain))
                  // }
                  switchNetwork(chain.id)
                }
              }}
              key={chain.id}
              className="flex w-1/2 2xl:w-1/3"
            >
              <div
                className={`${
                  chain.id == currentNetwork.id
                    ? 'border-madOnyx border-b-madPink'
                    : 'border-madOnyx border-b-black'
                } ${
                  !!chain.environments.find((b) => b.environment === environment && b.active === 1)
                    ? 'cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                } whitespace-nowrap dark:bg-madOnyx bg-zinc-200 rounded-xl p-3 w-full flex items-center justify-start uppercase border-b-2 mx-1 mb-2`}
              >
                {chain.icon !== 'false' ? (
                  <img width={44} height={44} src={chain.icon} alt="" className="mr-2" />
                ) : (
                  <div className="w-[44px] h-[44px] dark:bg-madCarbon bg-madWhite rounded-full mr-1 flex items-center justify-center">
                    ?
                  </div>
                )}
                {chain.label}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="dark:bg-madOnyx bg-zinc-200 rounded-xl p-4 flex flex-col gap-2 mb-2">
        <div className="flex items-center">
          <img
            width={74}
            height={74}
            src={currentChain?.icon}
            alt=""
            className="mr-4 mb-auto shrink-0"
          />
          <div>
            <span className="uppercase text-xl font-bold mr-2">{currentChain?.label}</span>
            <span className="dark:text-gray-500 text-gray-500">@{currentChain?.twitter}</span>
            <br />
            <span className="dark:text-gray-300 text-gray-500">{currentChain?.description}</span>
          </div>
        </div>
        {allowSelection && (
          <ul className="text-sm grid grid-cols-2 border-t border-gray-800 relative pt-3 mt-2 dark:text-gray-300 text-gray-500">
            <li className="border-r border-gray-800 absolute top-0 bottom-0 left-[50%]" />
            {currentChain?.notes?.map((note, k) => (
              <li key={k} className="pl-8 relative pr-2">
                <Icon
                  icon="fa6-solid:chevron-right"
                  className="text-madPink mr-0.5 absolute left-3.5 top-1 text-xs"
                />
                <Icon
                  icon="fa6-solid:chevron-right"
                  className="text-madPink mr-0.5 absolute left-5 top-1 text-xs"
                />{' '}
                {note}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
