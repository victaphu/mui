import React from 'react'
import { Icon } from '@iconify/react'
import { apiAuthRequiredAdded, web3AuthRequiredAdded } from '../../store/web3'
import { useDispatch } from 'react-redux'
import Button from '../form/button'

export default function ConnectButton({ className }: { className?: string }): JSX.Element {
  const dispatch = useDispatch()
  const handleConnect = async () => {
    dispatch(web3AuthRequiredAdded(true))
    dispatch(apiAuthRequiredAdded(true))
  }

  return (
    <Button
      colour="madBlue"
      hoverColour="madBlack"
      darkColour="madBlue"
      darkHoverColour="madBlack"
      onClick={() => {
        handleConnect().then()
      }}
      className={className}
    >
      <Icon icon="fa6-solid:wallet" className="my-1.5 h-3" />
      <span className="hidden ml-2 lg:inline">Connect</span>
    </Button>
  )
}
