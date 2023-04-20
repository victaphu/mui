import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../common/loader'
import Link from '../common/link'
import {
  getCollectionLoader,
  getCollectionStatus,
  getCollectionTransaction,
  loaderUpdated,
  statusUpdated,
  transactionDeleted
} from '../../store/collection'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import { getCurrentNetwork } from '../../store/web3'
import { Collection } from '../../types/collection'
import Popup from '../common/popup'
import Balance from '../wallet/balance'
import List from '../common/list'
import Button from '../form/button'

export default function CollectionMinter({ collection }: { collection: Collection }): JSX.Element {
  const dispatch = useDispatch()
  const collectionStatus = useSelector(getCollectionStatus)
  const collectionLoader = useSelector(getCollectionLoader)
  const transaction = useSelector(getCollectionTransaction)
  const network = useSelector(getCurrentNetwork)
  const router = useRouter()

  const [title, setTitle] = useState<string>('')
  const [list, setList] = useState([])

  const clearTransaction = (route?: string) => {
    if (route) {
      router.push(route).then(() => {
        dispatch(statusUpdated('idle'))
        dispatch(loaderUpdated(null))
        dispatch(transactionDeleted())
      })
    } else {
      dispatch(statusUpdated('idle'))
      dispatch(loaderUpdated(null))
      dispatch(transactionDeleted())
    }
  }

  useEffect(() => {
    setTitle(
      collectionStatus === 'pending'
        ? 'Creating Collection'
        : collectionStatus === 'complete'
        ? 'Collection Created'
        : collectionStatus === 'pending-publicMintState'
        ? 'Updating Mint Status'
        : collectionStatus === 'complete-publicMintState'
        ? 'Mint Status Updated'
        : collectionStatus === 'pending-setBaseUri'
        ? 'Updating BaseURI'
        : collectionStatus === 'complete-setBaseUri'
        ? 'BaseURI Updated'
        : ''
    )

    if (collectionStatus === 'pending' && !collection?.royalty_split) {
      setList([
        {
          className: 'mb-4',
          content:
            'Please sign the transaction using your wallet to create your collection. You will submit 2 separate transactions to create your collection:'
        },
        {
          icon: true,
          className: 'text-left',
          content: 'First transaction to record your collections payout addresses.'
        },
        {
          icon: true,
          className: 'text-left',
          content: 'Second transaction to create your collection.'
        }
      ])
    } else if (collectionStatus === 'pending' && collection?.royalty_split) {
      setList([
        {
          content: 'Please sign the transaction using your wallet to create your collection.'
        }
      ])
    } else if (collectionStatus === 'complete') {
      setList([
        {
          content:
            'Congratulations your New Collection has been created! It may take a minute to complete syncing, you can then add NFTs and adjust your collections content'
        }
      ])
    } else if (collectionStatus === 'pending-publicMintState') {
      setList([
        {
          content:
            'Please sign the transactions using your wallet to update your collections public mint status. You can cancel this transaction click `Reject` or `Cancel` via your connected wallet.'
        }
      ])
    } else if (collectionStatus === 'complete-publicMintState') {
      setList([
        {
          content: 'Success, you have updated your collections mint status.'
        }
      ])
    } else if (collectionStatus === 'pending-setBaseUri') {
      setList([
        {
          content:
            'Please sign the transactions using your wallet to update your collections base URI. You can cancel this transaction click `Reject` or `Cancel` via your connected wallet.'
        }
      ])
    } else if (collectionStatus === 'complete-setBaseUri') {
      setList([
        {
          content: 'Success, you have updated your collections Base URI.'
        }
      ])
    }
  }, [collection, collection?.royalty_split, collectionStatus])

  return collectionStatus !== 'idle' ? (
    <Popup>
      <h3 className="text-2xl text-center -mt-2">{title}</h3>
      <div className="h-px w-1/3 bg-madPink mx-auto mt-4" />
      {(collectionStatus === 'pending' ||
        collectionStatus === 'pending-publicMintState' ||
        collectionStatus === 'pending-publicMintState' ||
        collectionStatus === 'pending-setBaseUri') && (
        <div className="flex items-center justify-center mx-auto my-8">
          <Loader text={collectionLoader} />
        </div>
      )}
      {list && (
        <div className="border border-zinc-800 bg-zinc-800 text-madWhite text-center text-sm mx-0 mt-4 p-4 rounded">
          <List items={list} />
        </div>
      )}
      <Balance />
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
      {collectionStatus === 'complete' && transaction.contractAddress && (
        <Button
          className="m-auto mt-6"
          colour="madPink"
          hoverColour="madBlack"
          onClick={() => clearTransaction('/edit-collection?id=' + transaction.contractAddress)}
        >
          Manage your collection
        </Button>
      )}
      {(collectionStatus === 'complete-publicMintState' ||
        collectionStatus === 'complete-publicMintState' ||
        collectionStatus === 'complete-setBaseUri') && (
        <Button
          className="m-auto mt-6"
          colour="madPink"
          hoverColour="madBlack"
          onClick={() => clearTransaction()}
        >
          Back to your collection
        </Button>
      )}
    </Popup>
  ) : null
}
