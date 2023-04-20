import { createSlice } from '@reduxjs/toolkit'
import { defaultNetwork } from '../constants/config'
import { findNetworkByName } from '../utils/network'

// 1 - State for this slice
const initialState = {
  currentNetwork: findNetworkByName(defaultNetwork),
  showWallet: false,
  web3AuthRequired: false,
  apiAuthRequired: false,
  networkError: null,
  backgroundFuel: {
    privateKey: null,
    address: null
  }
}

// 2 - reducers for useDispatch()
const web3Slice = createSlice({
  name: 'web3',
  initialState,
  reducers: {
    showWallet(state) {
      state.showWallet = true
    },
    hideWallet(state) {
      state.showWallet = false
    },
    changeNetwork(state, action) {
      state.currentNetwork = action.payload
    },
    web3AuthRequiredAdded(state, action) {
      state.web3AuthRequired = action.payload
    },
    apiAuthRequiredAdded(state, action) {
      state.apiAuthRequired = action.payload
    },
    networkErrorAdded(state, action) {
      state.networkError = action.payload
    },
    backgroundFuelAdded(state, action) {
      state.backgroundFuel = action.payload
    }
  }
})

// 3 - Async thunks for useDispatch()
// ...

// 4 - getters for useSelector()
export const getShowWallet = (state) => state.web3.showWallet
export const getCurrentNetwork = (state) => state.web3.currentNetwork
export const getApiAuthRequired = (state) => state.web3.apiAuthRequired
export const getWeb3AuthRequired = (state) => state.web3.web3AuthRequired
export const getNetworkError = (state) => state.web3.networkError
export const getBackgroundFuel = (state) => state.web3.backgroundFuel

// 5 - Export reducer and actions
export const {
  showWallet,
  hideWallet,
  changeNetwork,
  web3AuthRequiredAdded,
  apiAuthRequiredAdded,
  networkErrorAdded,
  backgroundFuelAdded
} = web3Slice.actions
export default web3Slice.reducer
