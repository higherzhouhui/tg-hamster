import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const balanceSlice = createSlice({
    name: 'balance',
    initialState: {
        TokenWallet: '0'
    },
    reducers: {
        setTokenWallet(state, action) {
            state.TokenWallet = action.payload
        }
    }
})

export const { setTokenWallet } = balanceSlice.actions

export default balanceSlice.reducer

export const loadBalanceData = createAsyncThunk(
    'balance/fetchBalanceData',
    async (data, { dispatch }) => {
        console.log(data)
        // dispatch(setTokenWallet(data))
    }
)
