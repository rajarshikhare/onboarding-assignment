// features/cart/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: [],
    },
    reducers: {
        addItem: (state, action) => {
            const item = state.cartItems.find(i => i.id === action.payload.id)
            if(item) {
                item.quantity += 1
                return
            }
            state.cartItems.push({quantity: 1, ...action.payload});
        },
        removeItem: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
        },
        clearCart: (state) => {
            state.cartItems = [];
        },
    },
});

// Export actions
export const { addItem, removeItem, clearCart } = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;
