import { createSlice } from '@reduxjs/toolkit'

// 1 - Popup state for this slice; status: 'idle' | 'pending' | 'approving' | 'complete'
// idle = nothing going on
// pending = 'transaction' popup is shown requires user action in wallet to confirm transaction to mint
// approving = 'approval required' popup is shown requires user action in wallet to confirm transaction for 'Set approval for all'
// complete = 'complete' popup shown in success state once everything is confirmed
const initialState = {
  tradeType: null,
  tradeAsset: null,
  transaction: null,
  loader: null,
  status: 'idle',
  error: null
}

// 2 - reducers for useDispatch()
const traderSlice = createSlice({
  name: 'trader',
  initialState,
  reducers: {
    tradeTypeAdded(state, action) {
      state.tradeType = action.payload
    },
    tradeTypeDeleted(state) {
      state.tradeType = null
    },
    tradeAssetAdded(state, action) {
      state.tradeAsset = { ...action.payload }
    },
    tradeAssetUpdated(state, action) {
      state.tradeAsset = { ...state.tradeAsset, ...action.payload }
    },
    tradeAssetDeleted(state) {
      state.tradeAsset = initialState.tradeAsset
    },
    transactionAdded(state, action) {
      state.transaction = action.payload
    },
    transactionUpdated(state, action) {
      state.transaction = { ...state.transaction, ...action.payload }
    },
    transactionDeleted(state) {
      state.transaction = initialState.transaction
    },
    statusUpdated(state, action) {
      state.status = action.payload
    },
    loaderUpdated(state, action) {
      state.loader = action.payload
    }
  }
})

// 3 - Async thunks for useDispatch()
// ...

// 4 - getters for useSelector()
export const getTradeType = (state) => state.trader.tradeType
export const getTradeAsset = (state) => state.trader.tradeAsset
export const getTraderStatus = (state) => state.trader.status
export const getTraderTransaction = (state) => state.trader.transaction
export const getTraderLoader = (state) => state.trader.loader
export const getTraderError = (state) => state.trader.error

// 5 - Export reducer and actions
export const {
  tradeTypeAdded,
  tradeTypeDeleted,
  tradeAssetAdded,
  tradeAssetUpdated,
  tradeAssetDeleted,
  transactionAdded,
  transactionUpdated,
  transactionDeleted,
  statusUpdated,
  loaderUpdated
} = traderSlice.actions
export default traderSlice.reducer
