import axios from 'axios'
import { environment } from '../constants/config'
const client = axios.create()
const delay = false
client.defaults.withCredentials = true
client.defaults.xsrfCookieName = 'XSRF-TOKEN'
client.defaults.xsrfHeaderName = 'X-XSRF-TOKEN'

export function sleep(ms = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// add artificial delay for dev env if desired
client.interceptors.response.use(async (response) => {
  if (environment === 'local' && delay) {
    await sleep(Math.random() * (8000 - 2000) + 2000)
  }
  return response
})
export default client
