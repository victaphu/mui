import * as querystring from 'querystring'
import { contractErrorMap } from '../constants/error'
import { domain } from '../constants/domain'
import { collectionCategories } from '../constants/content'

export const trimAddress = (string) => {
  return string ? `${string.substr(0, 4)}..${string.substr(-4)}` : ''
}

export const getCategoryProp = (prop, id) => {
  const found = collectionCategories.find((cat) => cat?.id?.toString() === id?.toString())
  return found ? found[prop] : null
}

export const formatImageUrl = (hashWithPrefix: string, width?: number, height?: number) => {
  // we multiply dimensions for 2x displays so we can pass in natural dimensions
  const params = []
  if (width) {
    params['img-width'] = (width * 2).toFixed(0)
  }
  if (height) {
    params['img-height'] = (height * 2).toFixed(0)
  }
  // @ts-ignore
  const searchParams = querystring.stringify(params)
  let formatted = hashWithPrefix?.replace(domain.ipfsSavePrefix, domain.ipfsReadUrl)
  formatted = formatted?.replace('mad://', domain.ipfsReadUrl)
  return width || height ? formatted + '?' + searchParams : formatted
}

export const formatTokenUri = (uri: string, contractId: string) => {
  return uri
    ?.replace(domain.ipfsSavePrefix, domain.ipfsReadUrl)
    .replace(domain.madSavePrefix, domain.madReadUrl + contractId + '/')
}

export const formatContractError = (id): string => {
  let message = null
  const idFormatted = id?.message || id
  if (idFormatted) {
    contractErrorMap.forEach((value) => {
      if (idFormatted.indexOf(value.id) !== -1) {
        message = value.name
      }
    })
  }
  return message || id?.message || id
}

export const abbreviateNumber = (number: number) => {
  const symbols = ['', 'k', 'M', 'G', 'T', 'P', 'E']
  const tier = (Math.log10(Math.abs(number)) / 3) | 0

  if (number < 1) {
    return parseFloat((number || '0').toString())
  }

  if (!number) {
    return parseFloat((number || '0').toString()).toFixed(0)
  }

  if (tier == 0) {
    return parseFloat(number.toString())
  }
  const suffix = symbols[tier]
  const scale = Math.pow(10, tier * 3)
  const scaled = number / scale
  return parseFloat(scaled.toFixed(1)) + suffix
}

export const formatDate = (date: string, time = false) => {
  const newDate = new Date(date),
    month = newDate.toLocaleString('default', { month: 'short' }),
    day = newDate.toLocaleString('default', { day: 'numeric' }),
    year = newDate.getFullYear(),
    hour = newDate.toLocaleString('default', { hour: '2-digit' }),
    minute = newDate.toLocaleString('default', { minute: '2-digit' }),
    second = newDate.toLocaleString('default', { second: '2-digit' })

  return (
    day +
    ' ' +
    month +
    ' ' +
    year +
    (time
      ? ' ' + hour.padStart(2, '0') + ':' + minute.padStart(2, '0') + ':' + second.padStart(2, '0')
      : '')
  )
}

export const formatTimeSince = (date) => {
  // @ts-ignore
  const seconds = Math.floor((new Date() - date) / 1000)

  let interval = seconds / 31536000

  if (interval > 1) {
    return Math.floor(interval) + ' years'
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + ' months'
  }
  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + ' days'
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + ' hours'
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + ' minutes'
  }
  return Math.floor(seconds) + ' seconds'
}

export const trimSentence = (string: string, maxLength: number, dots?: boolean) => {
  const trimmedString = string ? string.substr(0, maxLength) : ''
  return (
    trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' '))) +
    (dots && string.length >= maxLength ? ' ...' : '')
  )
}

export const shallowEqual = (object1, object2) => {
  if (!object1 || !object2) return false
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)
  if (keys1.length !== keys2.length) {
    return false
  }
  for (const key of keys1) {
    if (object1[key] !== object2[key]) {
      return false
    }
  }
  return true
}
