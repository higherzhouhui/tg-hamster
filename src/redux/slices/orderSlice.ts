import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        CancelOrders: [],
        FillOrders: [],
        AllOrders: []
    },
    reducers: {
        setCancelOrders(state, action) {
            state.CancelOrders = action.payload
        }
    }
})

export const { setCancelOrders } = orderSlice.actions

export default orderSlice.reducer

export const loadCancelOrderData = createAsyncThunk(
    'order/fetchCancelOrderData',
    async (data, { dispatch }) => {
        const { exchange } = data as any

        const result = await exchange.getPastEvents('Cancel', {
            fromBlock: 0,
            toBlock: 'latest'
        })
        const cancelOrders = result.map((item: any) => item.returnValues)
        dispatch(setCancelOrders(cancelOrders))
    }
)
