import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeNetwork, getCurrentNetwork } from '../../store/web3'
import { requestNetworkChange } from '../../utils/network'
import { networkDefault, networksVisible } from '../../constants/network'
import Dropdown from '../form/dropdown'
import { Network } from '../../types/network'
import useWeb3 from '../../hooks/web3/web3'

export default function NetworkSelect({
  dropdownClassName
}: {
  dropdownClassName?: string
}): JSX.Element {
  const [calcCurrentNetwork, setCalcCurrentNetwork] = useState<Network>(null)
  const currentNetwork = useSelector(getCurrentNetwork)
  const dispatch = useDispatch()
  const { library } = useWeb3()

  useEffect(() => {
    setCalcCurrentNetwork(
      networksVisible.find((a) => a.id === currentNetwork?.id) || networkDefault
    )
  }, [currentNetwork])

  return (
    <>
      {networksVisible && calcCurrentNetwork && (
        <Dropdown
          className={`px-[0px] overflow-hidden border-transparent`}
          wrapperClassName="mb-0"
          dropdownClassName={dropdownClassName}
          name="dashboard-select"
          value={calcCurrentNetwork?.id}
          selectOptions={networksVisible}
          returnObject={true}
          nullable={false}
          onChange={(a) => {
            console.log("Library setup what's happening now?", library)
            if (library && library?.provider) {
              requestNetworkChange(library.provider, a).then()
            } else {
              dispatch(changeNetwork(a))
            }
          }}
          placeholderTemplate={() => (
            <>
              {networkDefault && (
                <div className="flex items-center justify-start text-left">
                  <img
                    src={networkDefault.icon}
                    className="w-10 h-10 rounded-full mr-2"
                    alt="Profile image"
                  />
                  <span className="w-[210px] mr-auto">{networkDefault.label}</span>
                </div>
              )}
            </>
          )}
          selectOptionsTemplate={(unit) => (
            <>
              {unit && (
                <div className="flex items-center justify-start text-left">
                  <img
                    src={unit.icon}
                    className="w-10 h-10 rounded-full mr-2"
                    alt="Profile image"
                  />
                  <span className="w-[210px] mr-auto">{unit.label}</span>
                </div>
              )}
            </>
          )}
          valueTemplate={(unit) => (
            <>
              {unit && (
                <>
                  <img src={unit.icon} className="w-10 h-10 rounded-full" alt="Profile image" />
                </>
              )}
            </>
          )}
        />
      )}
    </>
  )
}
