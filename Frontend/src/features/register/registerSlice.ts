import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isRegistered: false,
  loading: false,
  error: null,
  message: null,
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    registerError: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.error = action.payload.error;
      state.isRegistered = false;
    },
    startRegister: (state) => {
      state.loading = true;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.isRegistered = true;
      state.error = null;
    },
  },
});

export const { registerError, registerSuccess, startRegister } =
  registerSlice.actions;
export default registerSlice.reducer;
