import { useEffect } from 'react'
import { useRouter } from 'next/router'

const AcademyIndexPage = (): JSX.Element => {
  const router = useRouter()
  useEffect(() => {
    router.push('/academy/start').then()
  })
  return null
}
export default AcademyIndexPage
