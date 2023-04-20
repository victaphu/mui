// @typed - MH
import { Icon } from '@iconify/react'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import Label from './label'
import Info from './info'
import Loader from '../common/loader'
import { DataListFilter } from '../../types/dataListFilter'
import { domain } from '../../constants/domain'
import useClient from '../../hooks/client'
import { useSelector } from 'react-redux'
import { getCurrentNetwork } from '../../store/web3'
import { shallowEqual } from '../../utils/utils'

export default function Dropdown({
  name,
  onChange,
  label,
  placeholder,
  value,
  required = false,
  disabled = false,
  nullable = true,
  showClear = false,
  returnObject = false,
  info,
  selectOptions,
  selectOptionsRemote,
  selectOptionsRemoteId,
  selectOptionsRemoteName,
  selectOptionsRemoteConfig,
  selectOptionsTemplate,
  placeholderTemplate,
  valueTemplate,
  wrapperClassName = 'mb-1',
  className,
  dropdownClassName,
  itemClassName = 'dropdown-item flex justify-between items-center py-1 px-4 font-normal w-full whitespace-nowrap bg-transparent hover:text-madPink dark:hover:bg-madOnyx hover:bg-gray-200',
  tooltip,
  checkIconTemplate
}: {
  name: string
  onChange: (
    obj: { id: string | number; name: string; callback?: (value?) => void },
    previousValue?: DataListFilter
  ) => void
  label?: string
  placeholder?: string
  value?: string | number
  required?: boolean
  disabled?: boolean
  nullable?: boolean
  showClear?: boolean
  returnObject?: boolean
  info?: string
  selectOptions?: Array<{
    id: string | number
    name: string
    callback?: () => void
    spacer?: boolean
    hidden?: boolean
  }>
  selectOptionsRemote?: string
  selectOptionsRemoteId?: string
  selectOptionsRemoteName?: string
  selectOptionsRemoteConfig?: { params }
  selectOptionsTemplate?: (unit) => React.ReactNode | React.ReactNode[]
  placeholderTemplate?: (
    placeholder: string,
    exposed: boolean
  ) => React.ReactNode | React.ReactNode[]
  valueTemplate?: (unit) => React.ReactNode | React.ReactNode[]
  className?: string
  wrapperClassName?: string
  dropdownClassName?: string
  itemClassName?: string
  tooltip?: ReactNode
  checkIconTemplate?: (unit) => React.ReactNode | React.ReactNode[]
}): JSX.Element {
  const client = useClient()
  const network = useSelector(getCurrentNetwork)
  const [remoteOptions, setRemoteOptions] = useState<{ params }>({ params: null })
  const [loading, setLoading] = useState(false)
  const [exposed, setExposed] = useState(false)
  const [options, setOptions] =
    useState<Array<{ id: string | number; name: string; hidden?: boolean; spacer?: boolean }>>(null)
  const [remoteData, setRemoteData] = useState(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const getName = (id: string | number) => {
    const found = options.find((a) => id === a.id)
    return found ? found.name : ''
  }
  const getObject = (id: string | number) => {
    const found = remoteData ? remoteData.find((a) => id === a.id) : null
    return found ? found : null
  }
  const onSelect = (option: {
    id: string | number
    name: string
    previousValue?: DataListFilter
  }) => {
    setExposed(false)
    if (returnObject) {
      onChange(getObject(option.id), option.previousValue)
    } else {
      onChange(option, option.previousValue)
    }
  }

  useEffect(() => {
    setRemoteData([])
    setLoading(false)
    setOptions(null)
    setRemoteOptions({ params: null })
  }, [network])

  useEffect(() => {
    if (network && client && selectOptionsRemote && !options && !loading) {
      if (shallowEqual(selectOptionsRemoteConfig.params, remoteOptions.params)) {
        return
      }
      setLoading(true)
      client
        .get(`${domain.apiUrl}${selectOptionsRemote}`, selectOptionsRemoteConfig)
        .then((response) => {
          const optionsFormatted = []
          response.data.data.map((p) => {
            optionsFormatted.push({
              id: p[selectOptionsRemoteId],
              name: p[selectOptionsRemoteName]
            })
          })
          setRemoteData(response.data.data)
          setOptions(optionsFormatted)
          setLoading(false)
          if (value) {
            const found = response.data.data.filter((a) => a.id === value)
            if (!found) {
              onChange(null)
            }
          }
          setRemoteOptions(selectOptionsRemoteConfig)
        })
    } else if (!selectOptionsRemote) {
      setLoading(false)
      setOptions(selectOptions)
      setRemoteData(selectOptions)
    }
  }, [
    network,
    client,
    options,
    value,
    loading,
    selectOptions,
    selectOptionsRemote,
    selectOptionsRemoteConfig,
    selectOptionsRemoteId,
    selectOptionsRemoteName,
    onChange,
    remoteOptions
  ])

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        exposed &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        btnRef.current &&
        !btnRef.current.contains(event.target) &&
        labelRef.current &&
        !labelRef.current.contains(event.target)
      ) {
        setExposed(false)
        event.preventDefault()
        event.stopPropagation()
      }
    }
    if (exposed && btnRef.current) {
      btnRef.current.focus()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [exposed, menuRef, btnRef])

  return (
    <div className={wrapperClassName}>
      <div
        ref={labelRef}
        onClick={() => {
          if (!disabled) {
            setExposed(!exposed)
          }
        }}
      >
        <Label tooltip={tooltip} name={name} label={label} required={required} />
      </div>
      <Info info={info} />
      <div className={`dropdown relative ${disabled ? 'disabled' : ''}`}>
        {value && nullable && showClear && (
          <button
            onClick={() => {
              onSelect({ id: null, name: null, previousValue: getObject(value) })
              setExposed(false)
            }}
            className="absolute text-xs top-1.5 bottom-1 left-1 rounded pr-1 dark:bg-madOnyx bg-madWhite"
          >
            <Icon icon="fa:close" className="ml-3 text-madPink" />
          </button>
        )}
        <button
          ref={btnRef}
          className={`h-10 whitespace-nowrap flex justify-between items-center w-full px-4 py-2 text-gray-500 dark:bg-madOnyx bg-madWhite border border-madGray rounded-full focus:border-madPink focus:outline-none focus:ring focus:ring-madPink dark:focus:text-dark-madWhite ${className}`}
          type="button"
          id={`dropdown-${name}`}
          data-bs-toggle="dropdown"
          aria-expanded={exposed}
          disabled={disabled}
          onClick={() => setExposed(!exposed)}
        >
          {options && value && (valueTemplate ? valueTemplate(getObject(value)) : getName(value))}
          {options &&
            value &&
            !valueTemplate &&
            selectOptionsTemplate &&
            selectOptionsTemplate(getObject(value))}
          {!value &&
            placeholder &&
            (placeholderTemplate ? placeholderTemplate(placeholder, exposed) : placeholder)}
          {!placeholderTemplate && !valueTemplate && (
            <Icon
              icon={exposed ? 'fa6-solid:chevron-up' : 'fa6-solid:chevron-down'}
              className="ml-2"
            />
          )}
        </button>
        {!loading ? (
          <ul
            ref={menuRef}
            className={`${
              exposed ? '' : 'hidden'
            } text-md overflow-hidden dropdown-menu min-w-full absolute dark:bg-madCarbon bg-madWhite z-50 py-2 list-none shadow-md dark:shadow-black/50 m-0 bg-clip-padding ${dropdownClassName}`}
            aria-labelledby={`dropdown-${name}`}
          >
            {value && nullable && (
              <li>
                <button
                  onClick={() =>
                    onSelect({ id: null, name: null, previousValue: getObject(value) })
                  }
                  className={itemClassName}
                >
                  <span className="text-gray-700">Remove selection</span>{' '}
                  <Icon icon="fa:close" className="ml-2 text-gray-700" />
                </button>
              </li>
            )}
            {!options?.length && <li className="px-4 text-gray-700">No items found</li>}
            {options &&
              options.map((option, i) => (
                <li key={i} value={option.id} className={`${option.hidden ? 'hidden' : ''}`}>
                  {option.spacer ? (
                    <div className={`border-t border-zinc-700 pt-2 mt-2 mx-4`} />
                  ) : (
                    <button onClick={() => onSelect(option)} className={itemClassName}>
                      {selectOptionsTemplate ? (
                        <>
                          {selectOptionsTemplate(getObject(option.id))}
                          {option.id === value && checkIconTemplate && checkIconTemplate(option)}
                          {option.id === value && !checkIconTemplate && (
                            <Icon icon="fa-solid:check-circle" className="ml-2 text-madPink" />
                          )}
                        </>
                      ) : (
                        <>
                          {option.name}
                          {option.id === value && checkIconTemplate && checkIconTemplate(option)}
                          {option.id === value && !checkIconTemplate && (
                            <Icon icon="fa-solid:check-circle" className="ml-2 text-madPink" />
                          )}
                        </>
                      )}
                    </button>
                  )}
                </li>
              ))}
          </ul>
        ) : (
          <div className="absolute bg-opacity-50 top-0 left-0 right-0 bottom-0 flex items-center">
            <Loader />
          </div>
        )}
      </div>
    </div>
  )
}
