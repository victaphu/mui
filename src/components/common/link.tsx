// @typed - MH
import React from 'react'
import cn from 'classnames'
import NextLink from 'next/link'

export default function Link({
  children,
  href,
  className,
  external
}: {
  children: JSX.Element | JSX.Element[] | string
  href: string
  className?: string
  external?: boolean
}): JSX.Element {
  const linkClassNames = cn(
    'block',
    'focus-visible:ring-1 focus-visible:ring-inset',
    'focus-visible:ring-primary',
    className
  )
  if (external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClassNames}>
        {children}
      </a>
    )
  return (
    <NextLink href={href} passHref>
      <span className={linkClassNames}>{children}</span>
    </NextLink>
  )
}
