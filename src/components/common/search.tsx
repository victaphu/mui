import React, { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import client from '../../utils/client'
import Loader from './loader'
import { useRouter } from 'next/router'
import { formatImageUrl } from '../../utils/utils'
import { domain } from '../../constants/domain'
import Button from '../form/button'

export default function Search({
  placeholder,
  name,
  className
}: {
  placeholder: string
  name: string
  className?: string
}): JSX.Element {
  const router = useRouter()
  const inputRef = useRef(null)
  const [showSearchMenu, setSearchMenuOpen] = useState(false)
  const [searchText, setSearchText] = useState(null)
  const [creators, setCreators] = useState(null)
  const [creatorsLoading, setCreatorsLoading] = useState(false)
  const [collections, setCollections] = useState(null)
  const [collectionsLoading, setCollectionsLoading] = useState(false)

  const toggleSearchMenu = () => {
    if (!showSearchMenu) {
      inputRef.current.focus()
    }
    setSearchMenuOpen(!showSearchMenu)
  }

  const onChange = (event) => {
    setSearchText(event.target.value)
  }

  const navigate = (link) => {
    router.push(link).then(() => setSearchMenuOpen(false))
  }

  useEffect(() => {
    const fetchResults = () => {
      setCollectionsLoading(true)
      setCreatorsLoading(true)
      client
        .get(`${domain.apiUrl}/collections`, { params: { per_page: 5, search: searchText } })
        .then((a) => {
          setCollections(a.data.data)
          setCollectionsLoading(false)
        })
      client
        .get(`${domain.apiUrl}/creators`, { params: { per_page: 5, search: searchText } })
        .then((a) => {
          setCreators(a.data.data)
          setCreatorsLoading(false)
        })
    }
    if (showSearchMenu && searchText) {
      fetchResults()
    }
  }, [searchText, showSearchMenu])

  return (
    <>
      <Button onClick={toggleSearchMenu} colour="madWhite" hoverColour="madBlack">
        <Icon
          icon={showSearchMenu ? 'fa:close' : 'fa-solid:search'}
          className="my-1 mx-auto w-3 h-4"
        />
      </Button>
      <div
        className={`fixed top-[72px] right-0 bottom-0 dark:bg-madOnyx bg-madWhite transition-opacity duration-300 flex opacity-0 w-full ${
          !showSearchMenu ? 'pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="bg-[url('/bg-dots.png')] bg-repeat bg-center absolute top-0 left-0 right-0 bottom-0 opacity-20" />
        <div className="relative m-auto p-5 w-full h-full overflow-auto max-w-[600px]">
          <input
            ref={inputRef}
            type="text"
            id={name}
            placeholder={placeholder}
            onChange={onChange}
            className={
              className ??
              'px-4 py-2 w-full text-gray-500 dark:bg-madCarbon bg-madWhite border border-gray-500 rounded-full focus:border-madPink focus:outline-none focus:ring focus:ring-madPink dark:focus:text-dark-madWhite focus:text-light-madWhite'
            }
          />
          <div>
            {(searchText || collections) && (
              <h6 className="text-madPink my-4 font-black text-center">
                <Icon icon="fa6-solid:layer-group" className="w-6 mr-1" />
                Collections
              </h6>
            )}
            {collectionsLoading && (
              <div className="font-light w-full flex items-center justify-between my-1 dark:bg-madCarbon bg-madWhite p-3 rounded-full">
                <Loader />
              </div>
            )}
            {collections && !collectionsLoading
              ? collections.map((collection) => (
                  <button
                    onClick={() => navigate(`/collection/${collection.contract_id}`)}
                    key={collection.id}
                    className="w-full flex items-center justify-between my-1 dark:bg-madCarbon bg-madWhite p-1 rounded-full border-4 border-madCarbon duration-300 hover:border-madPink"
                  >
                    <div
                      className={`overflow-hidden shrink-0 mr-2 rounded-full flex items-center w-14 h-14 border border-${collection.category_icon_color}`}
                    >
                      <img
                        src={formatImageUrl(collection.img_avatar, 200, 200)}
                        className={`rounded-full mr-2 object-cover`}
                        alt={collection.name}
                      />
                    </div>
                    <div className="flex flex-col mr-auto">
                      <p className="text-left">{collection.name}</p>
                      <div className="stats flex justify-evenly">
                        <div className="flex items-center text-madGray mr-2">
                          <Icon
                            icon="fa6-solid:layer-group"
                            className="fa-solid fa-people-group mr-1"
                          />
                          <p>{collection.nfts_count}</p>
                        </div>
                        <div className="flex items-center text-madGray mr-2">
                          <Icon
                            icon="fa6-solid:people-group"
                            className="fa-solid fa-people-group mr-1"
                          />
                          <p>0</p>
                        </div>
                        <div className="flex items-center text-madGray mr-2">
                          <Icon
                            icon="fa6-solid:arrow-down-short-wide"
                            className="fa-solid fa-arrow-down-short-wide mr-1"
                          />
                          <p>0</p>
                        </div>
                        <div className="flex items-center text-madGray mr-2">
                          <Icon
                            icon="fa6-solid:chart-simple"
                            className="fa-solid fa-chart-simple mr-1"
                          />
                          <p>0</p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              : null}
            {collections && !collections.length && !collectionsLoading ? (
              <div className="font-light w-full flex items-center justify-between my-1 dark:bg-madCarbon bg-madWhite p-3 rounded-full">
                No matching collections
              </div>
            ) : null}
          </div>

          <div>
            {(searchText || collections) && (
              <h6 className="text-madPink my-4 font-black text-center">
                <Icon icon="fa-solid:portrait" className="w-6 mr-1" />
                Creators / Accounts
              </h6>
            )}
            {creatorsLoading && (
              <div className="font-light w-full flex items-center justify-between my-1 dark:bg-madCarbon bg-madWhite p-3 rounded-full">
                <Loader />
              </div>
            )}
            {creators && !creatorsLoading
              ? creators.map((creator) => (
                  <button
                    onClick={() => navigate(`/creator/${creator.uri}`)}
                    key={creator.id}
                    className="w-full flex items-center justify-between my-1 dark:bg-madCarbon bg-madWhite p-1 rounded-full border-4 border-madCarbon duration-300 hover:border-madPink"
                  >
                    <div
                      className={`overflow-hidden shrink-0 mr-2 rounded-full flex items-center w-14 h-14 border border-${creator.description_color}`}
                    >
                      <img
                        src={formatImageUrl(creator.img_avatar, 200, 200)}
                        className={`rounded-full mr-2 object-cover`}
                        alt={creator.public_name}
                      />
                    </div>
                    <div className="flex flex-col mr-auto">
                      <p className="text-left">
                        {!!creator.verified && (
                          <Icon
                            icon="fa6-solid:trophy"
                            className={`w-4 mr-2 text-${creator.description_color}`}
                          />
                        )}
                        {(!!creator.wp_id || creator.wp_id == 0) && (
                          <Icon
                            icon="fa6-solid:crown"
                            className={`w-4 mr-2 text-${creator.description_color}`}
                          />
                        )}
                        {creator.public_name}
                      </p>
                    </div>
                  </button>
                ))
              : null}
            {creators && !creators.length && !creatorsLoading ? (
              <div className="font-light w-full flex items-center justify-between my-1 dark:bg-madCarbon bg-madWhite p-3 rounded-full">
                No matching accounts
              </div>
            ) : null}
          </div>

          <div>
            {!searchText && !collections && <div className="m-4 text-center">Start typing ...</div>}
          </div>
        </div>
      </div>
    </>
  )
}
