import { createSlice } from '@reduxjs/toolkit'
import { CreateDrop } from '../types/nft'

// 1 - State for this slice; status: 'pending' | 'loading' | 'complete' | 'error'
const initialState = {
  createDrop: <CreateDrop>{ step: 2 },
  status: 'pending',
  error: null
}

// 2 - reducers for useDispatch()
const createDropSlice = createSlice({
  name: 'createDrop',
  initialState,
  reducers: {
    createDropAdded(state, action) {
      state.createDrop = action.payload
    },
    createDropUpdated(state, action) {
      state.createDrop = { ...state.createDrop, ...action.payload }
    },
    createDropDeleted(state) {
      state.createDrop = { ...state.createDrop }
    }
  }
})

// 3 - Async thunks for useDispatch()
// .. save collection and nfts to API ...
// .. submit to contract actions ...

// 4 - getters for useSelector()
export const getCreateDrop = (state): CreateDrop => state.createDrop.createDrop
export const getCreateDropStatus = (state) => state.createDrop.status
export const getCreateDropError = (state) => state.createDrop.error

// 5 - Export reducer and actions
export const { createDropAdded, createDropUpdated, createDropDeleted } = createDropSlice.actions
export default createDropSlice.reducer
