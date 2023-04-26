import { useEffect, useState } from 'react'
import { Nft, NftBalance, NftOrder } from '../types/nft'
import useWeb3 from './web3/web3'

export default function useNftOwner(nft: Nft): {
  ownerBalance: NftBalance
  ownerOrder: NftOrder
} {
  const [ownerBalance, setOwnerBalance] = useState<NftBalance>(null)
  const [ownerOrder, setOwnerOrder] = useState<NftOrder>(null)
  const { account } = useWeb3()

  useEffect(() => {
    if (account && nft && nft.orders) {
      nft.orders.map((a) => {
        if (account?.toLowerCase() === a.seller?.toLowerCase()) {
          setOwnerOrder(a)
        }
      })
    }
    if (account && nft && nft.holders) {
      nft.holders.map((a) => {
        if (account?.toLowerCase() === a.owner?.toLowerCase()) {
          setOwnerBalance(a)
        }
      })
    }
  }, [nft, account])

  return { ownerBalance, ownerOrder }
}
