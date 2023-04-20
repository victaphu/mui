export type ToastType = 'error' | 'success' | 'warning'

export interface ToastData {
  type: ToastType
  title: string
  message: string
  expire?: number
}
