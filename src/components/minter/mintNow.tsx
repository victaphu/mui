import React, { useEffect, useState } from 'react'
import { abbreviateNumber } from '../../utils/utils'
import { Icon } from '@iconify/react'
import Loader from '../common/loader'
import { Collection } from '../../types/collection'
import useToken from '../../hooks/web3/token'
import useTimer from '../../hooks/timer'
import Button from '../form/button'
import NftCardComponent from '../nft/nftCard'
import { Nft } from '../../types/nft'
import { useSelector } from 'react-redux'
import { getCurrentNetwork } from '../../store/web3'
import Balance from '../wallet/balance'
import ConnectButton from '../wallet/button'
import WrongNetwork from '../common/wrongNetwork'
import { findNetworkById } from '../../utils/network'
import useWeb3 from '../../hooks/web3/web3'

export default function MintNow({
  collection,
  collectionLoading,
  className
}: {
  collection: Collection
  collectionLoading: boolean
  className?: string
}): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false)
  const [mintState, setMintState] = useState<string>('idle')
  const [mintedNft, setMintedNft] = useState<Nft>(null)
  const tokenContract = useToken()
  const { account } = useWeb3()
  const timer = useTimer()
  const network = useSelector(getCurrentNetwork)

  const mintNow = async () => {
    setLoading(true)
    const minted = await tokenContract.publicMint(account, 1)
    if (minted.error) {
      setLoading(false)
    } else {
      const nft: Nft = {
        id:
          collection.token_standard === '1155'
            ? minted?.response?.events?.TransferSingle?.returnValues?.id
            : minted?.response?.events?.Transfer?.returnValues?.id,
        token_id:
          collection.token_standard === '1155'
            ? minted?.response?.events?.TransferSingle?.returnValues?.id
            : minted?.response?.events?.Transfer?.returnValues?.id,
        contract_id: collection.contract_id,
        status: 1,
        owner: account,
        name: '',
        image: collection.img_avatar,
        category: collection.category,
        category_object: collection.category_object,
        unhatched: true,
        collection,
        creator: collection.creator,
        public_name: collection.public_name,
        last_price: collection.mint_price
      }
      setMintedNft(nft)
      setMintState('complete')
    }
  }

  useEffect(() => {
    if (collection?.contract_id && collection?.chain == network?.id) {
      tokenContract.setContractVersion(collection.version)
      tokenContract.setContractAddress(collection.contract_id)
      tokenContract.setContractType(collection.token_standard)
      tokenContract.setTokenType(collection.token_type)
    }
    if (!timer.endTime && collection.launch_date_time) {
      timer.setEndTime(new Date(collection.launch_date_time).getTime())
    }
  }, [timer, collection, tokenContract, collectionLoading, network?.id])

  return (
    <div className={className}>
      <h2 className="text-4xl mb-4">Minting {mintState === 'complete' ? 'Success' : 'Now'}</h2>
      {collection.launch_date_time ? (
        <div className="text-lg mt-auto mx-auto dark:bg-madCarbon bg-madWhite p-8 py-6 border border-zinc-800 rounded-full flex whitespace-nowrap">
          <>
            <div className="pr-2 mr-2 border-r border-gray-800 text-center">
              <span className="text-madGray mr-1">{timer.countdownObject?.days || 0}</span>D
            </div>
            <div className="pr-2 mr-2 border-r border-gray-800 text-center">
              <span className="text-madGray mr-1">{timer.countdownObject?.hours || 0}</span>H
            </div>
            <div className="pr-2 mr-2 border-r border-gray-800 text-center">
              <span className="text-madGray mr-1">{timer.countdownObject?.minutes || 0}</span>M
            </div>
            <div className="pr-2">
              <span className="text-madGray mr-1">{timer.countdownObject?.seconds || 0}</span>S
            </div>
          </>
        </div>
      ) : null}
      {mintState !== 'complete' && <Balance />}
      {!collectionLoading && mintState === 'idle' && (
        <div className="flex flex-col items-center">
          <div className="flex my-4 p-4 border-zinc-800 border rounded-lg">
            <div className="flex flex-col justify-center">
              <h3 className="flex items-center">
                <Icon icon="fa6-solid:dollar-sign" className="mr-2 h-3 text-madPink" /> Mint Price
              </h3>
            </div>
            <div className="ml-auto flex flex-col justify-center items-end text-right">
              <span className="ml-4">
                {abbreviateNumber(
                  parseFloat(collection.mint_price.toString()) +
                    (collection.version !== '0.9' ? parseFloat(network?.mintFee) : 0)
                )}{' '}
                {network?.currency?.erc20Symbol || network?.currency?.symbol}
              </span>
            </div>
          </div>
          <div className="text-madBlue text-2xl font-bold mb-4">
            {abbreviateNumber(collection.nfts_count)} / {abbreviateNumber(collection.max_supply)}
          </div>
          {collection?.chain && (
            <WrongNetwork compareNetwork={findNetworkById(collection?.chain)} />
          )}
          {network?.id == collection?.chain && !loading && account && (
            <Button
              onClick={mintNow}
              colour="madPink"
              hoverColour="madBlack"
              className="text-xl py-4 px-8"
            >
              <Icon icon="fa6-solid:fire-flame-curved" className="text-sm mr-2" />
              <span>Mint NOW</span>
            </Button>
          )}
          {loading && (
            <div className="py-4">
              <Loader />
            </div>
          )}
        </div>
      )}
      {!account && <ConnectButton />}
      {mintState === 'complete' && (
        <div className="max-w-sm">
          <div className="mb-8 text-sm">
            <strong>Congratulations!</strong>
            <br /> Your have minted your NFT and you can see a preview below. You can access your
            NFT from your account or resell in on the open Marketplace
          </div>
          <NftCardComponent nft={mintedNft} view="preview" />
        </div>
      )}
    </div>
  )
}
