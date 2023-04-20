import React from 'react'
import { useDispatch } from 'react-redux'
import Popup from '../common/popup'
import { tradeTypeAdded } from '../../store/trader'
import SellSelect from './sellSelect'
import Button from '../form/button'

export default function SellPopup({
  closePopup
}: {
  closePopup: () => Promise<void>
}): JSX.Element {
  const dispatch = useDispatch()
  return (
    <Popup closePopup={closePopup} title="Listing in the Marketplace">
      <div className="mb-4">
        <SellSelect
          onSelectBuy={() => dispatch(tradeTypeAdded('createBuyNow'))}
          onSelectAuction={() => dispatch(tradeTypeAdded('createAuction'))}
          className="flex mt-4 grid grid-cols-2 gap-2 sm:gap-4 sm:mx-8"
        />
      </div>
      <div className="flex justify-center items-center">
        <Button colour="madPink" hoverColour="madBlack" onClick={closePopup}>
          Cancel
        </Button>
      </div>
    </Popup>
  )
}
