import { createSlice } from '@reduxjs/toolkit'
import Swal from 'sweetalert2'
const initialState = {
    cartItems: [],
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.cartItems.find(item => item._id === action.payload._id);
            if (!existingItem) {
                state.cartItems.push(action.payload);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Your work has been saved",
                    showConfirmButton: false,
                    timer: 800
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: " item already exists",
                });
            }
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item._id !== action.payload._id)
        },
        clearItems: (state) => {
            state.cartItems = []
        }
    },
})

// Action creators are generated for each case reducer function
export const { addToCart, removeFromCart, clearItems } = cartSlice.actions

export default cartSlice.reducer