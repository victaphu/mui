import React from 'react'
import cn from 'classnames'
import Toast from './toast'
import { useDispatch, useSelector } from 'react-redux'
import { getToasts, toastDeleted } from '../../store/toaster'

export default function ToastBoard(): JSX.Element {
  const dispatch = useDispatch()
  const toasts = useSelector(getToasts)
  return (
    <div className={cn('fixed top-16 right-0 z-50', 'transition-spacing duration-200 ease-in-out')}>
      {toasts && (
        <div className={cn('p-4', 'flex flex-col')}>
          {toasts.map((toast) => (
            <Toast
              type={toast.type}
              title={toast.title}
              message={toast.message}
              expire={toast.expire}
              onExpire={() => {
                dispatch(toastDeleted(toast.uid))
              }}
              key={toast.uid}
            />
          ))}
        </div>
      )}
    </div>
  )
}
