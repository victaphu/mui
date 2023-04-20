// @typed v1
import React from 'react'
import useCrudObjectApi from '../../hooks/api/crudObject'
import Button from '../form/button'
import Loader from './loader'
import { Attribute } from '../../types/nft'
import { domain } from '../../constants/domain'
import useToaster from '../../hooks/toast'

const Download = ({ file, className }: { file: Attribute; className?: string }): JSX.Element => {
  const { putData, dataLoading } = useCrudObjectApi()
  const toaster = useToaster()
  const download = async () => {
    if (dataLoading) return
    const response = await putData(`download`, file, true)
    if (!response.data.url) {
      toaster.error(
        'Download failed',
        'We could not generate a download link for this asset please try again later.'
      )
    }
    toaster.success('Download ready', 'Your download will start automatically.')
    const win = window.open(domain.downloadPrefix + response.data.url, '_blank')
    if (win) win.focus()
  }
  return (
    <Button
      colour="madGray"
      hoverColour="madBlack"
      className={`m-auto ${className}`}
      onClick={download}
    >
      {dataLoading ? (
        <>
          <Loader className="w-10 h-4 p-0 flex justify-center" imgClassName="w-4 h-4 p-0" />{' '}
          Downloading
        </>
      ) : (
        'Download'
      )}
    </Button>
  )
}
export default Download
