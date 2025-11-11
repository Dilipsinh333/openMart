import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  message: null,
  offers: [],
};

const offerSlice = createSlice({
  name: "offers",
  initialState: initialState,
  reducers: {
    START_OFFER_FETCHING: (state) => {
      state.loading = true;
    },
    FETCH_OFFERS: (state, action) => {
      state.loading = false;
      state.offers = action.payload;
    },
    FETCH_OFFER_ERROR: (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
      state.message = action.payload.message;
    },
  },
});

export const { START_OFFER_FETCHING, FETCH_OFFERS, FETCH_OFFER_ERROR } =
  offerSlice.actions;
export default offerSlice.reducer;
