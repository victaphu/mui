import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import useCrudObjectApi from '../../hooks/api/crudObject'
import { useSelector } from 'react-redux'
import { getUser } from '../../store/user'
import Link from '../common/link'
import { AcademyItem } from '../../types/academy'
import useClient from '../../hooks/client'

const AcademyNav = ({ academyItem }: { academyItem?: AcademyItem }): JSX.Element => {
  const user = useSelector(getUser)
  const { getData } = useCrudObjectApi()
  const [categories, setCategories] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [showFilter, setShowFilter] = useState({})
  const client = useClient()
  const showFiltersHandle = (key: string) => {
    const filtersShown = { ...showFilter }
    filtersShown[key] = !filtersShown[key]
    setShowFilter(filtersShown)
  }
  useEffect(() => {
    if (!loaded && client) {
      getData('academy/categories', null, true)
        .then((data) => {
          setCategories(data.data.data)
          setLoaded(true)
        })
        .catch(() => setLoaded(true))
    }
  })
  useEffect(() => {
    if (academyItem && !showFilter[academyItem.category]) {
      showFiltersHandle(academyItem.category)
    }
  })
  return (
    <>
      {categories.length > 1 &&
        categories.map((cat, index) => (
          <>
            <div
              key={index}
              className="cursor-pointer flex justify-between items-center border-b border-zinc-800 px-5 py-3"
              onClick={() => {
                showFiltersHandle(cat.id)
              }}
            >
              <span className="uppercase text-sm">{cat.title}</span>
              <Icon
                icon={`${showFilter[cat.id] ? 'fa6-solid:chevron-up' : 'fa6-solid:chevron-down'}`}
                className="w-4 text-madPink"
              />
            </div>
            {showFilter[cat.id] && (
              <div className="flex flex-col border-b border-zinc-800 text-sm">
                {cat.items.map((item, subIndex) => (
                  <Link
                    key={subIndex}
                    href={`/academy/${item.id}`}
                    className={`flex items-center border-b border-zinc-800 px-5 py-3 ${
                      academyItem?.id === item.id ? 'text-madWhite animate-pulse' : 'text-madGray'
                    }`}
                  >
                    <Icon
                      icon={
                        user?.videos &&
                        user.videos.filter((a) => a.academy_item_id === item.id && a.status === 1)
                          .length
                          ? 'fa6-solid:pause'
                          : 'fa6-solid:check'
                      }
                      className={`w-6 h-6 mr-4 rounded-full p-1.5 ${
                        user?.videos &&
                        user.videos.filter((a) => a.academy_item_id === item.id && a.status === 2)
                          .length
                          ? 'bg-madPink text-madBlack'
                          : 'bg-madBlack'
                      }`}
                    />
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </>
        ))}
    </>
  )
}
export default AcademyNav
