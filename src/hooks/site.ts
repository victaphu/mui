import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUxSite, uxAdded } from '../store/ux'
import { useRouter } from 'next/router'

export default function useSite() {
  const dispatch = useDispatch()
  const router = useRouter()
  const currentSiteId = useSelector(getUxSite)
  const [site, setSite] = useState<{
    id: number
    preName: string
    name: string
    image: string
    color: string
  }>(null)
  const [siteColor, setSiteColor] = useState('madPink')
  const [siteLinks, setSiteLinks] = useState(null)
  useEffect(() => {
    const links = [
      {
        id: 1,
        preName: 'MAD',
        name: 'NFT',
        image: '/logo-nft.svg',
        color: 'madPink'
      },
      {
        id: 2,
        preName: 'MAD',
        name: 'META',
        image: '/logo-meta.svg',
        color: 'madMeta'
      },
      {
        id: 3,
        preName: 'MAD',
        name: 'MUSIC',
        image: '/logo-music.svg',
        color: 'madYellow'
      },
      {
        id: 4,
        preName: 'MAD',
        name: 'X',
        image: '/logo-x.svg',
        color: 'madGreen'
      },
      {
        id: 5,
        preName: 'MAD',
        name: 'NFT',
        image: '/logo-nft.svg',
        color: 'madPink',
        hidden: true
      }
    ]
    const siteFound = links.filter((a) => a.id === currentSiteId)
    const colour = siteFound.length ? siteFound[0].color : null
    setSite(siteFound[0])
    setSiteColor(colour)
    setSiteLinks(links)
    if (router.pathname !== '/' && currentSiteId !== 1) {
      dispatch(uxAdded({ key: 'site', value: 1 }))
    }
  }, [currentSiteId, dispatch, router])
  return {
    site,
    siteLinks,
    siteColor
  }
}
