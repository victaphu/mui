import { useEffect, useState } from 'react'
import { Nft, NftBalance, NftOrder } from '../types/nft'
import { useAccount } from 'wagmi'

export default function useNftOwner(nft: Nft): {
  ownerBalance: NftBalance
  ownerOrder: NftOrder
} {
  const [ownerBalance, setOwnerBalance] = useState<NftBalance>(null)
  const [ownerOrder, setOwnerOrder] = useState<NftOrder>(null)
  const { address: account } = useAccount()

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
