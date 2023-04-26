import React from 'react'
import useAuth from '../../hooks/web3/auth'
import { isMetaMaskInstalled } from '../../utils/network'
import { Icon } from '@iconify/react'
import useWeb3 from '../../hooks/web3/web3'

export default function Connector(): JSX.Element {
  const { account } = useWeb3()
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
              onClick={() => connect('social')}
              className=" m-auto mt-6 relative flex items-center text-madPink ring-1 ring-madPink uppercase rounded-full py-1.5 px-3 tracking-[-0.08em] duration-300 hover:bg-madPink dark:hover:text-madBlack hover:text-madBlack"
            >
              <div className="absolute inset-0 w-full h-full ring-madPink/80 ring-opacity-80 rounded-full duration-300 hover:ring-4 hover:animate-pulse" />
              <Icon icon="fa6-solid:wallet" className="mr-2" />
              Use Social Connect
            </button>
          )}
          {isMetaMaskInstalled() && (
            <button
              onClick={() => connect('injected')}
              className=" m-auto mt-2 relative flex items-center text-madPink ring-1 ring-madPink uppercase rounded-full py-1.5 px-3 tracking-[-0.08em] duration-300 hover:bg-madPink dark:hover:text-madBlack hover:text-madBlack"
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
