import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import {
  getWeb3AuthRequired,
  getApiAuthRequired,
  getShowWallet,
  hideWallet,
  showWallet,
  apiAuthRequiredAdded,
  web3AuthRequiredAdded,
  getCurrentNetwork
} from '../../store/web3'
import { getUser } from '../../store/user'
import Loader from '../common/loader'
import { useWeb3React } from '@web3-react/core'
import { Icon } from '@iconify/react'
import Popup from '../common/popup'
import { trimAddress } from '../../utils/utils'
import Balance from './balance'
import Connector from './connector'
import Copy from '../common/copy'
import MetaportComponent from './metaport'
import { requestAddAsset } from '../../utils/network'
import NetworkSelect from './networkSelect'
import Transak from './transak'
import Faucet from './faucet'
import { protectedPages } from '../../constants/config'

export default function Wallet(): JSX.Element {
  // App state
  const dispatch = useDispatch()
  const router = useRouter()
  const user = useSelector(getUser)
  const displayWallet = useSelector(getShowWallet)
  const web3AuthRequired = useSelector(getWeb3AuthRequired)
  const apiAuthRequired = useSelector(getApiAuthRequired)
  const { account } = useWeb3React()
  const network = useSelector(getCurrentNetwork)
  const { library } = useWeb3React()

  // Handle show the wallet based on store 'apiAuthRequired' || 'web3AuthRequired'
  useEffect(() => {
    if (apiAuthRequired || web3AuthRequired) {
      dispatch(showWallet())
    } else {
      dispatch(hideWallet())
    }
  }, [apiAuthRequired, web3AuthRequired, dispatch])

  // Local actions
  const toggleModal = async () => {
    if (displayWallet) {
      await dispatch(hideWallet())
      await dispatch(apiAuthRequiredAdded(false))
      await dispatch(web3AuthRequiredAdded(false))
      // Redirect here if modal is closed but auth is still in required state
      if ((web3AuthRequired || apiAuthRequired) && protectedPages.includes(router.pathname)) {
        router.push('/').then()
      }
    } else {
      await dispatch(showWallet())
    }
  }

  return (
    <>
      {displayWallet && (
        <Popup closePopup={toggleModal}>
          <>
            <div className="left-4 top-4 absolute">
              <NetworkSelect />
            </div>
            <h3 className="mb-4 -mt-1 px-6 text-2xl text-center font-medium">
              {apiAuthRequired ? (
                <>Signature Required</>
              ) : web3AuthRequired && !apiAuthRequired ? (
                <>Connect Your Wallet</>
              ) : account ? (
                <>My Wallet</>
              ) : (
                !account && <>Connect Your Wallet</>
              )}
            </h3>
            {apiAuthRequired && account && (
              <div className="mt-4 m-auto text-center">
                <Loader text="Check your wallet..." />
              </div>
            )}
            {apiAuthRequired && (
              <p className="mt-4 px-4 mb-8 text-center">
                Please connect by signing the message displayed in your wallet.
              </p>
            )}
            {user && (
              <>
                <div className="flex mb-4 p-4 border-zinc-800 border rounded-lg">
                  <div className="flex flex-col justify-center">
                    <h3 className="flex items-center">
                      <Icon icon="fa6-solid:user" className="mr-2 h-3 text-madPink" /> Connected{' '}
                      <span className="text-madGray text-sm ml-2">
                        ({localStorage.connectedType === 'injected' ? 'Metamask' : 'WalletConnect'})
                      </span>
                    </h3>
                    <h4 className="text-madGray text-sm">MAD User ID</h4>
                  </div>
                  <div className="ml-auto flex flex-col justify-center items-end text-right">
                    <Copy
                      text={trimAddress(user.address)}
                      copy={user.address}
                      success="Address copied"
                    />
                    <Copy
                      text={user.id}
                      copy={user.id}
                      success="User ID copied"
                      className="text-madGray text-sm"
                    />
                  </div>
                </div>
              </>
            )}
            <Balance />
            <Connector />
            {account && (
              <div className="text-center mt-4">
                <div className="items-start gap-2 flex flex-col">
                  {network?.metaport && (
                    <MetaportComponent className="p-5 rounded-md w-full bg-zinc-300 dark:bg-madBlack" />
                  )}
                  {network?.transak && (
                    <Transak className="p-5 rounded-md w-full bg-zinc-300 dark:bg-madBlack" />
                  )}
                </div>
                {network?.currency?.erc20 && (
                  <span
                    className="border-0 text-xs cursor-pointer hover:text-madPink underline mt-5 mx-2 mb-0 inline-block"
                    onClick={() =>
                      requestAddAsset(
                        library.provider,
                        network?.currency?.erc20,
                        network?.currency?.erc20Symbol,
                        network?.currency?.decimals
                      )
                    }
                  >
                    Click to add {network?.currency?.erc20Symbol} to your wallet
                  </span>
                )}
                {network?.tokenFaucet && <Faucet />}
              </div>
            )}
          </>
        </Popup>
      )}
    </>
  )
}
