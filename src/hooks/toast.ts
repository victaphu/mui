import { useDispatch } from 'react-redux'
import { toastAdded } from '../store/toaster'

export default function useToaster() {
  const dispatch = useDispatch()
  const add = (title: string, message: string, type: string, expire?: number) => {
    dispatch(toastAdded({ title, message, type, expire: expire ?? 12000 }))
  }
  return {
    success: (title, message, expire = null) => {
      add(title, message, 'success', expire)
    },
    error: (title, message, expire = null) => {
      add(title, message, 'error', expire)
    },
    warning: (title, message, expire = null) => {
      add(title, message, 'warning', expire)
    }
  }
}
