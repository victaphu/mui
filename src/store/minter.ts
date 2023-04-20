import { createSlice } from '@reduxjs/toolkit'

// 1 - Popup state for this slice; status: 'idle' | 'pending' | 'approving' | 'complete'
// idle = nothing going on
// pending = 'transaction' popup is shown requires user action in wallet to confirm transaction to mint
// approving = 'approval required' popup is shown requires user action in wallet to confirm transaction for 'Set approval for all'
// complete = 'complete' popup shown in success state once everything is confirmed
const initialState = {
  transaction: null,
  formData: null,
  loader: null,
  status: 'idle',
  error: null
}

// 2 - reducers for useDispatch()
const minterSlice = createSlice({
  name: 'minter',
  initialState,
  reducers: {
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
    formDataUpdated(state, action) {
      state.formData = action.payload
    },
    loaderUpdated(state, action) {
      state.loader = action.payload
    }
  }
})

// 3 - Async thunks for useDispatch()
// ...

// 4 - getters for useSelector()
export const getMinterTransaction = (state) => state.minter.transaction
export const getMinterStatus = (state) => state.minter.status
export const getMinterLoader = (state) => state.minter.loader
export const getMinterFormData = (state) => state.minter.formData
export const getMinterError = (state) => state.minter.error

// 5 - Export reducer and actions
export const {
  transactionAdded,
  transactionUpdated,
  transactionDeleted,
  statusUpdated,
  loaderUpdated,
  formDataUpdated
} = minterSlice.actions
export default minterSlice.reducer
