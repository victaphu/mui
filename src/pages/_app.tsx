import '../styles/globals.css'
import '../styles/app.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { AppProps } from 'next/app'
import cn from 'classnames'
import Script from 'next/script'
import Navigation from '../components/common/navigation'
import Footer from '../components/common/footer'
import ToastBoard from '../components/toaster/board'
import { Provider } from 'react-redux'
import store from '../store/store'
import { AuthGuard } from '../containers/authGuard'
import { getCookieConsentValue } from 'react-cookie-consent'
import { ThemeProvider } from 'next-themes'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { wagmiAdapters } from '../constants/network'
import connectors from '../utils/connectors'
import { polygon, polygonMumbai, skaleCalypso, skaleEuropa } from 'viem/chains'

const cookieStatus = getCookieConsentValue('MADNFTsCookieStatus')

const { publicClient } = configureChains([polygonMumbai, polygon, skaleCalypso, skaleEuropa], [publicProvider()])

console.log(Object.values(connectors))
const config = createConfig({
  autoConnect: true,
  publicClient
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {cookieStatus === 'true' && process.env.NEXT_PUBLIC_GA_ID ? (
        <>
          <Script
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
          <Script id="google-analytics" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}
          </Script>
        </>
      ) : (
        ''
      )}

      <WagmiConfig config={config}>
        <Provider store={store}>
          <ThemeProvider attribute="class">
            <div
              id="root"
              className={cn(
                'font-sans overflow-x-hidden',
                'bg-madWhite text-madBlack',
                'dark:bg-madBlack dark:text-madWhite'
              )}
            >
              <div className={''}>
                <div className="nav-fixing" style={{ paddingTop: '72px' }}>
                  <Navigation />
                  <AuthGuard>
                    <div className={'h-page overflow-y-auto overflow-x-hidden'}>
                      {/* @ts-ignore */}
                      <Component className={'mt-16'} {...pageProps} />
                      <Footer {...pageProps} />
                    </div>
                  </AuthGuard>
                </div>
                <ToastBoard />
              </div>
            </div>
          </ThemeProvider>
        </Provider>
      </WagmiConfig>
    </>
  )
}

export default MyApp
