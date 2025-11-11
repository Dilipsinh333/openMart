import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  message: null,
  orders: [],
};

const orderSlice = createSlice({
  name: "orders",
  initialState: initialState,
  reducers: {
    START_ORDER_FETCHING: (state) => {
      state.loading = true;
    },
    FETCH_ORDERS: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    FETCH_ORDER_ERROR: (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
      state.message = action.payload.message;
    },
  },
});

export const { START_ORDER_FETCHING, FETCH_ORDERS, FETCH_ORDER_ERROR } =
  orderSlice.actions;
export default orderSlice.reducer;
