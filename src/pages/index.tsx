import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import TopCreators from '../components/dataList/topCreators'
import TopCollections from '../components/dataList/topCollections'
import TrendingCollections from '../components/dataList/trendingCollections'
import TradeClosingSoon from '../components/dataList/tradeClosingSoon'
import { abbreviateNumber, formatImageUrl } from '../utils/utils'
import Slider from 'react-slick'
import client from '../utils/client'
import Link from '../components/common/link'
import { homeBanners } from '../constants/content'
import { domain } from '../constants/domain'

const HomePage = (): JSX.Element => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 600,
    autoplaySpeed: 12000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    fade: true,
    adaptiveHeight: true,
    pauseOnHover: false
  }
  const [siteData, setSiteData] = useState(null)

  useEffect(() => {
    if (!siteData) {
      client.get(`${domain.apiUrl}/stats/sum`).then((res) => {
        setSiteData(res.data)
      })
    }
  }, [siteData])

  return (
    <>
      <section className="flex flex-col mb-8">
        <Slider
          {...settings}
          className="color-madPink pb-4 slick-slider-block-dots animate-in fade-in duration-800"
        >
          {homeBanners.map((a) => (
            <div
              key={a.id}
              className="animate-in fade-in duration-600 delay-600 relative swiper-slide p-6 pb-12 md:pb-12 md:p-20 md:py-10"
            >
              <video
                className="absolute object-cover h-full w-full top-0 left-0"
                muted={true}
                autoPlay={true}
                playsInline={true}
                loop={true}
                poster={formatImageUrl(a.bgImage)}
              >
                {a.video && <source src={formatImageUrl(a.video)} type="video/mp4" />}
              </video>
              <div className="container m-auto relative shadow-2xl rounded-3xl overflow-hidden p-0">
                <img
                  src={formatImageUrl(a.image)}
                  className="hidden md:block absolute object-cover h-full w-full"
                  alt=""
                />
                <h1 className="relative text-6xl p-6 md:px-32 md:py-16 md:max-w-[980px] font-medium text-madWhite dark:text-madWhite">
                  {a.title}
                  <span>.</span>
                </h1>
                {a.link && (
                  <div className="relative bottom-0 p-6 z-1 flex flex-col md:flex-row justify-between right-0 left-0">
                    <Link
                      className="text-lg text-dark-madWhite flex items-center rounded-full py-4 whitespace-nowrap md:mr-2 text-center mt-auto justify-center px-5 duration-300 border border-zinc-600 capitalize font-bold text-madWhite bg-opacity-40 dark:bg-opacity-40 bg-madCarbon dark:bg-madCarbon hover:bg-madPink dark:hover:bg-madPink"
                      href={a.link}
                    >
                      {a.linkText}
                    </Link>

                    <div className="text-lg mt-2 grid grid-cols-2 gap-2 lg:grid-cols-4">
                      {siteData &&
                        siteData.map((data) => (
                          <div
                            key={data.name + 'stats'}
                            className="animate-in justify-center fade-in rounded-full flex flex-col items-center py-3 px-8 border border-zinc-600 capitalize text-madWhite bg-opacity-40 dark:bg-opacity-40 bg-madCarbon dark:bg-madCarbon"
                          >
                            <span className="leading-none">{abbreviateNumber(data.value)}</span>
                            <span className="text-gray-400 leading-none whitespace-nowrap">
                              {data.label}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </section>

      <section className="flex flex-col mb-8">
        <div className="mb-0 flex flex-col xl:flex-row mx-6 md:mx-20 columns-2 items-start">
          <h2 className="text-4xl dark:text-dark-madWhite text-light-madWhite font-black tracking-[-0.08em] flex items-center mb-6">
            <Icon icon="fa6-solid:layer-group" className="h-6 text-madPink" />
            Trending<span className="text-madPink">Collections</span>.
          </h2>
        </div>
        <div>
          <TrendingCollections />
        </div>
      </section>

      <section className="flex flex-col">
        <div className="mb-0 flex flex-col xl:flex-row mx-6 md:mx-20 columns-2 items-start">
          <div className="w-full xl:w-1/2 xl:pr-4 mb-16">
            <TopCollections />
          </div>
          <div className="w-full xl:w-1/2 xl:pl-4 mb-16">
            <TopCreators buttonLink="/creators" buttonText="Explore all Creators" />
          </div>
        </div>
      </section>

      <section className="flex flex-col mb-8">
        <div className="mb-0 flex flex-col xl:flex-row mx-6 md:mx-20 columns-2 items-start">
          <h2 className="text-4xl dark:text-dark-madWhite text-light-madWhite font-black tracking-[-0.08em] flex items-center mb-6">
            <Icon icon="fa6-solid:fire-flame-curved" className="h-6 text-madPink" />
            Closing<span className="text-madPink">Soon</span>.
          </h2>
        </div>
        <div>
          <TradeClosingSoon />
        </div>
      </section>
    </>
  )
}

export default HomePage
