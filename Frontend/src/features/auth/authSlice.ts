import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  role: string | null;
  userId: string | null;
  email: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  role: null,
  userId: null,
  email: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startLogin: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isLoggedIn = true;
      state.role = action.payload.role ?? null;
      state.userId = action.payload.userId ?? null;
      state.email = action.payload.email ?? null;
      state.error = null; // Clear any previous errors
    },
    loginError: (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.role = null;
      state.userId = null;
      state.email = null;
    },
  },
});

export const { startLogin, loginSuccess, loginError, logout } =
  authSlice.actions;
export default authSlice.reducer;
