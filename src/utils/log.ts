export const log = (key: string, message, type = 'info') => {
  const color =
    type === 'warning'
      ? '#FBBC04'
      : type === 'error'
      ? '#FF1A54'
      : type === 'success'
      ? '#12F452'
      : type === 'info'
      ? '#1DA1F2'
      : '#1F2125'
  console.debug(`%c${key}`, `color: ${color}`, message)
}
