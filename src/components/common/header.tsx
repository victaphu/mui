// @typed - MH
import React from 'react'

export default function Header({
  title,
  description,
  image
}: {
  title?: string
  description?: string
  image?: string
}): JSX.Element {
  return (
    <>
      <title>{title}</title>
      <meta id="og-title" property="og:title" content={title} />
      <meta id="og-description" property="og:description" content={description} />
      <meta id="og-image" property="og:image" content={image} />
      <meta id="twitter-title" property="twitter:title" content={title} />
      <meta id="twitter-description" property="twitter:description" content={description} />
      <meta id="twitter-image" property="twitter:image" content={image} />
      <meta name="msapplication-TileColor" content="#1235ba" />
      <meta name="theme-color" content="#1A1A1A" />
      {image && image.includes('.gif') ? <meta content="image/gif" property="og:image:type" /> : ''}
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
    </>
  )
}
