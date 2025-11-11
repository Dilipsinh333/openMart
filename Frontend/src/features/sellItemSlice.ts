import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sellSuccess: false,
  loading: false,
  error: null,
  message: null,
};

const registerSlice = createSlice({
  name: "sellItems",
  initialState,
  reducers: {
    sellItemsFormError: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.error = action.payload.error;
      state.sellSuccess = false;
    },
    startLoading: (state) => {
      state.loading = true;
    },
    sellItemsFormSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.sellSuccess = true;
      state.error = null;
    },
  },
});

export const { startLoading, sellItemsFormError, sellItemsFormSuccess } =
  registerSlice.actions;
export default registerSlice.reducer;
