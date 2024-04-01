// features/cart/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { productCat, sortBy } from './Constant';

export const filterSlice = createSlice({
    name: 'filter',
    initialState: {
        priceMax: 100000,
        priceMin: 0,
        category: [],
        sort: new Set([sortBy.desc.value])
    },
    reducers: {
        onChange: (state, action) => {
            const { name, value } = action.payload
            state[name] = value;
        },
    },
});

// Export actions
export const { onChange } = filterSlice.actions;

// Export reducer
export default filterSlice.reducer;
