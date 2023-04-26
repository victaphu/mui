import React, { useEffect, useState } from 'react'
import { Collection } from '../../types/collection'
import Label from '../form/label'
import useToken from '../../hooks/web3/token'
import Loader from '../common/loader'
import { useSelector } from 'react-redux'
import { getCurrentNetwork } from '../../store/web3'
import Info from '../form/info'
import { Tooltip } from '../toolTip/toolTip'
import { Icon } from '@iconify/react'
import Button from '../form/button'
import useRouter from '../../hooks/web3/router'
import useWeb3 from '../../hooks/web3/web3'

export default function Withdraw({ collection }: { collection: Collection }): JSX.Element {
  const network = useSelector(getCurrentNetwork)
  const tokenContract = useToken()
  const router = useRouter()
  const { account } = useWeb3()
  const [loaded, setLoaded] = useState<boolean>(false)
  const [withdrawing, setWithdrawing] = useState<boolean>(false)
  const [balances, setBalances] = useState(null)
  const [splitterBalances, setSplitterBalances] = useState(null)

  const withdrawMintFunds = async () => {
    setWithdrawing(true)
    const result = await router.withdrawContractFunds(collection.contract_id, account)
    if (!result.error) {
      const a = await tokenContract.getBalances()
      const b = await tokenContract.getSplitterBalances(account)
      setBalances(a.response)
      setSplitterBalances(b.response)
    }
    setWithdrawing(false)
  }

  const withdrawSplitterFunds = async () => {
    setWithdrawing(true)
    const result = await tokenContract.withdrawSplitterFunds(account)
    if (!result.error) {
      const a = await tokenContract.getBalances()
      const b = await tokenContract.getSplitterBalances(account)
      setBalances(a.response)
      setSplitterBalances(b.response)
    }
    setWithdrawing(false)
  }

  useEffect(() => {
    const getData = async () => {
      const a = await tokenContract.getBalances()
      const b = await tokenContract.getSplitterBalances(account)
      setBalances(a.response)
      setSplitterBalances(b.response)
      setLoaded(true)
    }
    if (collection?.contract_id) {
      tokenContract.setContractVersion(collection.version || '1.0')
      tokenContract.setContractAddress(collection.contract_id)
      tokenContract.setContractType(collection.token_standard || '721')
      tokenContract.setTokenType(collection.token_type)
    }
    if (tokenContract.loaded && account && !loaded) {
      getData().then()
    }
  }, [account, collection, loaded, tokenContract])

  useEffect(() => {
    if (!collection?.version) return
    router.setContractVersion(collection.version)
    router.setContractType(collection.token_standard)
  }, [collection, router])

  return (
    <div className="p-4 dark:bg-madOnyx bg-zinc-200 rounded-2xl w-full mb-2">
      <Label
        name="payouts"
        label="Collection"
        subLabel="Payouts"
        className="mb-3 block font-bold text-2xl"
        tooltip={
          <Tooltip
            placement="bottom"
            button={<Icon icon="fa-solid:question-circle" className="text-lg ml-2" />}
          >
            <div className="mb-2 font-normal w-44">
              <h5 className="mb-2 font-bold">Your payments</h5>
              Payouts are distributed to the creators address (you), your ambassador (if applicable)
              and supporting Project (if applicable)
            </div>
          </Tooltip>
        }
      />
      <div className="mb-3">
        <Info info="You can withdraw your collections mint payments or marketplace royalties at any time." />
      </div>
      {!loaded ? (
        <Loader />
      ) : (
        <>
          <div className="flex justify-between">
            <span>Mint sales</span>
            <span>
              {balances?.erc20 - balances?.mintFee || balances?.network || 0}
              <span className="ml-2">
                {network?.currency?.erc20Symbol || network?.currency?.symbol}
              </span>
            </span>
          </div>
          {!withdrawing && balances ? (
            <Button
              colour="madPink"
              hoverColour="madBlack"
              className={`rounded-md w-full justify-center mt-4 ${
                balances.erc20 == 0 && balances.native == 0 ? 'disabled' : ''
              }`}
              onClick={() => {
                if (balances.erc20 == 0 && balances.native == 0) return
                withdrawMintFunds().then()
              }}
            >
              Withdraw mint sales
            </Button>
          ) : (
            <Loader className="py-2.5" />
          )}
          <div className="flex justify-between mt-4">
            <span>Royalty sales</span>
            <span>
              {splitterBalances?.erc20 || splitterBalances?.native || 0}
              <span className="ml-2">
                {network?.currency?.erc20Symbol || network?.currency?.symbol}
              </span>
            </span>
          </div>
          {!withdrawing && splitterBalances ? (
            <Button
              colour="madPink"
              hoverColour="madBlack"
              className={`rounded-md w-full justify-center mt-4 ${
                splitterBalances.erc20 == 0 && splitterBalances.native == 0 ? 'disabled' : ''
              }`}
              onClick={() => {
                if (splitterBalances.erc20 == 0 && splitterBalances.native == 0) return
                withdrawSplitterFunds().then()
              }}
              disabled={splitterBalances.erc20 == 0 && splitterBalances.native == 0}
            >
              Withdraw royalties
            </Button>
          ) : (
            <Loader className="py-2.5" />
          )}
        </>
      )}
    </div>
  )
}
