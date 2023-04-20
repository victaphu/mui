// @typed - MH
export default function Info({
  info,
  className = 'text-sm text-gray-700 block mb-1 -mt-1'
}: {
  info?: string
  className?: string
}): JSX.Element {
  return <>{info ? <span className={className}>{info}</span> : null}</>
}
