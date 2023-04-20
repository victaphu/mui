import { createSlice } from '@reduxjs/toolkit'

// 1 - Popup state for this slice; status: 'idle' | 'pending' | 'complete'
// idle = nothing going on
// pending = 'transaction' popup is shown requires user action in wallet to confirm transaction to create
// complete = 'complete' popup shown in success state once everything is confirmed
const initialState = {
  transaction: null,
  formData: null,
  loader: null,
  status: 'idle',
  error: null
}

// 2 - reducers for useDispatch()
const collectionSlice = createSlice({
  name: 'collection',
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
export const getCollectionTransaction = (state) => state.collection.transaction
export const getCollectionStatus = (state) => state.collection.status
export const getCollectionLoader = (state) => state.collection.loader
export const getCollectionFormData = (state) => state.collection.formData
export const getCollectionError = (state) => state.collection.error

// 5 - Export reducer and actions
export const {
  transactionAdded,
  transactionUpdated,
  transactionDeleted,
  statusUpdated,
  loaderUpdated,
  formDataUpdated
} = collectionSlice.actions
export default collectionSlice.reducer
