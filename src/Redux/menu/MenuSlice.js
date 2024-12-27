import { createSlice } from '@reduxjs/toolkit'
import Swal from 'sweetalert2'
const initialState = {
    cartItems: [],
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        AuthUser: (state, action) => {

        }
    },
})

// Action creators are generated for each case reducer function
export const { addToCart, removeFromCart, clearItems } = cartSlice.actions

export default cartSlice.reducer