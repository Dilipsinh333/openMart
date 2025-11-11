import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  message: null,
  products: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    START_CART_PRODUCT_FETCHING: (state) => {
      state.loading = true;
    },
    FETCH_CART_PRODUCTS: (state, action) => {
      state.loading = false;
      state.products = action.payload;
    },
    FETCH_CART_PRODUCT_ERROR: (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
      state.message = action.payload.message;
    },
  },
});

export const {
  START_CART_PRODUCT_FETCHING,
  FETCH_CART_PRODUCTS,
  FETCH_CART_PRODUCT_ERROR,
} = cartSlice.actions;
export default cartSlice.reducer;
