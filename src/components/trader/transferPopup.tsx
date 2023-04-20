import React from 'react'
import Popup from '../common/popup'
import { Nft } from '../../types/nft'

export default function TransferPopup({
  transferData,
  closePopup,
  symbol
}: {
  transferData: Nft
  closePopup: () => Promise<void>
  symbol: string
}): JSX.Element {
  return (
    <Popup closePopup={closePopup}>
      <button>
        Transfer popup content will be here!!! {transferData?.id} {symbol}
      </button>
    </Popup>
  )
}
