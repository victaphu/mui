// @typed - MH
import useToaster from '../../hooks/toast'

export default function Copy({
  text,
  copy,
  success = 'Text copied',
  error = 'Failed to copy',
  className
}: {
  text: JSX.Element | JSX.Element[] | string
  copy?: string
  success?: string
  error?: string
  className?: string
}): JSX.Element {
  const toaster = useToaster()
  const copyClick = async () => {
    try {
      await navigator.clipboard.writeText(copy || text.toString())
      toaster.success(null, success)
    } catch (err) {
      toaster.error(null, error)
    }
  }
  return (
    <span className={`cursor-pointer ${className}`} onClick={copyClick}>
      {text}
    </span>
  )
}
