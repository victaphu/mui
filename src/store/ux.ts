import { createSlice } from '@reduxjs/toolkit'

// 1 - state for this slice:
// category: users selected site from the menu, MADX, MADMETA etc
const initialState = {
  site: 1,
  sidebarOpen: true,
  imageUploading: false
}

// 2 - reducers for useDispatch()
const uxSlice = createSlice({
  name: 'ux',
  initialState,
  reducers: {
    uxAdded(state, action) {
      state[action.payload.key] = action.payload.value
    },
    uxDeleted(state, action) {
      state[action.payload.key] = initialState[action.payload.key]
    }
  }
})

// 3 - Async thunks for useDispatch()
// ...

// 4 - getters for useSelector()
export const getUxSite = (state) => state.ux.site
export const getSidebarOpen = (state) => state.ux.sidebarOpen
export const getImageUploading = (state) => state.ux.imageUploading

// 5 - Export reducer and actions
export const { uxAdded, uxDeleted } = uxSlice.actions
export default uxSlice.reducer
