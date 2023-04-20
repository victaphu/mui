import { createSlice } from '@reduxjs/toolkit'
import UIDGenerator from 'uid-generator'
const uidgen = new UIDGenerator()

// 1 - State for this slice
const initialState = {
  toasts: []
}

// 2 - reducers for useDispatch()
const toasterSlice = createSlice({
  name: 'toaster',
  initialState,
  reducers: {
    toastAdded(state, action) {
      const uid = uidgen.generateSync()
      state.toasts = [
        ...state.toasts,
        {
          ...action.payload,
          uid: uid
        }
      ]
    },
    toastDeleted(state, action) {
      let filtered = [...state.toasts]
      filtered = filtered.filter((toast) => toast.uid != action.payload)
      state.toasts = filtered
    }
  }
})

// 3 - Async thunks for useDispatch()
// ...

// 4 - getters for useSelector()
export const getToasts = (state) => state.toaster.toasts

// 5 - Export reducer and actions
export const { toastAdded, toastDeleted } = toasterSlice.actions
export default toasterSlice.reducer
