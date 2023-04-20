import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../common/loader'
import Link from '../common/link'
import {
  formDataUpdated,
  getMinterFormData,
  getMinterLoader,
  getMinterStatus,
  getMinterTransaction,
  loaderUpdated,
  statusUpdated
} from '../../store/minter'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import { createDropDeleted } from '../../store/createDrop'
import { getCurrentNetwork } from '../../store/web3'
import Popup from '../common/popup'
import Balance from '../wallet/balance'
import List from '../common/list'
import Button from '../form/button'

export default function Minter(): JSX.Element {
  const dispatch = useDispatch()
  const minterStatus = useSelector(getMinterStatus)
  const minterFormData = useSelector(getMinterFormData)
  const minterLoader = useSelector(getMinterLoader)
  const transaction = useSelector(getMinterTransaction)
  const network = useSelector(getCurrentNetwork)
  const router = useRouter()

  const [title, setTitle] = useState<string>('')
  const [list, setList] = useState([])

  const clearTransaction = (location, keepData = false) => {
    dispatch(statusUpdated('idle'))
    dispatch(loaderUpdated(null))
    dispatch(formDataUpdated(null))
    if (!keepData) {
      dispatch(createDropDeleted())
    }
    router.push(location).then()
  }

  useEffect(() => {
    setTitle(
      minterStatus === 'approving'
        ? 'Contract Approval'
        : minterStatus === 'pending'
        ? 'Minting NFT'
        : minterStatus === 'listedPending'
        ? 'Listing NFT'
        : minterStatus === 'listed'
        ? 'Minted And Listed'
        : minterStatus === 'complete'
        ? 'Minting Complete'
        : ''
    )

    if (minterStatus === 'approving') {
      setList([
        {
          content:
            'Please approve your interaction with your selected collections smart contract via your connected wallet. This is a one time fee you pay, granting your wallets address permission to mint NFTs using the selected collection.'
        }
      ])
    } else if (minterStatus === 'pending') {
      setList([
        {
          content: 'Please sign the transaction via your wallet to pay and mint your NFT.'
        }
      ])
    } else if (minterStatus === 'listedPending') {
      setList([
        {
          className: 'mb-2',
          content: 'Please confirm your marketplace listing via your wallet.'
        },
        {
          icon: true,
          className: 'text-left',
          content:
            'If this is your first time listing for this collection you will need approve an additional transaction via your wallet allowing the Marketplace to list your item'
        },
        {
          icon: true,
          className: 'text-left',
          content:
            'You will then list your item with the marketplace by confirming the second transaction'
        }
      ])
    } else if (minterStatus === 'listed') {
      setList([
        {
          content:
            'Congratulations your NFT has been minted and listed in the marketplace. It may take a minute to complete pinning and indexing the metadata.'
        }
      ])
    } else if (minterStatus === 'complete') {
      setList([
        {
          content:
            'Congratulations your NFT has been minted. It may take a minute to complete pinning and indexing the metadata.'
        }
      ])
    }
  }, [minterStatus])

  return minterStatus !== 'idle' ? (
    <Popup>
      <h3 className="text-2xl text-center -mt-2">{title}</h3>
      <div className="h-px w-1/3 bg-madPink mx-auto mt-4" />
      {(minterStatus === 'pending' || minterStatus === 'listedPending') && (
        <div className="flex items-center justify-center mx-auto my-8">
          <Loader text={minterLoader} />
        </div>
      )}
      {list && (
        <div className="border border-zinc-800 bg-zinc-800 text-madWhite text-center text-sm mx-0 mt-4 p-4 rounded">
          <List items={list} />
        </div>
      )}
      <Balance />
      <div className="flex mt-4 p-4 border-zinc-800 border rounded-lg">
        <div className="flex flex-col justify-center">
          <h3 className="flex items-center">
            <Icon icon="fa6-solid:dollar-sign" className="mr-2 h-3 text-madPink" /> Mint fee
          </h3>
        </div>
        <div className="ml-auto flex flex-col justify-center items-end text-right">
          <span>
            {network?.mintFee} {network?.currency?.erc20Symbol || network?.currency?.symbol}
          </span>
        </div>
      </div>

      {transaction && (
        <div className="text-gray-300 text-center text-sm mt-4 rounded border border-zinc-800 p-4">
          <p className="break-words mb-4">
            <span className="text-madPink block">Transaction hash:</span>
            <Link
              external={true}
              href={`${network?.explorerUrl}/tx/${transaction.transactionHash}`}
            >
              {transaction.transactionHash}{' '}
              <Icon className="ml-2 text-madPink" icon="fa:external-link" />
            </Link>
          </p>
          <p>
            <span className="text-madPink block">Gas used:</span>
            {transaction.gasUsed}
          </p>
        </div>
      )}
      {(minterStatus === 'complete' || minterStatus === 'listed') && (
        <>
          <button
            onClick={() =>
              clearTransaction('/collection/' + minterFormData.nft.collection.contract_id)
            }
            className="w-full mt-6 mb-4 text-center"
          >
            <>
              View your <span className="underline text-madPink">Collection</span>
            </>
          </button>
          <div className="flex mt-4">
            <Button
              colour="madPink"
              hoverColour="madBlack"
              className="ml-auto"
              onClick={() => clearTransaction('/create')}
            >
              <>
                <Icon icon="fa6-solid:plus" className="mr-2" />
                Create new
              </>
            </Button>
            <Button
              colour="madPink"
              hoverColour="madBlack"
              className="mr-auto ml-4"
              onClick={() => clearTransaction('/create', true)}
            >
              <>
                <Icon icon="fa6-solid:plus" className="mr-2" />
                Copy NFT
              </>
            </Button>
          </div>
        </>
      )}
    </Popup>
  ) : null
}
