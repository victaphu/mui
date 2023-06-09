import { Html, Head, Main, NextScript } from 'next/document'
import Header from '../components/common/header'
import React from 'react'

export default function Document(): JSX.Element {
  return (
    <Html>
      <Head>
        <Header />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* @ts-ignore */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
