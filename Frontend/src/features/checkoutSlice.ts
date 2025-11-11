import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOrderPlaced: false,
  loading: false,
  error: null,
  message: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    CHECKOUT_ERROR: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.error = action.payload.error;
      state.isOrderPlaced = false;
    },
    START_CHECKOUT: (state) => {
      state.loading = true;
    },
    CHECKOUT_SUCCESS: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.isOrderPlaced = true;
      state.error = null;
    },
  },
});

export const { CHECKOUT_ERROR, CHECKOUT_SUCCESS, START_CHECKOUT } =
  checkoutSlice.actions;
export default checkoutSlice.reducer;
