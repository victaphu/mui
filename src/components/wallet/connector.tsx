import React from 'react'
import useAuth from '../../hooks/web3/auth'
import { isMetaMaskInstalled } from '../../utils/network'
import { useWeb3React } from '@web3-react/core'
import { Icon } from '@iconify/react'

export default function Connector(): JSX.Element {
  const { account } = useWeb3React()
  const auth = useAuth()

  const connect = async (container) => {
    await auth.connect(container)
  }

  return (
    <>
      {!account && (
        <>
          {isMetaMaskInstalled() && (
            <button
              onClick={() => connect('injected')}
              className=" m-auto mt-6 relative flex items-center text-madPink ring-1 ring-madPink uppercase rounded-full py-1.5 px-3 tracking-[-0.08em] duration-300 hover:bg-madPink dark:hover:text-madBlack hover:text-madBlack"
            >
              <div className="absolute inset-0 w-full h-full ring-madPink/80 ring-opacity-80 rounded-full duration-300 hover:ring-4 hover:animate-pulse" />
              <Icon icon="fa6-solid:wallet" className="mr-2" />
              Connect with MetaMask
            </button>
          )}
          <button
            onClick={() => connect('walletConnect')}
            className=" m-auto mt-2 relative flex items-center text-madPink ring-1 ring-madPink uppercase rounded-full py-1.5 px-3 tracking-[-0.08em] duration-300 hover:bg-madPink dark:hover:text-madBlack hover:text-madBlack"
          >
            <div className="absolute inset-0 w-full h-full ring-madPink/80 ring-opacity-80 rounded-full duration-300 hover:ring-4 hover:animate-pulse" />
            <Icon icon="fa6-solid:wallet" className="mr-2" />
            Connect with Wallet connect
          </button>
        </>
      )}
    </>
  )
}
