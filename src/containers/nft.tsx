// @typed v1
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { trimAddress } from '../utils/utils'
import { getCurrentNetwork } from '../store/web3'
import useTokenRouter from '../hooks/web3/router'
import useCrudObjectApi from '../hooks/api/crudObject'
import useDataLikeObjectApi from '../hooks/api/likeObject'
import Popup from '../components/common/popup'
import PlayerComponent from '../components/player/player'
import Input from '../components/form/input'
import Button from '../components/form/button'
import Loader from '../components/common/loader'
import Link from '../components/common/link'
import useNftOwner from '../hooks/nftOwner'
import { Transaction } from '../types/transaction'
import { NftActionStates } from '../types/nft'
import {
  CreateDropComponent,
  DataListItemComponent,
  NftContainerComponent
} from '../types/containers'
import useToaster from '../hooks/toast'
import { useAccount } from 'wagmi'

const NftContainer = ({
  Component,
  nft,
  view,
  updateDropNft,
  className,
  updateData,
  reFetchData,
  hideViewButton,
  setListPreview,
  listIndex
}: NftContainerComponent & CreateDropComponent & DataListItemComponent): JSX.Element => {
  const [nftActionState, setNftActionState] = useState<NftActionStates>('idle')
  const [fileModalOpen, setFileModalOpen] = useState<boolean>(false)
  const [burnTransaction, setBurnTransaction] = useState<Transaction>({})
  const [burnableModalOpen, setBurnableModalOpen] = useState<boolean>(false)
  const [burnableCheckbox, setBurnableCheckbox] = useState<boolean>(null)
  const [burnableQuantity, setBurnableQuantity] = useState<number>(null)
  const [burnable, setBurnable] = useState(false)
  const routerContract = useTokenRouter()
  const network = useSelector(getCurrentNetwork)
  const { address: account } = useAccount()
  const { putData, getData } = useCrudObjectApi()
  const { postData, callUpdate } = useDataLikeObjectApi()
  const { ownerBalance, ownerOrder } = useNftOwner(nft)
  const toaster = useToaster()

  const hideToggle = () => {
    if (nftActionState === 'loading') return
    setNftActionState('loading')
    putData('nft/showhide/' + nft.id).then(() => {
      if (reFetchData) {
        reFetchData().then(() => {
          setNftActionState('idle')
        })
      } else {
        setNftActionState('idle')
      }
    })
  }

  const syncData = (setState = true) => {
    if (nftActionState === 'loading') return
    if (setState) setNftActionState('loading')
    getData('sync/nft/data/' + nft.id).then(() => {
      if (setState) setNftActionState('idle')
    })
  }

  const syncIpfs = () => {
    if (nftActionState === 'loading') return
    setNftActionState('loading')
    getData('sync/nft/ipfs/' + nft?.id).then(() => {
      setNftActionState('idle')
    })
  }

  const likeBoost = (val: number) => {
    if (nftActionState === 'loading') return
    setNftActionState('loading')
    postData('/nft/like', nft.id).then((res) => {
      if (updateData) {
        callUpdate(res, nft, updateData, val, 'likes_boost_count')
        setNftActionState('idle')
      } else {
        setNftActionState('idle')
      }
    })
  }

  const burn = async () => {
    if (!burnable || nftActionState === 'burnStateLoading') return

    // validate the balance to burn
    if (parseInt(ownerBalance.amount) < burnableQuantity) {
      toaster.error('Burn Error', 'You can only burn a max of ' + ownerBalance.amount)
      return
    }
    setNftActionState('burnStateLoading')

    const result = await routerContract.burn(
      account,
      nft.collection.contract_id,
      [parseInt(nft.token_id)],
      [burnableQuantity],
      [account]
    )
    if (result.error) {
      setNftActionState('idle')
      setBurnable(false)
      setBurnableCheckbox(false)
    } else {
      setNftActionState('burnStateComplete')
      setBurnTransaction(result.response)
      syncData(false)
    }
  }

  const startBurn = () => {
    if (nft.collection) {
      routerContract.setContractVersion(nft.collection.version)
      routerContract.setContractType(nft.collection.token_standard)
    }
    setBurnableModalOpen(true)
  }

  const cancelBurn = () => {
    setBurnableModalOpen(false)
    setNftActionState('idle')
    setBurnTransaction(null)
    setBurnable(false)
  }

  useEffect(() => {
    if (
      burnableCheckbox ||
      (nft?.collection?.token_standard === '1155' && burnableQuantity && burnableCheckbox)
    ) {
      setBurnable(true)
    } else {
      setBurnable(false)
    }
  }, [burnableCheckbox, burnableQuantity, nft?.collection?.token_standard])

  return (
    <>
      {burnableModalOpen && (
        <Popup title="Burn NFT" closePopup={cancelBurn}>
          {nftActionState === 'burnStateLoading' || nftActionState === 'burnStateComplete' ? (
            <div className="animate-in fade-in zoom-in rounded-lg dark:bg-madBlack bg-zinc-300 flex flex-col items-center justify-center z-top p-10">
              <div className=" w-full">
                <img
                  src={`${
                    nftActionState === 'burnStateLoading' ? '/neon-flame.png' : '/neon-tick.png'
                  }`}
                  className="w-64 m-auto mt-0 animate-pulse"
                  alt="Burn"
                />
              </div>
              <h2 className="text-2xl text-center mb-2 -mt-6">
                {nftActionState === 'burnStateLoading' ? 'Burning Token' : 'Token Burnt'}
                <span>.</span>
              </h2>
              <p className="text-center text-madGray text-sm mb-auto">
                {nftActionState === 'burnStateLoading'
                  ? 'Confirm your token burn via your connected wallet. The token will be removed from your wallet after it is destroyed. This may take a few seconds.'
                  : 'This token has been permanently destroyed.'}
              </p>
              {nftActionState === 'burnStateLoading' ? (
                <Loader className="mt-6" text="Check your wallet ..." />
              ) : (
                <Link
                  href={`${network?.explorerUrl}/tx/${burnTransaction?.transactionHash}`}
                  external={true}
                  className="text-madPink mb-auto"
                >
                  View transaction
                </Link>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-madGray text-center px-8 mb-4">
                This action will permanently destroy this token and cannot be undone.
              </p>
              <div className="p-3 mb-2 dark:bg-madBlack bg-zinc-300 flex justify-between w-full text-sm rounded rounded-sm">
                Token:{' '}
                <span className="ml-1 name-ellipsis">
                  <span className="text-madGray">
                    #{nft.token_id.length > 10 ? trimAddress(nft.token_id) : nft.token_id}
                  </span>{' '}
                  {nft.name}
                </span>
              </div>
              <label className="pl-3 pr-2 py-2 bg-madPink bg-opacity-50 flex items-center justify-between w-full text-xs text-madPink rounded-sm">
                <input
                  type="checkbox"
                  name="confirmBurn"
                  className="mx-2 mt-0"
                  onChange={(e) => setBurnableCheckbox(!!e.target.checked)}
                />{' '}
                I understand this is permanent and cannot be undone
                {nft.collection.token_standard === '1155' && (
                  <Input
                    max={parseInt(ownerBalance.amount)}
                    min={1}
                    type="number"
                    countText={null}
                    wrapperClassName="min-w-[200px]"
                    className="block p-2 px-1 text-center text-gray-500 dark:bg-madBlack bg-madWhite border border-gray-500 rounded-sm"
                    name="burn_quantity"
                    placeholder="Quantity"
                    onChange={(qty) => {
                      setBurnableQuantity(+qty < 0 ? 0 : parseInt(qty.toString()))
                    }}
                  />
                )}
              </label>
              <div className="flex w-full gap-2 justify-center mt-4">
                <Button colour="madPink" hoverColour="madBlack" onClick={cancelBurn}>
                  Cancel
                </Button>
                <Button
                  colour="madPink"
                  hoverColour="madBlack"
                  disabled={!burnable}
                  onClick={burn}
                  className={`${burnable ? '' : 'opacity-60 cursor-not-allowed'} `}
                >
                  Burn
                </Button>
              </div>
            </>
          )}
        </Popup>
      )}
      {fileModalOpen && (
        <Popup title="Additional files" closePopup={() => setFileModalOpen(false)}>
          <PlayerComponent
            files={nft?.files}
            image={nft?.image}
            download={!!(ownerBalance || ownerOrder)}
          />
        </Popup>
      )}
      {nft && (
        <Component
          nft={nft}
          view={view}
          className={className}
          updateData={updateData}
          reFetchData={reFetchData}
          startBurn={startBurn}
          hideToggle={hideToggle}
          likeBoost={likeBoost}
          syncData={syncData}
          syncIpfs={syncIpfs}
          nftActionState={nftActionState}
          setFileModalOpen={setFileModalOpen}
          setNftActionState={setNftActionState}
          updateDropNft={updateDropNft}
          hideViewButton={hideViewButton}
          setListPreview={setListPreview}
          listIndex={listIndex}
        />
      )}
    </>
  )
}
export default NftContainer
