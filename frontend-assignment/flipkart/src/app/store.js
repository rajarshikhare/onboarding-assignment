// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../cartdetails/cartSlice';
import filterReducer from "../productpage/filterSlice";

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        filter: filterReducer
    },
});
