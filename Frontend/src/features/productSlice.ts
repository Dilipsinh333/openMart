import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  message: null,
  products: [],
};

const productSlice = createSlice({
  name: "products",
  initialState: initialState,
  reducers: {
    START_PRODUCT_FETCHING: (state) => {
      state.loading = true;
    },
    FETCH_PRODUCTS: (state, action) => {
      state.loading = false;
      state.products = action.payload;
    },
    FETCH_PRODUCT_ERROR: (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
      state.message = action.payload.message;
    },
  },
});

export const { START_PRODUCT_FETCHING, FETCH_PRODUCTS, FETCH_PRODUCT_ERROR } =
  productSlice.actions;
export default productSlice.reducer;
