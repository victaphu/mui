import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { formatImageUrl } from '../../utils/utils'
import { Icon } from '@iconify/react'
import Search from './search'
import { showWallet } from '../../store/web3'
import Dropdown from '../form/dropdown'
import { getUserProfile } from '../../store/user'
import useAuth from '../../hooks/web3/auth'
import { useTheme } from 'next-themes'
import Button from '../form/button'
import Link from './link'
import ConnectButton from '../wallet/button'
import NetworkSelect from '../wallet/networkSelect'
import { createDropUpdated } from '../../store/createDrop'
import useWeb3 from '../../hooks/web3/web3'

export default function Navigation(): JSX.Element {
  // 1 - App state
  const auth = useAuth()
  const dispatch = useDispatch()
  const router = useRouter()
  const { active } = useWeb3()
  const profile = useSelector(getUserProfile)

  const { theme, setTheme } = useTheme()

  // 2 - Component state
  const [showMobileMenu, setMobileMenuOpen] = useState(false)
  const [dashboardLinks, setDashboardLinks] = useState(null)
  const [createLinks, setCreateLinks] = useState(null)
  const navLinks: Array<{
    name?: string
    pathname?: string
    external?: boolean
    onClick?: (link) => void
  }> = [
    {
      name: 'Home',
      pathname: '/'
    },
    {
      name: 'Creators',
      pathname: '/creators'
    },
    {
      name: 'Collections',
      pathname: '/collections'
    },
    {
      name: 'Marketplace',
      pathname: '/marketplace'
    },
    {
      name: 'Academy',
      pathname: '/academy'
    },
    {
      name: 'Projects',
      pathname: '/projects'
    }
  ]
  const logoutLink = [
    {
      id: '#',
      name: 'Log out',
      icon: 'fa-solid:user-alt-slash',
      callback: () => {
        auth.disconnect().then()
      }
    }
  ]

  const lightDarkModeLink = [
    theme === 'dark'
      ? {
          id: 'lightmode',
          name: 'Lightmode',
          icon: 'fa6-solid:sun',
          callback: () => {
            setTheme('light')
          }
        }
      : {
          id: 'darkmode',
          name: 'Darkmode',
          icon: 'fa6-solid:moon',
          callback: () => {
            setTheme('dark')
          }
        }
  ]
  // 4 - Local actions

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!showMobileMenu)
  }
  const navigate = (link, external = false) => {
    if (external) {
      window.open(link, '_blank').focus()
    } else {
      router.push(link).then(() => setMobileMenuOpen(false))
    }
  }

  // 3 - Data bindings

  useEffect(() => {
    if (active && profile) {
      const createNft = () => {
        dispatch(
          createDropUpdated({
            nft: {
              id: 'empty',
              token_id: '',
              owner: profile.creator_address,
              likes_boost_count: 0,
              creator: profile,
              tags: [],
              files: [],
              collection: {},
              total_supply: 1
            }
          })
        )
      }
      setDashboardLinks([
        {
          id: '/dashboard',
          name: 'My Dashboard',
          icon: 'fa6-solid:computer'
        },
        {
          id: `/account/nfts/${profile.creator_address}`,
          name: 'My NFTs',
          icon: 'fa6-solid:cubes-stacked'
        },
        {
          id: `/account/likes/${profile.creator_address}`,
          name: 'Liked NFTs',
          icon: 'fa6-solid:rocket'
        },
        {
          id: `/creator/collections/${profile.uri}`,
          name: 'My Collections',
          icon: 'fa6-solid:layer-group'
        },
        {
          id: `/creator/followers/${profile.uri}`,
          name: 'Followers',
          icon: 'fa6-solid:users'
        },
        {
          id: `/creator/following/${profile.uri}`,
          name: 'Following',
          icon: 'fa6-solid:user-plus'
        },
        {
          id: `/creator/${profile.uri}`,
          name: 'My Profile',
          icon: 'fa6-solid:user'
        },
        {
          id: `/edit-profile`,
          name: 'Edit Profile',
          icon: 'fa6-solid:user'
        }
      ])
      setCreateLinks(
        profile?.collections_count
          ? [
              {
                id: '/create',
                name: 'New NFT',
                icon: 'fa6-solid:plus',
                callback: createNft
              },
              {
                id: '/edit-collection',
                name: 'New Collection',
                icon: 'fa6-solid:plus'
              }
            ]
          : [
              {
                id: '/edit-collection',
                name: 'New Collection',
                icon: 'fa6-solid:plus'
              }
            ]
      )
    } else {
      setDashboardLinks(null)
      setCreateLinks(null)
    }
  }, [active, profile, dispatch])

  useEffect(() => {
    setTheme('dark')
  }, [setTheme])

  return (
    <nav className="flex items-center fixed top-0 bg-madWhite dark:bg-madCarbon dark:shadow-lg border-b w-full border-zinc-800 z-20 h-[72px]">
      <div className="w-full mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex items-center space-x-3 md:w-3/5 justify-start">
            <Link href={'/'}>
              <img alt="MADNFTs" src="/logo.svg" className="h-10 mr-0 lg:hidden" />
            </Link>
            <Button
              onClick={toggleMobileMenu}
              colour="madBlack"
              hoverColour="madWhite"
              darkColour="madWhite"
              darkHoverColour="madBlack"
              className="lg:hidden"
            >
              <Icon
                icon={showMobileMenu ? 'fa:close' : 'fa6-solid:bars'}
                className="my-1 mx-auto w-3 h-4"
              />
            </Button>
            <div className="hidden lg:flex items-center space-x-1 font-black">
              <img alt="MADNFTs" src="/logo.svg" className="h-10 mr-2" />
              {navLinks.map((link, i) => (
                <button
                  key={i * 1.233}
                  onClick={() => {
                    if (link.onClick) {
                      link.onClick(link)
                    } else {
                      navigate(link.pathname, !!link.external)
                    }
                  }}
                  className={
                    router.pathname == link.pathname
                      ? `py-4 px-2 text-madPink border-b-4 pt-5 border-madPink font-black`
                      : `py-4 px-2 font-black hover:text-madPink transition duration-300`
                  }
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-3 md:w-2/5 justify-end">
            <Search name="search" placeholder="Search collections and creators..." />
            {createLinks && (
              <Dropdown
                className="dark:border-madPink light:border-madPink dark:text-white hover:dark:text-madPink"
                wrapperClassName="mb-0"
                name="create-select"
                placeholder="CREATE"
                selectOptions={createLinks}
                onChange={(value) => {
                  if (value.callback) {
                    value.callback()
                  }
                  navigate(value.id.toString())
                }}
                placeholderTemplate={(placeholder) => (
                  <>
                    <Icon icon="fa6-solid:plus" className="text-madPink w-8 p-0.5 lg:w-auto" />
                    <span className="hidden ml-2 lg:inline">{placeholder}</span>
                  </>
                )}
                selectOptionsTemplate={(unit) => (
                  <>
                    {unit && (
                      <div>
                        <Icon icon={unit.icon} className="mr-2 w-4" />
                        {unit.name}
                      </div>
                    )}
                  </>
                )}
              />
            )}
            {dashboardLinks && (
              <Dropdown
                wrapperClassName="mb-0"
                className="pl-0 overflow-hidden dark:border-madPink light:border-madPink dark:text-white hover:dark:text-madPink"
                name="dashboard-select"
                placeholder={profile?.public_name}
                selectOptions={[...dashboardLinks, ...logoutLink, ...lightDarkModeLink]}
                returnObject={true}
                onChange={(value) => {
                  if (value.callback) {
                    value.callback()
                  } else {
                    navigate(value.id.toString())
                  }
                }}
                placeholderTemplate={() => (
                  <>
                    {profile && (
                      <>
                        <img
                          src={formatImageUrl(profile.img_avatar)}
                          className="w-10 h-10 rounded-full"
                          alt="Profile image"
                        />
                        <span className="hidden sm:block ml-2">{profile.public_name}</span>
                      </>
                    )}
                  </>
                )}
                selectOptionsTemplate={(unit) => (
                  <>
                    {unit && (
                      <div>
                        <Icon icon={unit.icon} className="mr-2 w-5" />
                        {unit.name}
                      </div>
                    )}
                  </>
                )}
              />
            )}
            {profile ? (
              <Button
                colour="madBlue"
                hoverColour="madPink"
                darkColour="transparent"
                darkHoverColour="madPink"
                className="border-none p-0 sm:p-0 hover:bg-transparent"
                onClick={() => {
                  dispatch(showWallet())
                }}
              >
                <Icon icon="fa6-solid:wallet" className="my-1.5 h-10 w-6" />
              </Button>
            ) : (
              <ConnectButton />
            )}
            <NetworkSelect dropdownClassName="dropdown-menu-right" />
          </div>
        </div>
      </div>

      {/* <!-- mobile menu --> */}
      <div
        className={`lg:hidden fixed top-[72px] left-0 right-0 bottom-0 dark:bg-madOnyx bg-madWhite transition-opacity duration-300 flex opacity-0 ${
          !showMobileMenu ? 'pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="bg-[url('/bg-dots.png')] bg-repeat bg-center absolute top-0 left-0 right-0 bottom-0 opacity-20" />
        <ul className="text-center max-w-[400px] m-auto text-4xl relative">
          {navLinks.map((link, i) => (
            <li key={i}>
              <button
                onClick={() => {
                  if (link.onClick) {
                    link.onClick(link)
                    setMobileMenuOpen(false)
                  } else {
                    navigate(link.pathname)
                  }
                }}
                className={
                  router.pathname == link.pathname
                    ? `py-2 px-2 text-madPink font-black`
                    : 'py-2 px-2 dark:text-dark-madWhite text-light-madWhite font-black'
                }
              >
                {link.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
