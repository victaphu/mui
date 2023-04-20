import { Icon } from '@iconify/react'
import React from 'react'
import Link from '../components/common/link'

const NotFoundPage = (): JSX.Element => {
  return (
    <section className="flex h-full flex-col min-h-screen bg-gradient-to-t from-madBlack bg-[url('/bg-404.jpg')] bg-no-repeat bg-cover p-6">
      <div className="p-10 md:p-20 bg-opacity-50 dark:bg-madCarbon bg-madWhite border border-madPink rounded-xl max-w-2xl m-auto text-center">
        <h1 className="text-6xl dark:text-dark-madWhite text-light-madWhite font-black tracking-[-0.08em]">
          <strong>
            <span className="text-madPink">404</span>
          </strong>
          <br />
          <strong>Error</strong>
        </h1>
        <hr className="small border-madPink m-5" />
        <p className="mb-6">
          We could not find the page you requested. <br />
          Use the navigation to search our NFT Marketplace.
        </p>
        <Link
          href="/marketplace"
          className="w-[15em] text-center justify-center m-auto relative flex items-center text-madBlue ring-1 text-sm ring-madBlue uppercase rounded-full py-1.5 px-3 tracking-[-0.08em] duration-300 hover:bg-madBlue dark:hover:text-madBlack hover:text-madBlack"
        >
          <div className="absolute inset-0 w-full h-full ring-madBlue/80 ring-opacity-80 rounded-full duration-300 hover:ring-4 hover:animate-pulse" />
          <Icon icon="fa6-solid:store" className="fa-solid fa-store mr-1" />
          <span>Browse Marketplace</span>
        </Link>
      </div>
    </section>
  )
}
export default NotFoundPage
