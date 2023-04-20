import React, { useEffect, useState } from 'react'
import Link from './link'
import { Icon } from '@iconify/react'
import ScrollToTop from 'react-scroll-to-top'
import CookieConsent from 'react-cookie-consent'
import { useSelector } from 'react-redux'
import { getSidebarOpen } from '../../store/ux'
import { useRouter } from 'next/router'

export default function Footer() {
  const [email, setEmail] = useState('')
  const sidebarIsOpen = useSelector<boolean>(getSidebarOpen)
  const router = useRouter()
  const [hasSidebar, setHasSidebar] = useState<boolean>(true)
  useEffect(() => {
    if (router && router?.pathname == '/') {
      setHasSidebar(false)
    } else {
      setHasSidebar(true)
    }
  }, [router])

  return (
    <div
      className={`relative p-4 ${
        hasSidebar ? (!sidebarIsOpen ? `md:ml-[70px]` : 'ml-[375px] lg:ml-[420px]') : 'w-full'
      }`}
    >
      <footer className="relative dark:bg-madBlack bg-madWhite flex flex-col text-sm font-normal border-t border-zinc-600">
        <ScrollToTop
          smooth
          className={`shadow shadow-madOnyx rounded rounded-full dark:bg-madBlack bg-madWhite dark:border-gray-700 text-madGray w-10 h-10 fixed bottom-4 ${
            !sidebarIsOpen ? 'left-3.5' : 'left-4'
          }`}
          style={{ borderRadius: '50%' }}
          component={<Icon icon="fa6-solid:arrow-up" />}
        />
        <div className="flex flex-col w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-between py-10">
            <div className="">
              <h4 className="text-2xl text-madPink font-bold">Never miss an update!</h4>
              <p className="mb-3 font-normal w-3/4">
                Signup for our newsletter for updates and exclusive offers that you wont find
                anywhere else.
              </p>
              <div id="mc_embed_signup">
                <form
                  action="https://MADinArt.us6.list-manage.com/subscribe/post?u=cde1cbb132266d2d5e712a678&amp;id=886212824a"
                  method="post"
                  id="mc-embedded-subscribe-form"
                  name="mc-embedded-subscribe-form"
                  className="validate"
                  target="_blank"
                  noValidate
                >
                  <div id="mc_embed_signup_scroll" className="flex items-center">
                    <div className="mc-field-group w-5/6">
                      <label htmlFor="mce-EMAIL" className="hidden">
                        Email Address <span className="asterisk">*</span>
                      </label>
                      <input
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Email address"
                        type="email"
                        value={email}
                        name="EMAIL"
                        className="block px-4 py-2 w-full text-gray-500 dark:bg-madBlack bg-madWhite border border-gray-500 rounded-full focus:border-madPink focus:outline-none focus:ring focus:ring-madPink dark:focus:text-dark-madWhite focus:text-light-madWhite"
                        id="mce-EMAIL"
                      />
                    </div>
                    <div hidden={true}>
                      <input readOnly={true} type="hidden" name="tags" value="3254174" />
                    </div>
                    <div id="mce-responses" className="clear ml-4">
                      <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                        <input
                          type="text"
                          name="b_cde1cbb132266d2d5e712a678_886212824a"
                          tabIndex={-1}
                        />
                      </div>
                      <button
                        type="submit"
                        value="Subscribe"
                        id="mc-embedded-subscribe"
                        className="relative flex items-center text-madPink ring-1 ring-madPink uppercase rounded-full py-2 px-3 tracking-[-0.08em] duration-300 hover:bg-madPink hover:text-madBlack hover:text-light-madBlack"
                      >
                        subscribe
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="">
              <h4 className="text-madPink text-xl font-semibold">Stay tuned & join the #MADFAM</h4>
              <p className="mb-3 font-normal w-3/4">
                Check out our social links below tp get more involved in the Mad community by
                following us
              </p>
              <div className="flex">
                <Link href="https://twitter.com/madnfts_io" external={true}>
                  <Icon
                    icon={'simple-icons:twitter'}
                    className="text-madGray hover:text-socialTwitter text-xl mr-4 ease-in duration-300"
                  />
                </Link>
                <Link
                  href="https://www.facebook.com/groups/928529377803550/?ref=share"
                  external={true}
                >
                  <Icon
                    icon={'simple-icons:facebook'}
                    className="text-madGray hover:text-socialFb text-xl mr-4 ease-in duration-300"
                  />
                </Link>
                <Link href="https://www.instagram.com/mad.nfts/" external={true}>
                  <Icon
                    icon={'simple-icons:instagram'}
                    className="text-madGray hover:text-socialInsta text-xl mr-4 ease-in duration-300"
                  />
                </Link>
                <Link
                  href="https://www.youtube.com/channel/UCDxsNWLuJHH1T9KYHErvp4w"
                  external={true}
                >
                  <Icon
                    icon={'simple-icons:youtube'}
                    className="text-madGray hover:text-socialYt text-xl mr-4 ease-in duration-300"
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="flex grid grid-cols-1 md:grid-cols-2 gap-12 pb-3">
            <div className="flex flex basis-1/2">
              <div>
                <img src="/logo.svg" alt="" width={44} className="mr-4" />
              </div>
              <p>
                MADNFTs, NFT launchpad and marketplace.
                <br />
                For Creators, by Creators.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 font-bold mb-4">
              <Link href="/" className="hover:text-madPink ease-in duration-300">
                Home
              </Link>
              <Link href="/marketplace" className="hover:text-madPink ease-in duration-300">
                Marketplace
              </Link>
              <Link href="/collections" className="hover:text-madPink ease-in duration-300">
                Collections
              </Link>
              <Link href="/creators" className="hover:text-madPink ease-in duration-300">
                Creators
              </Link>
              <Link href="/projects" className="hover:text-madPink ease-in duration-300">
                Projects
              </Link>
              <Link href="/academy" className="hover:text-madPink ease-in duration-300">
                Academy
              </Link>
              <Link
                external={true}
                href="https://academy.madnfts.io/about-us/"
                className="hover:text-madPink ease-in duration-300"
              >
                About us
              </Link>
              <Link
                external={true}
                href="https://madnfts.zendesk.com/hc/en-gb"
                className="hover:text-madPink ease-in duration-300"
              >
                FAQs
              </Link>
              <Link
                external={true}
                href="https://academy.madnfts.io/contact-us/"
                className="hover:text-madPink ease-in duration-300"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
        <div className="flex w-full border-t border-zinc-600 mx-auto" />
        <div className=" flex justify-between text-madGray">
          <div className="flex flex-col md:flex-row w-full pt-4 ">
            <div className="w-1/2">
              <p className="text-normal tracking-normal">
                Copyright MAD in Art Ltd, {new Date().getFullYear()} | 13321290
              </p>
            </div>
            <div className="flex justify-start gap-4 md:justify-end basis-1/2 mt-2 md:mt-0">
              <Link
                external={true}
                href="https://academy.madnfts.io/privacy-policy/"
                className="text-normal"
              >
                Privacy Policy
              </Link>
              <Link
                external={true}
                href="https://academy.madnfts.io/terms-and-conditions/"
                className="text-normal"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
        {/*
          // @ts-ignore */}
        <CookieConsent
          location="none"
          buttonText="Accept"
          buttonStyle={{
            color: '#16E7CF',
            fontSize: '15px',
            background: '#151619',
            border: '1px solid #16E7CF',
            borderRadius: '10px'
          }}
          cookieName="MADNFTsCookieStatus"
          style={{ background: '#151619' }}
          expires={150}
          enableDeclineButton
          declineButtonText="Decline"
          declineButtonStyle={{
            color: '#FF1A54',
            fontSize: '15px',
            background: '#151619',
            border: '1px solid #FF1A54',
            borderRadius: '10px'
          }}
          contentStyle={{ fontSize: '15px' }}
          buttonWrapperClasses="flex w-full justify-around"
          containerClasses="p-10 text-center lg:text-left max-w-[500px] top-[30%] m-auto left-0 right-0 bottom-auto rounded-lg"
          flipButtons
          overlay
          overlayStyle={{ backgroundColor: 'rgba(0,0,0,.6)', zIndex: 9999 }}
        >
          By clicking “Accept”, you agree to the use of cookies on your device to enhance your
          experience on our website. We do not store sensitive data in cookies.{' '}
          <a
            href="https://academy.madnfts.io/privacy-policy/"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Read more.
          </a>
        </CookieConsent>
      </footer>
    </div>
  )
}
