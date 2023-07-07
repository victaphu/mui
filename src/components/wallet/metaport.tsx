import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { useSelector } from 'react-redux'
import { getCurrentNetwork } from '../../store/web3'
import { metaportConfig } from '../../constants/metaport'
import { Metaport } from '@skalenetwork/metaport/build/Metaport'
import { interfaces } from '@skalenetwork/metaport'
import Button from '../form/button'
import List from '../common/list'
import useFuel from '../../hooks/web3/fuel'
import { log } from '../../utils/log'
import Loader from '../common/loader'
import { MetaportConfig } from '@skalenetwork/metaport/build/core/interfaces'
import { findNetworkById, requestNetworkChange } from '../../utils/network'
import { environment } from '../../constants/config'
import Input from '../form/input'
import { useAccount, useSwitchNetwork } from 'wagmi'

declare enum TokenType {
  eth = 'eth',
  erc20 = 'erc20',
  erc721 = 'erc721',
  erc721meta = 'erc721meta',
  erc1155 = 'erc1155'
}
export default function MetaportComponent({ className }: { className?: string }): JSX.Element {
  const { theme } = useTheme()
  const network = useSelector(getCurrentNetwork)

  const [metaport, setMetaport] = useState<Metaport>(null)
  const [metaportConfigData, setMetaPortConfigData] = useState<MetaportConfig>(null)
  const [metaportAmount, setMetaportAmount] = useState<string>('0.25')
  const { switchNetworkAsync } = useSwitchNetwork()
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'loaded'>('idle')
  const [loadingPow, setLoadingPow] = useState<boolean>(false)
  const elRef = useRef<HTMLDivElement>(null)
  const { pow } = useFuel()
  const { connector } = useAccount()

  const transfer = (
    from: string,
    to: string,
    amount: string,
    tokenType = TokenType.eth,
    tokenKey = 'eth',
    locked = false
  ) => {
    const transferParams: interfaces.TransferParams = {
      amount: amount,
      chains: [from, to],
      tokenType: tokenType,
      tokenKeyname: tokenKey,
      lockValue: locked
    }
    log('mad:metaport:transferParams', transferParams)
    if (metaport) metaport.transfer(transferParams)
  }

  const transferRoute = () => {
    if (parseFloat(metaportAmount) <= 0) return
    const transferParams = {
      amount: metaportAmount,
      chains: [
        metaportConfig[network.metaport].chains[0],
        metaportConfig[network.metaport].chains[2]
      ],
      tokenType: TokenType.eth,
      tokenKeyname: 'eth',
      route: {
        hub: metaportConfig[network.metaport].chains[1],
        tokenKeyname: network.currency.erc20Wrapper,
        tokenType: TokenType.erc20
      }
    }
    log('mad:metaport:metaportConfig', metaportConfig[network.metaport])
    log('mad:metaport:transferParams', transferParams)
    if (metaport) metaport.transfer(transferParams)
  }

  useEffect(() => {
    const loadMetaPort = async () => {
      setLoadingPow(true)
      //await pow()
      setLoadingPow(false)
      const MetaPortClass = (await import('@skalenetwork/metaport')).Metaport
      const config = metaportConfig[network.metaport]
      setMetaport(
        new MetaPortClass({
          ...config,
          ...{
            theme: {
              mode: theme,
              primary: '#FF1A54',
              background: theme === 'dark' ? '#151619' : '#ffffff'
            }
          }
        })
        //
      )
      setMetaPortConfigData(config)
    }

    const transferComplete = async () => {
      const isEthereum = [1, 5].includes(network.id)
      const isEuropa = [476158412, 2046399126].includes(network.id)

      // ask user to switch to Europa after eth transfer
      if (isEthereum) {
        const requestNetwork =
          environment === 'mainnet' ? findNetworkById(2046399126) : findNetworkById(476158412)
        // await requestNetworkChange(await connector.getProvider(), requestNetwork)
        await switchNetworkAsync(requestNetwork.id)
        return
      }

      // ask user to switch to calypso after erc20 wrap
      if (isEuropa) {
        const requestNetwork =
          environment === 'mainnet' ? findNetworkById(1564830818) : findNetworkById(344106930)
        // await requestNetworkChange(await connector.getProvider(), requestNetwork)
        await switchNetworkAsync(requestNetwork.id)
        return
      }
    }

    if (theme && loadState === 'idle' && network?.metaport) {
      setLoadState('loading')
      loadMetaPort().then(() => setLoadState('loaded'))
    }

    window.addEventListener('metaport_transferComplete', transferComplete, false)
    return () => {
      window.removeEventListener('metaport_transferComplete', transferComplete)
    }
  }, [loadState, network, theme, pow, connector])

  return (
    <div className={className ? className : ''}>
      <div className="hidden mb-6">
        <List
          className="text-left"
          items={[
            {
              icon: true,
              className: 'mb-2 text-lg',
              iconClassName: 'top-2',
              content: 'Transfer your ETH from Ethereum mainnet to the SKALE Europa Liquidity Hub'
            }
          ]}
        />
        <Button
          colour={loadingPow ? 'madGray' : 'madPink'}
          hoverColour="madBlack"
          className="rounded-md w-full justify-center tracking-[0.02em]"
          onClick={() => {
            metaport.reset()
            transfer(
              metaportConfigData.chains[0],
              metaportConfigData.chains[1],
              '0',
              TokenType.eth,
              'eth'
            )
          }}
        >
          {loadingPow ? (
            <Loader className="w-6 h-6" imgClassName="w-6 h-6" />
          ) : (
            <span className="whitespace-nowrap">Transfer To SKALE Europa</span>
          )}
        </Button>
      </div>
      <div className="hidden ">
        <List
          className="text-left"
          items={[
            {
              icon: true,
              className: 'mb-2 text-lg',
              iconClassName: 'top-2',
              content:
                'Transfer your ETH from the SKALE Eurpoa Liquidity Hub to the SKALE Calypso and start trading'
            }
          ]}
        />
        <Button
          colour={loadingPow ? 'madGray' : 'madPink'}
          hoverColour="madBlack"
          className="rounded-md w-full justify-center tracking-[0.02em]"
          onClick={() => {
            metaport.reset()
            transfer(
              metaportConfigData.chains[1],
              metaportConfigData.chains[2],
              '0',
              TokenType.erc20,
              `${network.currency.erc20Wrapper}`
            )
          }}
        >
          {loadingPow ? (
            <Loader className="w-6 h-6" imgClassName="w-6 h-6" />
          ) : (
            <span className="whitespace-nowrap">Transfer To SKALE Calypso</span>
          )}
        </Button>
      </div>
      <div>
        <List
          className="text-left"
          items={[
            {
              icon: true,
              className: 'mb-2 text-lg',
              iconClassName: 'top-2',
              content:
                'Transfer your ETH from Ethereum mainnet to the SKALE Calypso to trade your NFTs'
            }
          ]}
        />
        <div className="flex gap-2">
          <Button
            colour={loadingPow || parseFloat(metaportAmount) <= 0 ? 'madGray' : 'madPink'}
            hoverColour="madBlack"
            className={`rounded-md w-full justify-center tracking-[0.02em] ${
              loadingPow || parseFloat(metaportAmount) <= 0 ? 'disabled' : ''
            }`}
            onClick={transferRoute}
          >
            {loadingPow ? (
              <>
                <Loader className="w-6 h-6" imgClassName="w-6 h-6" /> Topping up your wallet with
                sFuel
              </>
            ) : (
              <span className="whitespace-nowrap">Transfer To SKALE Calypso</span>
            )}
          </Button>
          <Input
            className="rounded-md"
            type="number"
            name="amount"
            min={0}
            value={metaportAmount}
            onChange={(v) => {
              setMetaportAmount(v.toString())
            }}
          />
        </div>
      </div>
      <div ref={elRef} id="metaport" />
    </div>
  )
}
