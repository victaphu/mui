import { configureStore } from '@reduxjs/toolkit'
import userSlice from './user'
import web3Slice from './web3'
import createDropSlice from './createDrop'
import minterSlice from './minter'
import collectionSlice from './collection'
import traderSlice from './trader'
import toasterSlice from './toaster'
import uxSlice from './ux'
export const store = configureStore({
  reducer: {
    user: userSlice,
    web3: web3Slice,
    createDrop: createDropSlice,
    minter: minterSlice,
    collection: collectionSlice,
    trader: traderSlice,
    toaster: toasterSlice,
    ux: uxSlice
  }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
