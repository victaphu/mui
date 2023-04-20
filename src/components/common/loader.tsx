// @typed - MH
import React from 'react'

export default function Loader({
  text,
  className,
  imgClassName
}: {
  text?: string
  className?: string
  imgClassName?: string
}): JSX.Element {
  return text ? (
    <div className={`${className ? className : 'flex flex-col justify-center m-auto'}`}>
      <div className="flex justify-center m-auto">
        <img
          src="/loader.svg"
          className={`${imgClassName ? imgClassName : 'w-8 h-8 m-auto'} animate-spin duration-1000`}
          alt="Loading"
        />
      </div>
      <div>{text}</div>
    </div>
  ) : (
    <div className={`${className ? className : 'flex justify-center m-auto'}`}>
      <img
        src="/loader.svg"
        className={`${imgClassName ? imgClassName : 'w-8 h-8 m-auto'} animate-spin duration-1000`}
        alt="Loading"
      />
    </div>
  )
}
