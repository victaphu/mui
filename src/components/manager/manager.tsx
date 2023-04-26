import React, { useEffect, useState } from 'react'
import Button from '../form/button'
import Input from '../form/input'
import useRouter from '../../hooks/web3/router'
import { collectionTypes, contractVersions } from '../../constants/config'
import Dropdown from '../form/dropdown'
import { Icon } from '@iconify/react'
import { useSelector } from 'react-redux'
import { getUserProfile } from '../../store/user'
import useWeb3 from '../../hooks/web3/web3'

const Manager = (): JSX.Element => {
  const [contractVersion, setContractVersion] = useState<'0.9' | '1.0' | ''>('')
  const [contractType, setContractType] = useState<string>('')
  const [currentMintFee, setCurrentMintFee] = useState<string>('')
  const [mintFee, setMintFee] = useState<string>('')
  const [error, setError] = useState<boolean>(false)
  const router = useRouter()
  const profile = useSelector(getUserProfile)
  const { account } = useWeb3()

  const submitMintFee = async () => {
    await router.setMintFees(account, mintFee, '0')
  }

  useEffect(() => {
    if (!contractVersion || !contractType) return
    router.setContractVersion(contractVersion as '0.9' | '1.0')
    router.setContractType(contractType)
    if (router.contractRouter?.methods && !error) {
      router
        .getMintFee()
        .then((a) => (a.response ? setCurrentMintFee(a.response) : null))
        .catch((e) => setError(e))
    }
  }, [router, contractType, contractVersion, mintFee, error])

  return (
    <section className="mt-2 bg-madOnyx rounded-xl p-4 flex flex-col justify-between">
      <div className="flex items-center">
        <Icon icon="fa:cog" className={`mr-1 text-xl text-${profile?.description_color}`} />
        <h6 className="font-bold text-xl">
          Marketplace <span className={`text-${profile?.description_color}`}>Settings</span>.
        </h6>
      </div>
      <div className="flex ml-auto">
        <Dropdown
          name="type"
          placeholder="Select standard"
          value={contractType || ''}
          required={true}
          nullable={false}
          onChange={(obj) => {
            setContractType(obj.id.toString())
          }}
          selectOptions={collectionTypes}
          wrapperClassName="mr-2"
        />
        <Dropdown
          name="type"
          placeholder="Select version"
          value={contractVersion}
          required={true}
          nullable={false}
          onChange={(obj) => {
            const opt = obj.id.toString() === '0.9' ? '0.9' : '1.0'
            setContractVersion(opt)
          }}
          selectOptions={contractVersions}
        />
      </div>
      {contractType && contractVersion && (
        <div>
          <div className="text-sm mb-2">
            Mint fee <span className="text-madGray">{currentMintFee}</span>
          </div>
          <div className="flex gap-2">
            <Input
              name="mintFee"
              type="number"
              value={mintFee}
              onChange={(value) => setMintFee(value.toString())}
            />
            <Button onClick={submitMintFee} colour="madBlue" hoverColour="madBlack">
              Update mint fee
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
export default Manager
