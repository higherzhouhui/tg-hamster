import { configureStore } from '@reduxjs/toolkit'
import balanceSlice from './slices/balanceSlice'
import orderSlice from './slices/orderSlice'
import userSlice from './slices/userSlice'
const store = configureStore({
  reducer: {
    balance: balanceSlice,
    order: orderSlice,
    user: userSlice,
  },
  middleware:getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false
  })
})

export default store
